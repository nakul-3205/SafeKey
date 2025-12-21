import { z } from 'zod';

// Email validation schema
const emailSchema = z.string()
        .email('Invalid email format')
        .min(5, 'Email must be at least 5 characters')
        .max(255, 'Email must not exceed 255 characters')
        .toLowerCase()
        .trim();

// Password validation schema
const passwordSchema = z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)');

// OTP validation schema
const otpSchema = z.string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only digits');

export const resendOTPSchema = z.object({
                email: emailSchema,
        })
// Token validation schema
const tokenSchema = z.string()
        .min(32, 'Invalid token format')
        .max(128, 'Invalid token format');

// Signup validation
export const signupSchema = z.object({
        email: emailSchema,
        password: passwordSchema,
});

// Verify OTP validation
export const verifyOTPSchema = z.object({
        email: emailSchema,
        otp: otpSchema,
});

// Login validation
export const loginSchema = z.object({
        email: emailSchema,
        password: z.string().min(1, 'Password is required'),
});

// Forgot password validation
export const forgotPasswordSchema = z.object({
        email: emailSchema,
});

// Reset password validation
export const resetPasswordSchema = z.object({
        email: emailSchema,
        otp: otpSchema,
        newPassword: passwordSchema,
});

// Refresh token validation
export const refreshTokenSchema = z.object({
        refreshToken: tokenSchema,
});

// Export types inferred from schemas
export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;