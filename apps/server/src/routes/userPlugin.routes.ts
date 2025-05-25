import Router from "@koa/router";
import { prisma } from "../lib/prisma";
import { sendSuccess, sendError } from "../lib/response";
import { API_ENDPOINTS } from "../constants/api.constants";
import { verifySession } from "supertokens-node/recipe/session/framework/koa";
import { SessionContext } from "supertokens-node/framework/koa";
import { pluginRegistry } from "../pluginLoader/registry";

const router = new Router();

// GET /api/v1/user/plugins - List all plugins enabled for the current user
router.get(
  API_ENDPOINTS.USER_PLUGIN.GET,
  verifySession(),
  async (ctx: SessionContext) => {
    try {
      const session = ctx.session;
      if (!session)
        return sendError(ctx, "No valid session found", 401, "UNAUTHORIZED");
      const supertokensId = session.getUserId();
      const user = await prisma.user.findUnique({
        where: { supertokensId },
        select: { id: true },
      });
      if (!user) return sendError(ctx, "User not found", 401, "UNAUTHORIZED");
      const userPlugins = await prisma.userPlugin.findMany({
        where: { userId: user.id },
        include: { plugin: true },
      });
      sendSuccess(
        ctx,
        userPlugins.map((up) => up.plugin)
      );
    } catch (error) {
      console.error("Error fetching user plugins:", error);
      sendError(ctx, "Failed to fetch user plugins");
    }
  }
);

// POST /api/v1/user/plugins/:pluginId - Enable a plugin for the user
router.post(
  API_ENDPOINTS.USER_PLUGIN.CREATE,
  verifySession(),
  async (ctx: SessionContext) => {
    try {
      const session = ctx.session;
      if (!session)
        return sendError(ctx, "No valid session found", 401, "UNAUTHORIZED");
      const supertokensId = session.getUserId();
      const user = await prisma.user.findUnique({
        where: { supertokensId },
        select: { id: true },
      });
      if (!user) return sendError(ctx, "User not found", 401, "UNAUTHORIZED");
      const { pluginId } = ctx.params;
      if (!pluginId)
        return sendError(ctx, "pluginId is required", 400, "VALIDATION_ERROR");
      const plugin = await prisma.plugin.findUnique({
        where: { name: pluginId },
      });
      if (!plugin) return sendError(ctx, "Plugin not found", 404, "NOT_FOUND");
      const existing = await prisma.userPlugin.findUnique({
        where: { userId_pluginId: { userId: user.id, pluginId: pluginId } },
      });
      if (existing)
        return sendError(
          ctx,
          "Plugin already enabled for user",
          409,
          "ALREADY_EXISTS"
        );
      const userPlugin = await prisma.userPlugin.create({
        data: { userId: user.id, pluginId: pluginId },
      });
      // Call onUserEnable hook if present
      const loadedPlugin = pluginRegistry.getPlugin(pluginId);
      if (loadedPlugin && loadedPlugin.hooks.onUserEnable) {
        await loadedPlugin.hooks.onUserEnable(user.id);
      }
      sendSuccess(ctx, userPlugin, 201);
    } catch (error) {
      console.error("Error enabling user plugin:", error);
      sendError(ctx, "Failed to enable user plugin");
    }
  }
);

// DELETE /api/v1/user/plugins/:pluginId - Disable a plugin for the user
router.delete(
  API_ENDPOINTS.USER_PLUGIN.DELETE,
  verifySession(),
  async (ctx: SessionContext) => {
    try {
      const session = ctx.session;
      if (!session)
        return sendError(ctx, "No valid session found", 401, "UNAUTHORIZED");
      const supertokensId = session.getUserId();
      const user = await prisma.user.findUnique({
        where: { supertokensId },
        select: { id: true },
      });
      if (!user) return sendError(ctx, "User not found", 401, "UNAUTHORIZED");
      const { pluginId } = ctx.params;
      if (!pluginId)
        return sendError(ctx, "pluginId is required", 400, "VALIDATION_ERROR");
      const existing = await prisma.userPlugin.findUnique({
        where: { userId_pluginId: { userId: user.id, pluginId: pluginId } },
      });
      if (!existing)
        return sendError(ctx, "Plugin not enabled for user", 404, "NOT_FOUND");
      await prisma.userPlugin.delete({
        where: { userId_pluginId: { userId: user.id, pluginId: pluginId } },
      });
      // Call onUserDisable hook if present
      const loadedPlugin = pluginRegistry.getPlugin(pluginId);
      if (loadedPlugin && loadedPlugin.hooks.onUserDisable) {
        await loadedPlugin.hooks.onUserDisable(user.id);
      }
      sendSuccess(ctx, { message: "Plugin disabled for user" });
    } catch (error) {
      console.error("Error disabling user plugin:", error);
      sendError(ctx, "Failed to disable user plugin");
    }
  }
);

export default router;
