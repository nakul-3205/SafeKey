import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { logger } from "../utils/logger";
import { users } from "../db/schema/users.schema";
import { ApiError } from "../utils/apiError";
import { ERROR_CODES } from "../utils/errorCodes";
import { hashPassword,comparePassword,generateResetToken,hashToken,compareToken } from "../utils/bcrypt";
import { generateAccessToken,generateRefreshToken,verifyAccessToken,verifyRefreshToken } from "../utils/jwt";
import { storeOtp, verifyOtp, deleteOtp } from "./otp.service"
import { sendEmail } from "./email.service";
import { generateOtp } from "../utils/otp";
import { otpEmailTemplate } from "../utils/mail/mail.template";
import { aw } from "@upstash/redis/zmscore-DhpQcqpW";
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    //Signup
    async signup(email:string,password:string):Promise<void>{
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });
        if (existingUser) {
            if(existingUser.is_verified){
                throw new ApiError(
                    409,
                    "User with this email already exists",
                    ERROR_CODES.USER_EXISTS
                )}
                const otp = generateOtp();
                await storeOtp(`signup:${email}`, otp, 300);
                await sendEmail(
                    email,
                    "Verify Your Email - SafeKey",
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome back to SafeKey!</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
            `
            )
                logger.info({ email }, "Unverified user re-signup, OTP resent");
        return;

        }
        const hashedPassword=await hashPassword(password)
        await db.insert(users).values({
            email,
            password: hashedPassword,
            is_verified: false,
        });
        const otp = generateOtp();
        await storeOtp(`signup:${email}`, otp, 300);

        await sendEmail(email,
            "Verify Your Email - SafeKey",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to SafeKey!</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
    <p>This code will expire in 5 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    </div>
    `
    );
    logger.info({ email }, "Signup initiated, OTP sent");

    }

    async verifyOTP(email: string, otp: string): Promise<AuthTokens> {
        const otpKey = `signup:${email}`;


        const isValid = await verifyOtp(otpKey, otp);
        if (!isValid) {
        throw new ApiError(
            400,
            "Invalid or expired OTP",
            ERROR_CODES.INVALID_OTP
        );
        }


        const result = await db
            .update(users)
            .set({ is_verified: true })
            .where(eq(users.email, email))
            .returning();

            if (result.length === 0) {
            throw new ApiError(404, "User not found", ERROR_CODES.USER_NOT_FOUND);
            }

            const user = result[0];


            await deleteOtp(otpKey);


            const accessToken = generateAccessToken({
            user_id: user.user_id,
            email: user.email,
            });
            const refreshToken = generateRefreshToken({
            user_id: user.user_id,
            email: user.email,
            });


            const refreshTokenHash = await hashToken(refreshToken);
            await db
            .update(users)
            .set({ refresh_token_hash: refreshTokenHash })
            .where(eq(users.user_id, user.user_id));

            logger.info({ user_id: user.user_id, email }, "Email verified successfully, user auto-logged in");

            return { accessToken, refreshToken };
    }

    async login(email:string,password:string){
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
  
      if (!user) {
        throw new ApiError(
          401,
          "Invalid email or password",
          ERROR_CODES.INVALID_CREDENTIALS
        );
      }
  
      // Check if verified
      if (!user.is_verified) {
        throw new ApiError(
          403,
          "Email not verified. Please verify your email first.",
          ERROR_CODES.EMAIL_NOT_VERIFIED
        );
      }
  
      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(
          401,
          "Invalid email or password",
          ERROR_CODES.INVALID_CREDENTIALS
        );
      }
  
      // Generate tokens
      const accessToken = generateAccessToken({
        user_id: user.user_id,
        email: user.email,
      });
      const refreshToken = generateRefreshToken({
        user_id: user.user_id,
        email: user.email,
      });
  
      // Store hashed refresh token
      const refreshTokenHash = await hashToken(refreshToken);
      await db
        .update(users)
        .set({ refresh_token_hash: refreshTokenHash })
        .where(eq(users.user_id, user.user_id));
  
      logger.info({ user_id: user.user_id, email }, "User logged in");
  
      return { accessToken, refreshToken };
    }
    
    
    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);
    
        // Find user
        const user = await db.query.users.findFirst({
          where: eq(users.user_id, payload.user_id),
        });
    
        if (!user || !user.refresh_token_hash) {
          throw new ApiError(
            401,
            "Invalid refresh token",
            ERROR_CODES.INVALID_TOKEN
          );
        }
    
        // Verify refresh token matches stored hash
        const isValid = await compareToken(refreshToken, user.refresh_token_hash);
        if (!isValid) {
          throw new ApiError(
            401,
            "Invalid refresh token",
            ERROR_CODES.INVALID_TOKEN
          );
        }
    
        // Generate new tokens (token rotation)
        const newAccessToken = generateAccessToken({
          user_id: user.user_id,
          email: user.email,
        });
        const newRefreshToken = generateRefreshToken({
          user_id: user.user_id,
          email: user.email,
        });
    
        // Update stored refresh token
        const newRefreshTokenHash = await hashToken(newRefreshToken);
        await db
          .update(users)
          .set({ refresh_token_hash: newRefreshTokenHash })
          .where(eq(users.user_id, user.user_id));
    
        logger.info({ user_id: user.user_id }, "Tokens refreshed");
    
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
      }
    
      // 5. FORGOT PASSWORD - Send reset token via email
        async forgotPassword(email: string): Promise<void> {
          const normalizedEmail = email.toLowerCase().trim();
        
          const user = await db.query.users.findFirst({
            where: eq(users.email, normalizedEmail),
          });
        
          if (!user) {
            logger.warn({ email: normalizedEmail }, "Password reset requested for non-existent user");

            throw new ApiError(
              400,
              "User doesnot exist",
              ERROR_CODES.USER_NOT_FOUND
            )

          }
          const otp = generateOtp();
          await storeOtp(`reset:${normalizedEmail}`, otp, 300); // 5 min

          await sendEmail(
            normalizedEmail,
            "Reset Your Password - SafeKey",
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset</h2>
              <p>Your password reset OTP is:</p>
              <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
              <p>This OTP will expire in 5 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            `
          );
          logger.info({ user_id: user.user_id, email: normalizedEmail }, "Password reset OTP sent");
        }


      // 6. RESET PASSWORD - Reset password using token
      async resetPassword(token: string, newPassword: string): Promise<void> {
        // Find user with valid reset token
        const allUsers = await db.select().from(users);
        let user = null;
    
        for (const u of allUsers) {
          if (
            u.reset_token_hash &&
            u.reset_token_expires &&
            u.reset_token_expires > new Date()
          ) {
            const isValid = await compareToken(token, u.reset_token_hash);
            if (isValid) {
              user = u;
              break;
            }
          }
        }
    
        if (!user) {
          throw new ApiError(
            400,
            "Invalid or expired reset token",
            ERROR_CODES.INVALID_TOKEN
          );
        }
    
        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
    
        // Update password and clear reset token
        await db
          .update(users)
          .set({
            password: hashedPassword,
            reset_token_hash: null,
            reset_token_expires: null,
            refresh_token_hash: null, // Invalidate all sessions
          })
          .where(eq(users.user_id, user.user_id));
    
        logger.info({ user_id: user.user_id }, "Password reset successfully");
      }
      // 7. LOGOUT - Invalidate refresh token
      async logout(userId: string): Promise<void> {
        await db
          .update(users)
          .set({ refresh_token_hash: null })
          .where(eq(users.user_id, userId));
    
        logger.info({ user_id: userId }, "User logged out");
      }

      // 8. RESEND OTP - Resend verification OTP
      async resendOTP(email: string): Promise<void> {
        // Check if user exists and is not verified
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
    
        if (!user) {
          throw new ApiError(404, "User not found", ERROR_CODES.USER_NOT_FOUND);
        }
    
        if (user.is_verified) {
          throw new ApiError(
            400,
            "Email already verified",
            ERROR_CODES.EMAIL_ALREADY_VERIFIED
          );
        }
    
        // Generate and store new OTP
        const otp = generateOtp();
        await storeOtp(`signup:${email}`, otp, 300);
    
        // Send OTP email
        await sendEmail(
          email,
          "Verify Your Email - SafeKey",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Email Verification</h2>
            <p>Your new verification code is:</p>
            <h1 style="color: #4F46E5; letter-spacing: 8px;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
          </div>
          `
        );
    
        logger.info({ email }, "OTP resent");
      }
}
