import Router from "@koa/router";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const router = new Router();

router.get("/api/v1/health", (ctx) => {
  ctx.body = { status: "UP", service: "pustak-server" };
});

// Mount routes
router.use(userRoutes.routes());
router.use(dashboardRoutes.routes());

export default router;
