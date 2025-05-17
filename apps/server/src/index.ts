import Koa from "koa";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/koa";
import { backendConfig } from "./auth/config";
import apiRoutes from "./routes";
import cors from "@koa/cors";
import { PrismaClient } from "./generated/prisma";

// Initialize SuperTokens
supertokens.init(backendConfig);

const app = new Koa();

// Initialize Prisma
new PrismaClient();

// Configure CORS
app.use(
  cors({
    origin: process.env.WEB_DOMAIN || "http://localhost:4200",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  })
);
app.use(middleware()); // SuperTokens middleware
app.use(apiRoutes.routes()).use(apiRoutes.allowedMethods()); // API routes

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
