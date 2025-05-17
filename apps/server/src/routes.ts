import Router from "@koa/router";
import userRoutes from "./routes/user.routes";

const router = new Router();

router.get("/api/v1/health", (ctx) => {
  ctx.body = { status: "UP", service: "pustak-server" };
});

// Mount user routes
router.use(userRoutes.routes());
router.use(userRoutes.allowedMethods());

export default router;
