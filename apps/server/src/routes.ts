import Router from "@koa/router";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import pluginRoutes from "./routes/plugin.routes";
import userPluginRoutes from "./routes/userPlugin.routes";
import { sendSuccess } from "./lib/response";

const router = new Router();

router.get("/api/v1/health", (ctx) => {
  sendSuccess(ctx, {
    status: "ok",
    version: "1.0.0",
    service: "pustak-server",
  });
});

// Mount routes
router.use(userRoutes.routes());
router.use(dashboardRoutes.routes());
router.use(pluginRoutes.routes());
router.use(userPluginRoutes.routes());

export default router;
