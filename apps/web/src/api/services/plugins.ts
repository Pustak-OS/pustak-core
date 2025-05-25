import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types/api.types";

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  currentVersion: string;
  installedAt: string;
  updatedAt: string;
}

export const pluginsService = {
  getAll: () =>
    api
      .request<ApiResponse<Plugin[]>>({
        ...ENDPOINTS.plugins.getAll,
      })
      .then((res) => {
        if (!res.data.success) {
          throw new Error(
            res.data.error?.message || "Failed to fetch installed plugins"
          );
        }
        return res.data.data;
      }),
  getUserEnabled: () =>
    api
      .request<ApiResponse<Plugin[]>>({
        ...ENDPOINTS.plugins.getUserEnabled,
      })
      .then((res) => {
        if (!res.data.success) {
          throw new Error(
            res.data.error?.message || "Failed to fetch user enabled plugins"
          );
        }
        return res.data.data;
      }),
};
