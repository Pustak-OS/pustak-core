import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { UserProfile } from "../types/user.types";
import type { ApiResponse } from "../types/api.types";

export const userProfileService = {
  get: () =>
    api
      .request<ApiResponse<UserProfile>>({
        ...ENDPOINTS.userProfile.get,
      })
      .then((res) => {
        if (!res.data.success) {
          throw new Error(
            res.data.error?.message || "Failed to fetch user profile"
          );
        }
        return res.data.data;
      }),
};
