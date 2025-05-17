import React from "react";
import { BrowserRouter } from "react-router-dom";
import SuperTokensProvider from "./supertokens";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuperTokensProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </SuperTokensProvider>
  );
};
