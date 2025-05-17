import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import SuperTokensProvider from "./supertokens";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuperTokensProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </SuperTokensProvider>
    </QueryClientProvider>
  );
}
