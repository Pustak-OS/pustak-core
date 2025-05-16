import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";

export const backendConfig: TypeInput = {
  framework: "koa",
  supertokens: {
    connectionURI:
      process.env.SUPERTOKENS_CORE_URL ||
      "YOUR_MANAGED_SUPERTOKENS_CONNECTION_URI", // Fallback for clarity, should be in .env
    apiKey:
      process.env.SUPERTOKENS_API_KEY || "YOUR_MANAGED_SUPERTOKENS_API_KEY", // Fallback for clarity, should be in .env
  },
  appInfo: {
    appName: "Pustak Server",
    apiDomain: process.env.API_DOMAIN || "YOUR_API_DOMAIN",
    websiteDomain: process.env.WEB_DOMAIN || "YOUR_WEB_DOMAIN",
    apiBasePath: "/api/v1/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    ThirdParty.init({
      signInAndUpFeature: {
        providers: [
          {
            config: {
              thirdPartyId: "google",
              clients: [
                {
                  clientId: process.env.GOOGLE_CLIENT_ID || "",
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                },
              ],
            },
          },
        ],
      },
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            signInUp: async function (input) {
              let response = await originalImplementation.signInUp(input);
              if (response.status === "OK") {
                // TODO: Create a user in our database
              }

              return response;
            },
          };
        },
      },
    }),
    Session.init(),
  ],
};
