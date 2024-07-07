import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const appRouter = t.router({
    hello: t.procedure.input(z.string().nullish()).query(({ input }) => {
        return `hello ${input ?? "world"}`;
    }),
});

export type AppRouter = typeof appRouter;
