import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { smallint } from "drizzle-orm/pg-core"

export const vaultEmail=pgTable("vault_email",{
    id:uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
        name: varchar("name", { length: 100 }),
        email: varchar().notNull(),
        created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
        updated_at: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date()),

})