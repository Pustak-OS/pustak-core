import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/koa";
import { backendConfig } from "./auth/config"; // Corrected import path and name
import apiRoutes from "./routes";

// Initialize SuperTokens
supertokens.init(backendConfig);

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(middleware()); // SuperTokens middleware

// Basic route
router.get("/hello", (ctx) => {
  ctx.body = "Hello from Pustak Server!";
});

// Add other routes here (e.g., from ./routes.ts)
app.use(apiRoutes.routes()).use(apiRoutes.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());
// app.use(errorHandler()); // SuperTokens error handler

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
