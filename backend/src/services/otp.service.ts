import { redis } from "../config/redis";
import { hashToken, compareToken } from "../utils/bcrypt";

export const storeOtp = async (
  key: string,
  otp: string,
  ttl: number
) => {
  const hashedOtp = await hashToken(otp);
  await redis.set(key, hashedOtp, { ex: ttl });
};

export const verifyOtp = async (
  key: string,
  otp: string
): Promise<boolean> => {
  const storedHashedOtp = await redis.get<string>(key);
  if (!storedHashedOtp) return false;

  return await compareToken(otp, storedHashedOtp);
};

export const deleteOtp = async (key: string) => {
  await redis.del(key);
};
