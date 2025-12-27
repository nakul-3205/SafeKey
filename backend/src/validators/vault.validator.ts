import { z } from "zod";

export const createSaltSchema = z.object({
  salt: z.string()
    .min(32, "Salt must be at least 32 characters")
    .max(512, "Salt must not exceed 512 characters"),
  version: z.number()
    .int("Version must be an integer")
    .min(1, "Version must be at least 1")
    .default(1),
});


export type CreateSaltInput = z.infer<typeof createSaltSchema>;
