import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/apiError";
import { ERROR_CODES } from "../utils/errorCodes";

declare global {
namespace Express {
    interface Request {
        user?: {
            user_id: string;
            email: string;
        };
    }
}
}

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
        401,
        "Access token is required",
        ERROR_CODES.NOT_FOUND
    );
    }

    const token = authHeader.substring(7);

    const payload = verifyAccessToken(token);


    req.user = payload;

    next();
} catch (error) {
    next(error);
}
};