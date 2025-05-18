import Router from "@koa/router";
import { API_ENDPOINTS } from "../constants/api.constants";
import { prisma } from "../lib/prisma";
import { sendSuccess, sendError } from "../lib/response";
import { verifySession } from "supertokens-node/recipe/session/framework/koa";
import { SessionContext } from "supertokens-node/framework/koa";
import Joi from "joi";

interface DashboardRequestBody {
  name: string;
  layout: Record<string, any>;
}

const router = new Router();

// Validation schema for dashboard
const dashboardSchema = Joi.object({
  name: Joi.string().required().min(1).trim(),
  layout: Joi.object().required(),
});

// Get all dashboards for the user
router.get(
  API_ENDPOINTS.DASHBOARD.GET,
  verifySession(),
  async (ctx: SessionContext) => {
    try {
      const session = ctx.session;
      if (!session) {
        return sendError(ctx, "No valid session found", 401, "UNAUTHORIZED");
      }

      const supertokensId = session.getUserId();

      // First get the user to get their ID
      const user = await prisma.user.findUnique({
        where: { supertokensId },
        select: { id: true },
      });

      if (!user) {
        return sendError(ctx, "User not found", 401, "UNAUTHORIZED");
      }

      // Get all dashboards for the user
      const dashboards = await prisma.dashboard.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });

      return sendSuccess(ctx, dashboards);
    } catch (error) {
      console.error("Error fetching user dashboards:", error);
      return sendError(ctx, "Failed to fetch user dashboards");
    }
  }
);

// Save a new dashboard
router.post(
  API_ENDPOINTS.DASHBOARD.CREATE,
  verifySession(),
  async (ctx: SessionContext) => {
    try {
      const session = ctx.session;
      if (!session) {
        return sendError(ctx, "No valid session found", 401, "UNAUTHORIZED");
      }

      const supertokensId = session.getUserId();
      const body = await ctx.getJSONFromRequestBody();

      // Validate request body
      const { error, value } = dashboardSchema.validate(body);
      if (error) {
        return sendError(
          ctx,
          error.details[0].message,
          400,
          "VALIDATION_ERROR"
        );
      }

      const { name, layout } = value as DashboardRequestBody;

      // First get the user to get their ID
      const user = await prisma.user.findUnique({
        where: { supertokensId },
        select: { id: true },
      });

      if (!user) {
        return sendError(ctx, "User not found", 401, "UNAUTHORIZED");
      }

      // Create new dashboard
      const dashboard = await prisma.dashboard.create({
        data: {
          userId: user.id,
          name: name.trim(),
          layout,
        },
      });

      return sendSuccess(ctx, dashboard, 201);
    } catch (error) {
      console.error("Error saving dashboard:", error);
      return sendError(ctx, "Failed to save dashboard");
    }
  }
);

export default router;
