#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { Builder } from "fresh/dev";
import { app } from "./main.ts";
import { common } from "./common.ts";

const builder = new Builder();

if (Deno.args.includes("build")) {
    await builder.build(app);
} else {
    await common();
    await builder.listen(app);
}
