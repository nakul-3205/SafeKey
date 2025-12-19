import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const hashToken = async (token: string): Promise<string> => {
  return await bcrypt.hash(token, SALT_ROUNDS);
};

export const compareToken = async (
  token: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(token, hash);
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};