import Router from "@koa/router";
import { API_ENDPOINTS } from "../constants/api.constants";
import { prisma } from "../lib/prisma";
import { sendSuccess, sendError } from "../lib/response";
import { verifySession } from "supertokens-node/recipe/session/framework/koa";
import { SessionContext } from "supertokens-node/framework/koa";

const router = new Router();

router.get(
  API_ENDPOINTS.USER.PROFILE,
  verifySession(),
  async (ctx: SessionContext) => {
    try {
      // Get the session from SuperTokens
      const session = ctx.session;
      if (!session) {
        return sendError(ctx, "No valid session found", 401, "UNAUTHORIZED");
      }

      // Get the user ID from the session
      const supertokensId = session.getUserId();

      // Fetch user from database using supertokensId
      const user = await prisma.user.findUnique({
        where: {
          supertokensId: supertokensId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          profilePic: true,
          settings: true,
          createdAt: true,
        },
      });

      if (!user) {
        return sendError(ctx, "User not found", 401, "UNAUTHORIZED");
      }

      return sendSuccess(ctx, user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return sendError(ctx, "Failed to fetch user profile");
    }
  }
);

export default router;
