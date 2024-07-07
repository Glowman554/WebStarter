import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("fruits", {
    name: text("name").primaryKey(),
});
