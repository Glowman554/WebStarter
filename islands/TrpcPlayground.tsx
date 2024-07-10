import { useState } from "preact/hooks";
import { trpc } from "../server/trpc/client.ts";
import { useQueryState, withQuery } from "../client/helper.ts";
import { Query } from "../components/Query.tsx";

export default function TrpcPlayground() {
    const [greeting, setGreeting] = useState("");

    const q = useQueryState(false);

    const fireQuery = () => {
        withQuery(
            () => trpc.hello.query("World"),
            q,
            setGreeting,
        );
    };

    return (
        <Query q={q}>
            <button onClick={fireQuery}>Fire tRPC Query</button>
            <p>{greeting}</p>
        </Query>
    );
}
