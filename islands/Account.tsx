import { useState } from "preact/hooks";

import { trpc } from "../server/trpc/client.ts";
import { useToken } from "../client/token.ts";
import { useInput, withQuery } from "../client/helper.ts";
import { Query } from "./Query.tsx";

function Common(
    props: {
        submitText: string;
        submitCallback: (username: string, password: string) => void;
    },
) {
    const [password, setPassword] = useInput("");
    const [username, setUsername] = useInput("");

    const { isLoading, error, result: token } = useToken();

    return (
        <Query error={error} isLoading={isLoading}>
            {token
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
                )}
        </Query>
    );
}

export function CreateField() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const callback = (username: string, password: string) => {
        withQuery(
            () => trpc.users.create.mutate({ username, password }),
            setIsLoading,
            setError,
            (token) => {
                localStorage.setItem("token", token);
            },
        );
    };

    return (
        <Query isLoading={isLoading} error={error}>
            <Common
                submitText="Create account"
                submitCallback={callback}
            />
        </Query>
    );
}

export function LoginField() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const callback = (username: string, password: string) => {
        withQuery(
            () => trpc.users.login.mutate({ username, password }),
            setIsLoading,
            setError,
            (token) => {
                localStorage.setItem("token", token);
            },
        );
    };

    return (
        <Query isLoading={isLoading} error={error}>
            <Common
                submitText="Login"
                submitCallback={callback}
            />
        </Query>
    );
}
