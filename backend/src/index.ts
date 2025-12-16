// src/server.ts
import app from "./app";
import dotenv from 'dotenv'
import { logger } from "./utils/logger";

dotenv.config()

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.warn(`SafeKey backend running on port ${PORT} http://localhost:${PORT}`);    //used warn just for easy visiblity
});