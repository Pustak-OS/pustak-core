import { InternalPlugin } from "./types";

class PluginRegistry {
  private plugins: Map<string, InternalPlugin> = new Map();

  addPlugin(name: string, plugin: InternalPlugin): void {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin with name ${name} is already registered`);
    }
    this.plugins.set(name, plugin);
  }

  getPlugin(name: string): InternalPlugin | undefined {
    return this.plugins.get(name);
  }

  isPluginLoaded(name: string): boolean {
    return this.plugins.has(name);
  }

  getAllPlugins(): InternalPlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginRegistry = new PluginRegistry();
