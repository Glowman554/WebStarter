import { Handlers } from "$fresh/server.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/trpc/server.ts";

const handle = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req: req,
        router: appRouter,
        createContext: () => ({}),
    });

export const handler: Handlers = {
    GET(req, _ctx) {
        return handle(req);
    },
    POST(req, _ctx) {
        return handle(req);
    },
};
