// src/routes/salt.routes.ts
import { Router } from "express";
import { SaltVaultController } from "../controllers/vault.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/zod.middleware";
import {
  createSaltSchema,
} from "../validators/vault.validator";

const router = Router();
const saltVaultController = new SaltVaultController();

// All salt vault routes require authentication
router.use(authenticate);



// POST /api/vault/salt - Create salt (once per user)
router.post(
    "/",
    validate(createSaltSchema, "body"),
    saltVaultController.createSalt
);

// GET /api/vault/salt - Get salt
router.get("/", saltVaultController.getSalt);


export default router;