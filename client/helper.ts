import { useState } from "preact/hooks";
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

export async function erroring<T>(
    promise: Promise<T>,
    setError: (error: string) => void,
): Promise<T> {
    try {
        return await promise;
    } catch (e) {
        setError(String(e));
        throw e;
    }
}
