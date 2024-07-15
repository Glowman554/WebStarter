import { trpc } from "../server/trpc/client.ts";
import { useToken } from "../client/token.ts";
import {
    clearCache,
    useInput,
    useQueryState,
    withQuery,
} from "../client/helper.ts";
import { Query } from "../components/Query.tsx";

function Common(
    props: {
        submitText: string;
        submitCallback: (username: string, password: string) => void;
    },
) {
    const [password, setPassword] = useInput("");
    const [username, setUsername] = useInput("");

    const q = useQueryState(true);
    const token = useToken(q);

    return (
        <Query q={q}>
            {token
                ? (
                    <div class="glow-field">
                        <p>Already logged in</p>
                        <div class="glow-center">
                            <button
                                class="glow-fancy-button"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    location.reload();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
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
    const q = useQueryState(false);

    const callback = (username: string, password: string) => {
        withQuery(
            () => trpc.users.create.mutate({ username, password }),
            q,
            (token) => {
                localStorage.setItem("token", token);
                clearCache();
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
    const q = useQueryState(false);

    const callback = (username: string, password: string) => {
        withQuery(
            () => trpc.users.login.mutate({ username, password }),
            q,
            (token) => {
                localStorage.setItem("token", token);
                clearCache();
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
