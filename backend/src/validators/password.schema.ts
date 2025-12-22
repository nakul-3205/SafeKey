// src/validators/vault.validator.ts
import { z } from "zod";

export const createPasswordSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  ciphertext: z.string().min(1, "Ciphertext is required"),
  iv: z.string().min(1, "IV is required"),
  auth_tag: z.string().min(1, "Auth tag is required"),
  hibp_sha1_prefix: z.string()
    .length(5, "HIBP prefix must be exactly 5 characters")
    .regex(/^[A-F0-9]{5}$/, "HIBP prefix must be 5 uppercase hex characters"),
});

export const updatePasswordSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),
  ciphertext: z.string().min(1, "Ciphertext is required").optional(),
  iv: z.string().min(1, "IV is required").optional(),
  auth_tag: z.string().min(1, "Auth tag is required").optional(),
  hibp_sha1_prefix: z.string()
    .length(5, "HIBP prefix must be exactly 5 characters")
    .regex(/^[A-F0-9]{5}$/, "HIBP prefix must be 5 uppercase hex characters")
    .optional(),
}).refine(
  (data) => {
    const hasCrypto = data.ciphertext || data.iv || data.auth_tag || data.hibp_sha1_prefix;
    if (hasCrypto) {
      return data.ciphertext && data.iv && data.auth_tag && data.hibp_sha1_prefix;
    }
    return true;
  },
  {
    message: "When updating password, ciphertext, iv, auth_tag, and hibp_sha1_prefix must all be provided",
  }
);

export const deletePasswordParamsSchema = z.object({
  id: z.string().uuid("Invalid password ID"),
});

export const getPasswordParamsSchema = z.object({
  id: z.string().uuid("Invalid password ID"),
});

export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type DeletePasswordParams = z.infer<typeof deletePasswordParamsSchema>;
export type GetPasswordParams = z.infer<typeof getPasswordParamsSchema>;