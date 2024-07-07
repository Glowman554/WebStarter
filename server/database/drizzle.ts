import { createClient } from "@libsql/client";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

export let db: LibSQLDatabase<Record<string, never>>;

export async function connectDatabase() {
    const url = Deno.env.get("TURSO_DATABASE_URL");
    if (!url) {
        throw new Error("Missing TURSO_DATABASE_URL");
    }

    const authToken = Deno.env.get("TURSO_AUTH_TOKEN");
    if (!authToken) {
        throw new Error("Missing TURSO_AUTH_TOKEN");
    }

    const client = createClient({ url, authToken });

    db = drizzle(client);

    await migrate(db, {
        migrationsFolder: "./drizzle",
    });
}
