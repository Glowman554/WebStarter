import { useState } from "preact/hooks";
import { trpc } from "../server/trpc/client.ts";

export default function TrpcPlayground() {
    const [greeting, setGreeting] = useState("");

    const fireQuery = () => {
        trpc.hello.query("World").then((res) => setGreeting(res));
    };

    return (
        <div>
            <button onClick={fireQuery}>Fire tRPC Query</button>
            <p>{greeting}</p>
        </div>
    );
}
