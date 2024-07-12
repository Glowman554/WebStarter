import { connectDatabase } from "./server/database/drizzle.ts";

import "@std/dotenv/load";

export async function common() {
    await connectDatabase();
}
