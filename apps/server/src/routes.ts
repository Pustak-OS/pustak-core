import Router from "@koa/router";
// import { verifySession } from 'supertokens-node/recipe/session/framework/koa';

const router = new Router();

// Example protected route
// router.get('/api/user', verifySession(), async (ctx) => {
//   const userId = ctx.session!.getUserId();
//   // Fetch user data based on userId
//   ctx.body = { userId, email: 'user@example.com' };
// });

router.get("/api/health", (ctx) => {
  ctx.body = { status: "UP", service: "pustak-server" };
});

export default router;
