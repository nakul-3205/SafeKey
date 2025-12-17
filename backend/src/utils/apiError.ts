// src/utils/apiError.ts
import { ERROR_CODES } from "./errorCodes";

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public code: ErrorCode;
  public errors: unknown[];

  constructor(
    statusCode: number,
    message: string,
    code: ErrorCode,
    errors: unknown[] = [],
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.code = code;
    this.errors = errors;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
