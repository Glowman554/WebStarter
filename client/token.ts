import { trpc } from "../server/trpc/client.ts";
import { useQuery } from "./helper.ts";

export function useToken() {
    const query = useQuery(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const ok = await trpc.users.test.query(token);
            if (ok) {
                return token;
            }
        }
        return undefined;
    });

    return query;
}
