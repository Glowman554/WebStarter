import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { db } from "./database/drizzle.ts";
import { sessions, users } from "./database/schema.ts";
import { eq } from "drizzle-orm";

function isValidPassword(password: string): string | null {
    if (password.length < 8) {
        return ("password needs to be at least 8 characters long");
    }

    let hasNumber = false;
    let hasUpperCase = false;
    let hasLowerCase = false;

    for (const c of password) {
        if ((c >= "0" && c <= "9") && !hasNumber) {
            hasNumber = true;
        } else if ((c >= "A" && c <= "Z") && !hasUpperCase) {
            hasUpperCase = true;
        } else if ((c >= "a" && c <= "z") && !hasLowerCase) {
            hasLowerCase = true;
        }
    }

    if (!hasNumber || !hasUpperCase || !hasLowerCase) {
        return "password needs to at least contain 1 upper case character, 1 lower case character and 1 number";
    }

    return null;
}

function createRandomToken() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let str = "";
    for (let i = 0; i < 100; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

export async function createToken(username: string) {
    const token = createRandomToken();

    await db.insert(sessions).values({ token, username });

    return token;
}

export async function createUser(username: string, password: string) {
    const invalid = isValidPassword(password);
    if (invalid) {
        throw new Error(invalid);
    }

    const oldUser = await db.select({ username: users.username }).from(users)
        .where(eq(users.username, username));

    if (oldUser.length != 0) {
        throw new Error("User already exists");
    }

    await db.insert(users).values({
        passwordHash: bcrypt.hashSync(password),
        username,
    });
}

export async function getUser(username: string) {
    const maybe = await db.select().from(users).where(
        eq(users.username, username),
    );

    if (maybe.length != 0) {
        return maybe[0];
    }
    return null;
}

export async function passwordOk(
    username: string,
    password: string,
): Promise<boolean> {
    const user = await getUser(username);
    if (!user) {
        return false;
    }

    return bcrypt.compareSync(password, user.passwordHash);
}

export async function getUserByToken(token: string) {
    const session = await db.select().from(sessions).innerJoin(
        users,
        eq(users.username, sessions.username),
    ).where(eq(sessions.token, token));
    if (session.length == 0) {
        return null;
    }
    return session[0].users;
}
