import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types/api.types";

export interface Dashboard {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const dashboardsService = {
  get: () =>
    api
      .request<ApiResponse<Dashboard[]>>({
        ...ENDPOINTS.dashboards.get,
      })
      .then((res) => {
        if (!res.data.success) {
          throw new Error(
            res.data.error?.message || "Failed to fetch dashboards"
          );
        }
        return res.data.data;
      }),
};
