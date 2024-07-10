import { type PageProps } from "$fresh/server.ts";
import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import { Navigation } from "../islands/Navigation.tsx";

export default function App({ Component }: PageProps) {
    return (
        <html>
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <link rel="stylesheet" href="/styles.css" />
                <link rel="stylesheet" href="/fonts/jetbrains_mono/font.css" />
            </head>
            <body>
                <div class="glow-content">
                    <Navigation />
                    <Header />
                    <Component />
                </div>
                <Footer />
            </body>
        </html>
    );
}
