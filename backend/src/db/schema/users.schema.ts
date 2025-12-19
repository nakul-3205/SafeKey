// src/db/schema/users.schema.ts
import { pgTable, uuid, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  // Global unique user ID
  user_id: uuid("user_id").primaryKey().defaultRandom(),

  // Email for login
  email: varchar("email", { length: 255 }).notNull().unique(),

  // Hashed password
  password: text("password").notNull(),

  // Email verification status
  is_verified: boolean("is_verified").notNull().default(false),

  // Hashed refresh token for logout / rotation
  refresh_token_hash: text("refresh_token_hash"),



  // Timestamps
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});