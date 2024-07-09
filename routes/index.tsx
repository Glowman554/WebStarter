import { CreateField, LoginField } from "../islands/Account.tsx";
import TrpcPlayground from "../islands/TrpcPlayground.tsx";

export default function Home() {
    return (
        <div class="glow-text">
            <TrpcPlayground />
            <LoginField />
            <CreateField />
        </div>
    );
}
