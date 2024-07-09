import { useContext, useEffect, useState } from "preact/hooks";
import { trpc } from "../server/trpc/client.ts";
import { ErrorContext } from "../islands/Error.tsx";
import { erroring } from "./helper.ts";

export function useToken() {
    const setError = useContext(ErrorContext);
    const [token, setToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            erroring(
                trpc.users.test.query(token).then((ok) => {
                    if (ok) {
                        setToken(token);
                    }
                }),
                setError,
            );
        }
    }, []);

    return token;
}
