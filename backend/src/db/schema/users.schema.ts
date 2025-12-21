// src/db/schema/users.schema.ts
import { pgTable, uuid, varchar, text, timestamp, boolean,integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: uuid("user_id").primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: text("password").notNull(),

  is_verified: boolean("is_verified").notNull().default(false),

  refresh_token_hash: text("refresh_token_hash"),
  numberof_passwords_stored: integer("numberof_passwords_stored")
    .notNull()
    .default(0),

  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),

});