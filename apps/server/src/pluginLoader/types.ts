import Router from "@koa/router";
import Koa from "koa";

// Plugin developer interface
export interface PluginConfig {
  name: string;
  serverEntry: string;
}

export interface PluginContext {
  app: Koa;
  router: Router;
}

export interface PluginHooks {
  firstTimeSetup?: (context: PluginContext) => Promise<void>;
  registerRoutes?: (context: PluginContext) => Promise<void>;
}

// Internal types
export interface InternalPlugin {
  config: PluginConfig;
  hooks: PluginHooks;
  isInitialized: boolean;
}
