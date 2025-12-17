import "dotenv/config";
import { z } from "zod";
import { ApiError } from "../utils/apiError";
import { logger } from "../utils/logger";
import { ERROR_CODES } from "../utils/errorCodes";

const durationRegex = /^[0-9]+(s|m|h|d)$/;

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 5000)),

  ACCESS_TOKEN_SECRET: z.string().min(32, "ACCESS_TOKEN_SECRET must be at least 32 characters"),
  REFRESH_TOKEN_SECRET: z.string().min(32, "REFRESH_TOKEN_SECRET must be at least 32 characters"),
  ACCESS_TOKEN_EXP: z.string().regex(
    durationRegex,
    "ACCESS_TOKEN_EXP must be like 15m, 1h, 7d"
  ),

  REFRESH_TOKEN_EXP: z.string().regex(
    durationRegex,
    "REFRESH_TOKEN_EXP must be like 7d, 30d"
  ),
  OTP_EXPIRE_TTL: z.coerce
    .number()
    .int()
    .positive()
    .min(60, "OTP_EXPIRE_TTL too short")
    .max(900, "OTP_EXPIRE_TTL too long"),
  
    GMAIL_USER: z
    .string()
    .email("GMAIL_USER must be a valid email address"),

  GMAIL_APP_PASSWORD: z
    .string()
    .min(16, "GMAIL_APP_PASSWORD must be a valid app password"),

  GMAIL_APP_NAME: z
    .string()
    .min(1, "GMAIL_APP_NAME is required"),
  

});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(
    {
      errors: parsedEnv.error.flatten().fieldErrors,
    },
    " Environment validation failed"
  );

  throw new ApiError(
    500,
    "Invalid or missing environment variables",
    ERROR_CODES.NOT_FOUND
  );
}

export const env = {
  DATABASE_URL: parsedEnv.data.DATABASE_URL,
  UPSTASH_REDIS_REST_URL: parsedEnv.data.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: parsedEnv.data.UPSTASH_REDIS_REST_TOKEN,
  PORT: parsedEnv.data.PORT,
  ACCESS_TOKEN_SECRET:parsedEnv.data.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET:parsedEnv.data.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXP: parsedEnv.data.ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP: parsedEnv.data.REFRESH_TOKEN_EXP,

  OTP_EXPIRE_TTL: parsedEnv.data.OTP_EXPIRE_TTL,
  GMAIL_USER: parsedEnv.data.GMAIL_USER,
  GMAIL_APP_PASSWORD: parsedEnv.data.GMAIL_APP_PASSWORD,
  GMAIL_APP_NAME: parsedEnv.data.GMAIL_APP_NAME,

} as const;
