import { drizzle } from "drizzle-orm/neon-http";
import { env } from "./env";
import { logger } from "../utils/logger";
import * as schema from "../db/schema";

export const db = drizzle(env.DATABASE_URL, { schema });

export const checkDbConnection = async () => {
    await db.execute("select 1");
    logger.info("Database connected");
};
