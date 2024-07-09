import { createContext, JSX } from "preact";
import { useState } from "preact/hooks";

export const ErrorContext = createContext<(error: string) => void>(
    (_) => {},
);
export function ErrorRoot(props: JSX.HTMLAttributes<HTMLDivElement>) {
    const [error, setError] = useState<string | undefined>(undefined);
    return (
        <ErrorContext.Provider value={setError}>
            {error
                ? (
                    <div class="glow-text">
                        <p>{error}</p>
                    </div>
                )
                : <div {...props}>{props.children}</div>}
        </ErrorContext.Provider>
    );
}
