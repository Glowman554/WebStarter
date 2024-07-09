import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
    username: text("username").primaryKey(),
    passwordHash: text("password_hash").notNull(),
});

export const sessions = sqliteTable("sessions", {
    token: text("token").primaryKey(),
    username: text("username").references(() => users.username, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }).notNull(),
    creationDate: integer("creation_date", { mode: "timestamp" }).default(
        sql`(strftime('%s', 'now'))`,
    ).notNull(),
});
