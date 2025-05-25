import Router from "@koa/router";
import { prisma } from "../lib/prisma";
import { sendSuccess, sendError } from "../lib/response";
import { API_ENDPOINTS } from "../constants/api.constants";

const router = new Router();

// GET /api/v1/plugins - List all plugins
router.get(API_ENDPOINTS.PLUGIN.GET, async (ctx) => {
  try {
    const plugins = await prisma.plugin.findMany();
    sendSuccess(ctx, plugins);
  } catch (error) {
    console.error("Error fetching plugins:", error);
    sendError(ctx, "Failed to fetch plugins");
  }
});

export default router;
