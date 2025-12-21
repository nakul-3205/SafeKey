import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { checkDbConnection } from "./config/db";
import { checkRedisConnection } from "./config/redis";

const startServer = async () => {
  try {
    logger.info("Starting SafeKey backend...");

    await checkDbConnection();

    await checkRedisConnection();

    app.listen(env.PORT, () => {
      logger.warn(
        `SafeKey backend running on port ${env.PORT} : http://localhost:${env.PORT}`
      );
    });
  } catch (error) {
    logger.error(error," Failed to start server");
    process.exit(1);
  }
};

startServer();
