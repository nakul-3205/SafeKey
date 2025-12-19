// import { redis } from "../config/redis";

// export const storeOtp = async (
//   key: string,
//   otp: string,
//   ttlSeconds = 300
// ) => {
//   await redis.set(key, otp, { ex: ttlSeconds });
// };

// export const getOtp = async (key: string) => {
//   return redis.get<string>(key);
// };

// export const deleteOtp = async (key: string) => {
//   await redis.del(key);
// };
