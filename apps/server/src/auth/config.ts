import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { TypeInput } from "supertokens-node/types";

export const backendConfig: TypeInput = {
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
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    ThirdParty.init({
      // providers: [
      //     // Add your OAuth providers here
      //     ThirdPartyEmailPassword.Google({
      //         clientId: "GOOGLE_CLIENT_ID",
      //         clientSecret: "GOOGLE_CLIENT_SECRET"
      //     })
      // ]
    }),
    Session.init(),
    Dashboard.init(),
    UserRoles.init(),
  ],
  isInServerlessEnv: true, // Important for some environments like Vercel
};
