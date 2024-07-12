import { ComponentChildren } from "preact";
import { QueryState } from "../client/helper.ts";

export function Query(
    props: { q: QueryState; children: ComponentChildren },
) {
    return props.q.isLoading
        ? (
            <div class="glow-field glow-center">
                <img
                    src="/loading.svg"
                    class="glow-spinner"
                    style={{ width: "2rem" }}
                />
            </div>
        )
        : (props.q.error
            ? (
                <div class="glow-field">
                    <p>{props.q.error}</p>
                    <div class="glow-center">
                        <button
                            class="glow-fancy-button"
                            onClick={() => props.q.setError(undefined)}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )
            : <div>{props.children}</div>);
}
