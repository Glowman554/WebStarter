import { JSX } from "preact";

export function Query(
    props:
        & { isLoading: boolean; error: string | undefined }
        & JSX.HTMLAttributes<HTMLDivElement>,
) {
    return props.isLoading
        ? <p>Loading...</p>
        : (props.error
            ? <p>{props.error}</p>
            : <div {...props}>{props.children}</div>);
}
