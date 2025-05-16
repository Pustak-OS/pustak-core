import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Session from "supertokens-node/recipe/session";
import Dashboard from "supertokens-node/recipe/dashboard";
import UserRoles from "supertokens-node/recipe/userroles";
import { TypeInput } from "supertokens-node/types";

export const backendConfig: TypeInput = {
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CORE_URL || "http://localhost:3567", // Default if not in .env
  },
  appInfo: {
    appName: "Pustak Server",
    apiDomain: process.env.API_DOMAIN || "http://localhost:3001",
    websiteDomain: process.env.WEB_DOMAIN || "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
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
