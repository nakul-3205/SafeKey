import {
pgTable,
uuid,
varchar,
text,
timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { smallint } from "drizzle-orm/pg-core";

export const vaultPasswords = pgTable("vault_passwords", {
id: uuid("id").defaultRandom().primaryKey(),


user_id: uuid("user_id")
.notNull()
.references(() => users.user_id, {
    onDelete: "cascade",
    onUpdate: "cascade",
}),

name: varchar("name", { length: 100 }).notNull(),

ciphertext: text("ciphertext").notNull(),
iv: text("iv").notNull(),
auth_tag: text("auth_tag").notNull(),



encryptionVersion:smallint().default(1).notNull(),
hibp_sha1_prefix: varchar("hibp_sha1_prefix", { length: 5 }).notNull(),

created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
updated_at: timestamp("updated_at", { withTimezone: true })
.defaultNow()
.$onUpdate(() => new Date()),
});
