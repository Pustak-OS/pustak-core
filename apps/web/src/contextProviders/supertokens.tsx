import React from "react";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdParty, { Google } from "supertokens-auth-react/recipe/thirdparty";

try {
  SuperTokens.init({
    appInfo: {
      appName: "Pustak Web",
      apiDomain: process.env.API_DOMAIN || "",
      websiteDomain: process.env.WEB_DOMAIN || "",
      apiBasePath: "/api/v1/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [Google.init()],
        },
      }),
      Session.init(),
    ],
  });
} catch (error) {
  console.error(error);
}

export default function SuperTokensProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}
