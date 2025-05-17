import Router from "@koa/router";

const router = new Router();

router.get("/api/v1/health", (ctx) => {
  ctx.body = { status: "UP", service: "pustak-server" };
});

export default router;
