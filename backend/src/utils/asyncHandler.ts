import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = <P = any, ResBody = any, ReqBody = any>(
fn: RequestHandler<P, ResBody, ReqBody>
): RequestHandler<P, ResBody, ReqBody> => {
    return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
};