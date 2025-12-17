import { drizzle } from 'drizzle-orm/neon-http';
import { env } from './env';
import { logger } from '../utils/logger';

export const db=drizzle(env.DATABASE_URL);

export const checkDbConnection = async () => {
await db.execute("select 1");
logger.info(" Database connected");
};
