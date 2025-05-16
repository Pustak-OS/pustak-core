import Koa from "koa";
import Router from "@koa/router";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/koa";
import { backendConfig } from "./auth/config"; // Corrected import path and name
import apiRoutes from "./routes";
import cors from "@koa/cors";

// Initialize SuperTokens
supertokens.init(backendConfig);

const app = new Koa();
const router = new Router();

// Configure CORS
app.use(
  cors({
    origin: process.env.WEB_DOMAIN || "http://localhost:4200",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  })
);

app.use(middleware());

// Add other routes here (e.g., from ./routes.ts)
app.use(apiRoutes.routes()).use(apiRoutes.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());
// app.use(errorHandler()); // SuperTokens error handler

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
