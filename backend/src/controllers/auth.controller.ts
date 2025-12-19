import { logger } from "../utils/logger";
// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
SignupInput,
VerifyOTPInput,
LoginInput,
ForgotPasswordInput,
ResetPasswordInput,
RefreshTokenInput,
} from "../validators/auth.schema";

const authService = new AuthService();

export class AuthController {
// POST /api/auth/signup
signup = asyncHandler(
async (
    req: Request<{}, {}, SignupInput>,
    res: Response,
    _next: NextFunction
) => {
    const { email, password } = req.body;

    await authService.signup(email, password);

    res.status(201).json(
    new ApiResponse(
        201,
        null,
        "Signup successful. Please check your email for OTP."
    )
    );
}
);

// POST /api/auth/verify-otp
verifyOTP = asyncHandler(
async (
    req: Request<{}, {}, VerifyOTPInput>,
    res: Response,
    _next: NextFunction
) => {
    const { email, otp } = req.body;

    const tokens = await authService.verifyOTP(email, otp);

    res.status(200).json(
    new ApiResponse(200, tokens, "Email verified successfully. You are now logged in.")
    );
}
);

// POST /api/auth/resend-otp
resendOTP = asyncHandler(
async (
    req: Request<{}, {}, { email: string }>,
    res: Response,
    _next: NextFunction
) => {
    const { email } = req.body;

    await authService.resendOTP(email);

    res.status(200).json(
    new ApiResponse(200, null, "OTP has been resent to your email.")
    );
}
);

// POST /api/auth/login
login = asyncHandler(
async (
    req: Request<{}, {}, LoginInput>,
    res: Response,
    _next: NextFunction
) => {
    const { email, password } = req.body;

    const tokens = await authService.login(email, password);

    res.status(200).json(
    new ApiResponse(200, tokens, "Login successful")
    );
}
);

// POST /api/auth/refresh
refreshToken = asyncHandler(
async (
    req: Request<{}, {}, RefreshTokenInput>,
    res: Response,
    _next: NextFunction
) => {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).json(
    new ApiResponse(200, tokens, "Tokens refreshed successfully")
    );
}
);

// POST /api/auth/forgot-password
forgotPassword = asyncHandler(
async (
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response,
    _next: NextFunction
) => {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.status(200).json(
    new ApiResponse(
        200,
        null,
        "Otp sent successfully"
    )
    );
}
);

// POST /api/auth/reset-password
resetPassword = asyncHandler(
async (
    req: Request<{}, {}, ResetPasswordInput>,
    res: Response,
    _next: NextFunction
) => {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.status(200).json(
    new ApiResponse(200, null, "Password reset successful. You can now login.")
    );
}
);

// POST /api/auth/logout
logout = asyncHandler(
async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.user_id;

    await authService.logout(userId);

    res.status(200).json(
    new ApiResponse(200, null, "Logout successful")
    );
}
);

// GET /api/auth/me - Get current user info
getCurrentUser = asyncHandler(
async (req: Request, res: Response, _next: NextFunction) => {
    const user = req.user!;

    res.status(200).json(
    new ApiResponse(200, user, "User retrieved successfully")
    );
}
);
}