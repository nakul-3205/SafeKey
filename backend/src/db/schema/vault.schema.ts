import { pgTable,uuid,timestamp,text,smallint } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const vault=pgTable("vault",{

    id: uuid("id").defaultRandom().primaryKey(),
    user_id:uuid("user_id").notNull()
                        .references(()=>users.user_id,{
                            onDelete:"cascade",
                            onUpdate:"cascade"
                        })
                        .unique(),

    salt: text("salt").notNull(),
    version: smallint("version").notNull().default(1),

    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date()),


})
