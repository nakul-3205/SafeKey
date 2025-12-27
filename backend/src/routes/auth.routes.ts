// src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/zod.middleware";
import { authenticate } from "../middleware/auth.middleware";
import {
  signupSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../validators/auth.validator";

const router = Router();
const authController = new AuthController();

// Public routes
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/verify-otp", validate(verifyOTPSchema), authController.verifyOTP);
router.post("/resend-otp", validate(resendOTPSchema), authController.resendOTP);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshTokenSchema), authController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getCurrentUser);

export default router;