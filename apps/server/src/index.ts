import Koa from "koa";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/koa";
import { backendConfig } from "./auth/config";
import apiRoutes from "./routes";
import cors from "@koa/cors";
import koaStatic from "koa-static";
import path from "path";
import { PluginLoader } from "./pluginLoader";

async function startServer() {
  // Initialize SuperTokens
  supertokens.init(backendConfig);

  const app = new Koa();

  // Configure CORS
  app.use(
    cors({
      origin: process.env.WEB_DOMAIN || "http://localhost:4200",
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    })
  );

  // serve the static client files for plugins
  const PLUGINS_DIR = path.resolve(__dirname, "../../../plugins");
  console.log("PLUGINS_DIR", PLUGINS_DIR);
  app.use(
    koaStatic(PLUGINS_DIR, {
      extensions: ["mjs", "js", "css", "html", "json"],
      index: false,
    })
  );

  // Initialize and load plugins
  const pluginLoader = new PluginLoader(PLUGINS_DIR, app);
  await pluginLoader.loadPlugins();

  // Add SuperTokens middleware
  app.use(middleware());
  // Add routes
  app.use(apiRoutes.routes());
  app.use(apiRoutes.allowedMethods());

  const PORT = process.env.PORT || 4300;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
