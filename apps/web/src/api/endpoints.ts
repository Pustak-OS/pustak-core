const BASE_ENDPOINT = "/api/v1";
export const ENDPOINTS = {
  userProfile: {
    get: { url: `${BASE_ENDPOINT}/user/profile`, method: "GET" },
  },
  dashboards: {
    get: { url: `${BASE_ENDPOINT}/dashboards`, method: "GET" },
  },
  plugins: {
    getAll: { url: `${BASE_ENDPOINT}/plugins`, method: "GET" },
    getUserEnabled: { url: `${BASE_ENDPOINT}/user/plugins`, method: "GET" },
  },
};
