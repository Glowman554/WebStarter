import { createClient } from "@libsql/client";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

export let db: LibSQLDatabase<Record<string, never>>;

export async function connectDatabase() {
    const url = Deno.env.get("DATABASE_URL");
    if (!url) {
        throw new Error("Missing DATABASE_URL");
    }

    const authToken = Deno.env.get("DATABASE_AUTH_TOKEN");
    if (!authToken) {
        console.warn("Missing DATABASE_AUTH_TOKEN");
    }

    const client = createClient({ url, authToken });

    db = drizzle(client);

    await migrate(db, {
        migrationsFolder: "./drizzle",
    });
}
