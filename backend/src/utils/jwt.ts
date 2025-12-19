// src/utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";
import { ApiError } from "./apiError";
import { ERROR_CODES } from "./errorCodes";
import { env } from "../config/env";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET as string;

const ACCESS_TOKEN_EXPIRY = env.ACCESS_TOKEN_EXP || "15m";
const REFRESH_TOKEN_EXPIRY = env.REFRESH_TOKEN_EXP || "7d";

interface TokenPayload {
  user_id: string;
  email: string;
}

const accessTokenOptions: SignOptions = {
  expiresIn: ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
};

const refreshTokenOptions: SignOptions = {
  expiresIn: REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, accessTokenOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, refreshTokenOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch {
    throw new ApiError(
      401,
      "Invalid or expired access token",
      ERROR_CODES.INVALID_TOKEN
    );
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch {
    throw new ApiError(
      401,
      "Invalid or expired refresh token",
      ERROR_CODES.INVALID_TOKEN
    );
  }
};
