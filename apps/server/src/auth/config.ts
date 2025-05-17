import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import { prisma } from "../lib/prisma";

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
              // Post sign up response, we check if it was successful
              if (response.status === "OK") {
                let { id, emails } = response.user;
                console.log("User ID: ", id);

                // check if user already exists
                const existingUser = await prisma.user.findUnique({
                  where: {
                    supertokensId: id,
                  },
                });

                if (!existingUser) {
                  const name =
                    response.rawUserInfoFromProvider.fromUserInfoAPI!["name"];
                  const profilePic =
                    response.rawUserInfoFromProvider.fromUserInfoAPI![
                      "picture"
                    ];

                  const newUser = {
                    supertokensId: id,
                    email: emails[0],
                    name,
                    profilePic,
                    settings: {},
                  };
                  console.log("Creating new user in database", newUser);

                  // Store new user in database
                  await prisma.user.create({
                    data: newUser,
                  });
                }
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
