import { useQuery } from "@tanstack/react-query";
import { pluginsService } from "../api/services/plugins";
import type { Plugin } from "../api/services/plugins";

export function useInstalledPlugins() {
  return useQuery<Plugin[]>({
    queryKey: ["plugins", "installed"],
    queryFn: () => pluginsService.getAll(),
  });
}

export function useUserEnabledPlugins() {
  return useQuery<Plugin[]>({
    queryKey: ["plugins", "user-enabled"],
    queryFn: () => pluginsService.getUserEnabled(),
  });
}
