import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import passwordRoutes from './routes/password.routes'
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorMiddleware } from "./middleware/errorHandlermiddleware";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts, please try again later.",
});

app.get("/api/health", (_req, res) => {
  logger.info('Hit health route')
  res.json({ status: "ok" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/vault",limiter,passwordRoutes)
app.use((_req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;
