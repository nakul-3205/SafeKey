// src/routes/email.routes.ts
import { Router } from "express";
import { EmailController } from "../controllers/email.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/zod.middleware";
import { createEmailSchema } from "../validators/email.validator";

const router = Router();
const emailController = new EmailController();

router.use(authenticate);

router.post(
    "/",
    validate(createEmailSchema, "body"),
    emailController.createEmail
);

router.get("/", emailController.getAllEmails);

export default router;