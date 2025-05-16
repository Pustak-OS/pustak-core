import React from "react";
import { Providers } from "./contextProviders";
import { useRoutes } from "react-router-dom";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import * as reactRouterDom from "react-router-dom";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
  const authRoutes = getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
    ThirdPartyPreBuiltUI,
  ]);

  const routes = useRoutes([
    ...authRoutes.map((route) => route.props),
    // Include the rest of your app routes
    {
      path: "/",
      element: (
        <SessionAuth>
          <Dashboard />
        </SessionAuth>
      ),
    },
  ]);

  return routes;
}

function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
