import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/trpc/server.ts";
import { define } from "../../../utils.ts";

const handle = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req: req,
        router: appRouter,
        createContext: () => ({}),
    });

export const handler = define.handlers({
    GET(req) {
        return handle(req.req);
    },
    POST(req) {
        return handle(req.req);
    },
});
