import Router from "@koa/router";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { sendSuccess } from "./lib/response";

const router = new Router({
  prefix: "/api/v1",
});

router.get("/health", (ctx) => {
  sendSuccess(ctx, {
    status: "ok",
    version: "1.0.0",
    service: "pustak-server",
  });
});

// Mount routes
router.use(userRoutes.routes());
router.use(dashboardRoutes.routes());

export default router;
