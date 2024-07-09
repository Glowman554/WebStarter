import { useContext } from "preact/hooks";

import { trpc } from "../server/trpc/client.ts";
import { useToken } from "../client/token.ts";
import { erroring, useInput } from "../client/helper.ts";
import { ErrorContext } from "./Error.tsx";

function Common(
    props: {
        submitText: string;
        submitCallback: (username: string, password: string) => void;
    },
) {
    const [password, setPassword] = useInput("");
    const [username, setUsername] = useInput("");
    const token = useToken();

    return (
        token
            ? (
                <>
                    <p>Already logged in</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            location.reload();
                        }}
                    >
                        Logout
                    </button>
                </>
            )
            : (
                <div class="glow-field">
                    <div class="glow-section">
                        Username
                        <input
                            class="glow-fancy-input"
                            onChange={setUsername}
                            type="text"
                        />
                    </div>

                    <div class="glow-section">
                        Password
                        <input
                            class="glow-fancy-input"
                            onChange={setPassword}
                            type="password"
                        />
                    </div>

                    <div class="glow-center">
                        <button
                            class="glow-fancy-button"
                            onClick={() =>
                                props.submitCallback(
                                    username,
                                    password,
                                )}
                        >
                            {props.submitText}
                        </button>
                    </div>
                </div>
            )
    );
}

export function CreateField() {
    const setError = useContext(ErrorContext);

    const callback = (username: string, password: string) => {
        erroring(
            trpc.users.create.mutate({ username, password }).then((token) => {
                localStorage.setItem("token", token);
                location.reload();
            }),
            setError,
        );
    };

    return (
        <Common
            submitText="Create account"
            submitCallback={callback}
        />
    );
}

export function LoginField() {
    const setError = useContext(ErrorContext);

    const callback = (username: string, password: string) => {
        erroring(
            trpc.users.login.mutate({ username, password }).then((token) => {
                localStorage.setItem("token", token);
                location.reload();
            }),
            setError,
        );
    };

    return (
        <Common
            submitText="Login"
            submitCallback={callback}
        />
    );
}
