import { Redis } from "@upstash/redis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const checkRedisConnection = async () => {
   await redis.ping();
   logger.info(" Redis connected");
};
