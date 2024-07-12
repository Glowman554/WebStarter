import { useState } from "preact/hooks";
import { trpc } from "../server/trpc/client.ts";
import { useQueryState, withQuery } from "../client/helper.ts";
import { Query } from "../components/Query.tsx";
import { ContinueBox } from "./ContinueBox.tsx";

export default function TrpcPlayground() {
    const [greeting, setGreeting] = useState("");

    const q = useQueryState(false);
    const [showBox, setShowBox] = useState(false);

    const fireQuery = () => {
        withQuery(
            () => trpc.hello.query("world"),
            q,
            setGreeting,
        );
    };

    return (
        <Query q={q}>
            <button onClick={() => setShowBox(true)}>Fire tRPC Query</button>
            <p>{greeting}</p>
            {showBox
                ? (
                    <ContinueBox
                        cancelCallback={() => {}}
                        continueCallback={fireQuery}
                        resetCallback={() => setShowBox(false)}
                        message="You are about to fire a trpc query!"
                    />
                )
                : <></>}
        </Query>
    );
}
