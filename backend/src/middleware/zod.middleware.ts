import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { ERROR_CODES } from "../utils/errorCodes";
import { logger } from "../utils/logger";

type ValidationTarget = "body" | "query" | "params";

export const validate =
(schema: ZodObject, target: ValidationTarget = "body") =>
(req: Request, _res: Response, next: NextFunction) => {
try {
const data = req[target];
schema.parse(data);
next();
} catch (error) {
    if (error instanceof ZodError) {
    logger.warn(
        {
        issues: error,
        path: req.path,
        method: req.method,
        },
        "Zod validation failed"
    );

    throw new ApiError(
        400,
        "Invalid request payload",
        ERROR_CODES.VALIDATION_ERROR,
);
}

next(error);
}
};
