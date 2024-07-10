import { useState } from "preact/hooks";
import { trpc } from "../server/trpc/client.ts";
import { withQuery } from "../client/helper.ts";
import { Query } from "./Query.tsx";

export default function TrpcPlayground() {
    const [greeting, setGreeting] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const fireQuery = () => {
        withQuery(
            () => trpc.hello.query("World"),
            setIsLoading,
            setError,
            setGreeting,
        );
    };

    return (
        <Query error={error} isLoading={isLoading}>
            <button onClick={fireQuery}>Fire tRPC Query</button>
            <p>{greeting}</p>
        </Query>
    );
}
