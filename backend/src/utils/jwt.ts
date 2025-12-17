import jwt from "jsonwebtoken";
import { env } from "../config/env";

const ACCESS_SECRET = env.ACCESS_TOKEN_SECRET ;
const REFRESH_SECRET = env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXP=env.ACCESS_TOKEN_EXP ;
const REFRESH_TOKEN_EXP=env.REFRESH_TOKEN_EXP;


export const signAccessToken = (payload: object) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXP});
};

export const signRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXP});
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET);
};
