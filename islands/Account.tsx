import { trpc } from "../server/trpc/client.ts";
import { useToken } from "../client/token.ts";
import { useInput, useQueryState, withQuery } from "../client/helper.ts";
import { Query } from "../components/Query.tsx";

function Common(
    props: {
        submitText: string;
        submitCallback: (username: string, password: string) => void;
    },
) {
    const [password, setPassword] = useInput("");
    const [username, setUsername] = useInput("");

    const q = useQueryState();
    const token = useToken(q);

    return (
        <Query q={q}>
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
    const q = useQueryState();

    const callback = (username: string, password: string) => {
        withQuery(
            () => trpc.users.create.mutate({ username, password }),
            q,
            (token) => {
                localStorage.setItem("token", token);
            },
        );
    };

    return (
        <Query q={q}>
            <Common
                submitText="Create account"
                submitCallback={callback}
            />
        </Query>
    );
}

export function LoginField() {
    const q = useQueryState();

    const callback = (username: string, password: string) => {
        withQuery(
            () => trpc.users.login.mutate({ username, password }),
            q,
            (token) => {
                localStorage.setItem("token", token);
            },
        );
    };

    return (
        <Query q={q}>
            <Common
                submitText="Login"
                submitCallback={callback}
            />
        </Query>
    );
}
