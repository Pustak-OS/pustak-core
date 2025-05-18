export const API_VERSION = "v1";
export const BASE_URL = "/api";

export const API_ENDPOINTS = {
  USER: {
    PROFILE: `${BASE_URL}/${API_VERSION}/user/profile`,
  },
  DASHBOARD: {
    GET: `${BASE_URL}/${API_VERSION}/dashboards`,
    CREATE: `${BASE_URL}/${API_VERSION}/dashboard`,
  },
};

export type ApiEndpoints = typeof API_ENDPOINTS;
