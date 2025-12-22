// src/routes/vault.routes.ts
import { Router } from "express";
import { VaultController } from "../controllers/password.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/zod.middleware";
import {
  createPasswordSchema,
  updatePasswordSchema,
  deletePasswordParamsSchema,
  getPasswordParamsSchema,
} from "../validators/password.schema";

const router = Router();
const vaultController = new VaultController();

// All vault routes require authentication
router.use(authenticate);

// GET /api/vault/stats - Get vault statistics
router.get("/stats", vaultController.getStats);

// POST /api/vault/passwords - Create a new password
router.post(
  "/passwords",
  validate(createPasswordSchema, "body"),
  vaultController.createPassword
);

// GET /api/vault/passwords - Get all passwords
router.get("/passwords", vaultController.getAllPasswords);

// GET /api/vault/passwords/:id - Get a single password
router.get(
  "/passwords/:id",
  validate(getPasswordParamsSchema, "params"),
  vaultController.getPassword
);

// PUT /api/vault/passwords/:id - Update a password
router.put(
  "/passwords/:id",
  validate(getPasswordParamsSchema, "params"),
  validate(updatePasswordSchema, "body"),
  vaultController.updatePassword
);

// DELETE /api/vault/passwords/:id - Delete a password
router.delete(
  "/passwords/:id",
  validate(deletePasswordParamsSchema, "params"),
  vaultController.deletePassword
);

// DELETE /api/vault/passwords - Delete all passwords (dangerous!)
router.delete("/passwords", vaultController.deleteAllPasswords);

export default router;