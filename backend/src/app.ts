import express from 'express'
import cors from 'cors'
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorMiddleware } from "./middleware/errorHandlermiddleware";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import { logger } from "./utils/logger";
const app =express()

app.use(cors())
app.use(requestLogger)
// src/app.ts




app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

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

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));


app.use("/api/auth", authLimiter, authRoutes);

// 404 handler
app.use((_req, res) => {
res.status(404).json({
    success: false,
    message: "Route not found",
});
});

app.use(errorMiddleware);


app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});

export default app