// src/utils/logger.ts
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },

  /**
   * Custom serializers for clean error logs
   */
  serializers: {
    err: pino.stdSerializers.err,
  },
});

/**
 * Helper for logging errors with stack traces
 * Usage: loggerError(error, "optional message")
 */
export const loggerError = (error: unknown, message?: string) => {
  if (error instanceof Error) {
    logger.error(
      {
        err: error,
        stack: error.stack,
      },
      message || error.message
    );
  } else {
    logger.error(
      {
        err: error,
      },
      message || "Unknown error"
    );
  }
};
