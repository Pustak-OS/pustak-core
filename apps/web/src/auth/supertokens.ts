import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";

export function initSuperTokens() {
  SuperTokens.init({
    appInfo: {
      appName: "Pustak Web",
      apiDomain: "http://localhost:4300", // Updated server port
      websiteDomain: "http://localhost:4200", // Updated web port
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            // ThirdPartyEmailPassword.Google.init(),
            // ThirdPartyEmailPassword.Github.init(),
          ],
        },
      }),
      Session.init(),
    ],
  });
}
