import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";

export interface QueryState {
    isLoading: boolean;
    error: undefined | string;
    setIsLoading: (l: boolean) => void;
    setError: (err: string | undefined) => void;
}

export function useInput(
    initial: string,
): [
    string,
    (
        e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement, Event>,
    ) => void,
] {
    const [text, setText] = useState(initial);

    const change = (
        e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement, Event>,
    ) => {
        // deno-lint-ignore no-explicit-any
        setText((e.target as any).value as string);
    };

    return [text, change];
}

export function withQuery<T>(
    f: () => Promise<T>,
    q: QueryState,
    c?: (t: T) => void,
) {
    q.setIsLoading(true);
    f()
        .then((t) => {
            if (c) {
                c(t);
            }
        })
        .catch((e) => q.setError(String(e)))
        .finally(() => q.setIsLoading(false));
}

export function useQueryState(initialLoading: boolean): QueryState {
    const [isLoading, setIsLoading] = useState(initialLoading);
    const [error, setError] = useState<string | undefined>(undefined);

    return {
        isLoading,
        setIsLoading,
        error,
        setError,
    };
}

export function useQuery<T>(f: () => Promise<T>, q: QueryState): T | undefined {
    const [result, setResult] = useState<T | undefined>(undefined);

    useEffect(() => {
        let valid = true;

        withQuery(f, q, (t) => {
            if (valid) {
                setResult(t);
            } else {
                console.log("Dropping invalid result: " + t);
            }
        });

        return () => valid = false;
    }, []);

    return result;
}
