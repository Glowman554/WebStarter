import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
    createToken,
    createUser,
    getUserByToken,
    passwordOk,
} from "../users.ts";
import superjson from "superjson";

const t = initTRPC.create({ transformer: superjson });

const usernameAndPassword = z.object({
    username: z.string(),
    password: z.string(),
});

const users = t.router({
    test: t.procedure.input(z.string()).query(
        async ({ input }) => {
            const user = await getUserByToken(input);
            return user != null;
        },
    ),
    create: t.procedure.input(usernameAndPassword).mutation(
        async ({ input }) => {
            await createUser(input.username, input.password);
            return createToken(input.username);
        },
    ),
    login: t.procedure.input(usernameAndPassword).mutation(
        async ({ input }) => {
            const ok = await passwordOk(input.username, input.password);
            if (!ok) {
                throw new Error("Invalid password");
            }
            return createToken(input.username);
        },
    ),
});

export const appRouter = t.router({
    hello: t.procedure.input(z.string().nullish()).query(async ({ input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return `hello ${input ?? "world"}`;
    }),
    users,
});

export type AppRouter = typeof appRouter;
