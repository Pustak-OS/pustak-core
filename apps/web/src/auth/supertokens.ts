import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";

export function initSuperTokens() {
  SuperTokens.init({
    appInfo: {
      appName: "Pustak Web",
      apiDomain: "http://localhost:3001", // Replace with your API domain
      websiteDomain: "http://localhost:3000", // Replace with your website domain
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
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
