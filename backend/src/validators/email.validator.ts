// src/validators/email.validator.ts
import { z } from "zod";

export const createEmailSchema = z.object({
    name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),

    email: z.string()
    .email("Invalid email format")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase()
    .trim(),
});

export const updateEmailSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name must not exceed 100 characters")
        .trim()
        .optional()
        .nullable(),
  
    email: z.string()
        .email("Invalid email format")
        .max(255, "Email must not exceed 255 characters")
        .toLowerCase()
        .trim()
        .optional(),
});

export const getEmailsQuerySchema = z.object({
    search: z.string().trim().optional(),
});

export type CreateEmailInput = z.infer<typeof createEmailSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type GetEmailsQuery = z.infer<typeof getEmailsQuerySchema>;