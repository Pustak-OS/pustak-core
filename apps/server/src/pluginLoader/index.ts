import fs from "fs/promises";
import path from "path";
import { PluginRegistry } from "./registry";
import {
  InternalPlugin,
  PluginConfig,
  PluginContext,
  PluginHooks,
} from "./types";
import Koa from "koa";
import Router from "@koa/router";

export class PluginLoader {
  private registry: PluginRegistry;
  private pluginsDir: string;
  private app: Koa;

  constructor(pluginsDir: string, app: Koa) {
    this.pluginsDir = pluginsDir;
    this.app = app;
    this.registry = new PluginRegistry();
  }

  async loadPlugins(): Promise<void> {
    try {
      const entries = await fs.readdir(this.pluginsDir, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          await this.loadPlugin(path.join(this.pluginsDir, entry.name));
        }
      }

      // Initialize all loaded plugins
      for (const plugin of this.registry.getAllPlugins()) {
        await this.initializePlugin(plugin);
      }
    } catch (error) {
      console.error("Failed to load plugins:", error);
      throw error;
    }
  }

  private async loadPlugin(pluginDir: string): Promise<void> {
    try {
      const configPath = path.join(pluginDir, "plugin.json");
      const configContent = await fs.readFile(configPath, "utf-8");
      const config: PluginConfig = JSON.parse(configContent);

      // Validate config
      if (!config.name || !config.serverEntry) {
        throw new Error(`Invalid plugin config in ${pluginDir}`);
      }

      // Load server entry
      const serverEntryPath = path.join(pluginDir, config.serverEntry);
      const pluginModule = await import(serverEntryPath);

      // Use named exports only
      const hooks: PluginHooks = {
        ...pluginModule,
      };

      if (!hooks.firstTimeSetup && !hooks.registerRoutes) {
        throw new Error(
          `No valid hooks exported from plugin module in ${serverEntryPath}`
        );
      }

      const plugin: InternalPlugin = {
        config,
        hooks,
        isInitialized: false,
      };

      this.registry.addPlugin(config.name, plugin);
    } catch (error) {
      console.error(`Failed to load plugin from ${pluginDir}:`, error);
      throw error;
    }
  }

  private async initializePlugin(plugin: InternalPlugin): Promise<void> {
    if (plugin.isInitialized) return;

    console.log("--------------------------------");
    console.log("Initializing plugin", plugin.config.name);

    const router = new Router({
      prefix: `/api/v1/plugin/${plugin.config.name}`,
    });

    const context: PluginContext = {
      app: this.app,
      router,
    };

    try {
      // Run firstTimeSetup if it exists
      if (plugin.hooks.firstTimeSetup) {
        await plugin.hooks.firstTimeSetup(context);
      }

      // Register routes if the hook exists
      if (plugin.hooks.registerRoutes) {
        await plugin.hooks.registerRoutes(context);
        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
      }

      plugin.isInitialized = true;
      console.log("Plugin initialized", plugin.config.name);
      console.log("--------------------------------");
    } catch (error) {
      console.error(
        `Failed to initialize plugin ${plugin.config.name}:`,
        error
      );
      throw error;
    }
  }
}
