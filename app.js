import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./middlewares/auth.js";

import addkey from "./routes/addService.js";

const app = new Hono();

// app.use("*", cors({
//     origin: [
//         "https://keevlt.pages.dev",
//         "http://localhost:5501"
//     ],
//     allowMethods: ["GET", "POST", "PUT", "DELETE"]
// }));

app.use("*", cors());
app.use("*", authMiddleware);

app.route("/api", addkey);

export default app;
