import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact";

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
    setIsLoading: (l: boolean) => void,
    setError: (err: string) => void,
    c?: (t: T) => void,
) {
    setIsLoading(true);
    f()
        .then((t) => {
            if (c) {
                c(t);
            }
        })
        .catch((e) => setError(String(e)))
        .finally(() => setIsLoading(false));
}

export function useQuery<T>(
    f: () => Promise<T>,
): {
    isLoading: boolean;
    error: undefined | string;
    result: T | undefined;

    setIsLoading: (l: boolean) => void;
    setError: (err: string) => void;
} {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [result, setResult] = useState<T | undefined>(undefined);

    useEffect(() => {
        let valid = true;

        withQuery(f, setIsLoading, setError, (t) => {
            if (valid) {
                setResult(t);
            } else {
                console.log("Dropping invalid result: " + t);
            }
        });

        return () => valid = false;
    }, []);

    return { isLoading, error, result, setError, setIsLoading };
}
