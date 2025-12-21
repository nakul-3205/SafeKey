// src/middlewares/requestLogger.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
}
