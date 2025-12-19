// src/middleware/errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { logger, loggerError } from "../utils/logger";
import { ERROR_CODES } from "../utils/errorCodes";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error
  loggerError(err, "Error occurred");

  // Handle ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      code: err.code,
      errors: err.errors,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Handle unexpected errors
  logger.error({ err }, "Unhandled error");

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: ERROR_CODES.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};