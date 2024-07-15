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
        e: JSX.TargetedEvent<HTMLInputElement, Event>,
    ) => void,
    (t: string) => void,
] {
    const [text, setText] = useState(initial);

    const change = (
        e: JSX.TargetedEvent<HTMLInputElement, Event>,
    ) => {
        setText(e.currentTarget.value);
    };

    return [text, change, setText];
}

export function useTextarea(
    initial: string,
): [
    string,
    (
        e: JSX.TargetedEvent<HTMLTextAreaElement, Event>,
    ) => void,
    (t: string) => void,
] {
    const [text, setText] = useState(initial);

    const change = (
        e: JSX.TargetedEvent<HTMLTextAreaElement, Event>,
    ) => {
        setText(e.currentTarget.value);
    };

    return [text, change, setText];
}

const cache = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

export function withQuery<T>(
    f: () => Promise<T>,
    q: QueryState,
    c?: (t: T) => void,
    key?: string,
) {
    if (key && cache.has(key)) {
        q.setIsLoading(false);
        if (c) {
            c(cache.get(key) as T);
        }
        return;
    }

    if (key && pending.has(key)) {
        pending.get(key)!
            .then((result) => {
                if (c) {
                    c(result as T);
                }
            })
            .catch((e) => q.setError(String(e)))
            .finally(() => q.setIsLoading(false));
        return;
    }

    q.setIsLoading(true);
    const p = f()
        .then((t) => {
            if (key) {
                cache.set(key, t);
            }

            if (c) {
                c(t);
            }
            return t;
        })
        .catch((e) => {
            q.setError(String(e));
            throw e;
        })
        .finally(() => {
            q.setIsLoading(false);
            if (key) {
                pending.delete(key);
            }
        });

    if (key) {
        pending.set(key, p);
    }
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

export function useQuery<T>(
    f: () => Promise<T>,
    q: QueryState,
    key?: string,
): T | undefined {
    const [result, setResult] = useState<T | undefined>(undefined);

    useEffect(() => {
        let valid = true;

        withQuery(f, q, (t) => {
            if (valid) {
                setResult(t);
            } else {
                console.log("Dropping invalid result: " + t);
            }
        }, key);

        return () => valid = false;
    }, []);

    return result;
}
