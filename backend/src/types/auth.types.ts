// src/types/auth.types.ts

import { Request } from 'express';

export interface JWTPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface SignupBody {
  email: string;
  password: string;
}

export interface VerifyOTPBody {
  email: string;
  otp: string;
}

export interface LoginBody {
  email: string;
  password: string;
}


export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

export interface RefreshTokenBody {
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface OTPResponse {
  message: string;
  email: string;
}

export interface LogoutResponse {
  message: string;
}