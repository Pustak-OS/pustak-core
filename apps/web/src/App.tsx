import { Providers } from "./contextProviders";
import { useRoutes } from "react-router-dom";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import * as reactRouterDom from "react-router-dom";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";
import NotFound from "./pages/404";

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
          <Layout />
        </SessionAuth>
      ),
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        // default route
        {
          path: "*",
          element: <NotFound />,
        },
        // Add more routes here as needed
      ],
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
