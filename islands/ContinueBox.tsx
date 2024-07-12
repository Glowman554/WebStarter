export function ContinueBox(
    props: {
        continueCallback: () => void;
        cancelCallback: () => void;
        resetCallback: () => void;
        message: string;
    },
) {
    return (
        <div class="glow-confirm-bg">
            <div class="glow-confirm">
                <div class="glow-field">
                    <div>
                        <h2>{props.message}</h2>
                        <h3>Do you want to continue?</h3>
                    </div>
                    <div class="glow-section">
                        <button
                            style={{ width: "40%" }}
                            onClick={() => {
                                props.resetCallback();
                                props.continueCallback();
                            }}
                            class="glow-fancy-button"
                        >
                            Continue
                        </button>
                        <button
                            style={{ width: "40%" }}
                            onClick={() => {
                                props.resetCallback();
                                props.cancelCallback();
                            }}
                            class="glow-fancy-button"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}