"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@workspace/ui/components/sonner";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

type DesignSystemProviderProperties = ThemeProviderProps & {
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const Provider = ({
  children,
  privacyUrl,
  termsUrl,
  helpUrl,
  ...properties
}: DesignSystemProviderProperties) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            let errorMessage: string;
            if (err instanceof Error) {
              errorMessage = err.message;
            } else {
              errorMessage = "An unknown error occurred.";
            }
          },
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TooltipProvider>
          <ThemeProvider defaultTheme="dark" forcedTheme="dark" {...properties}>
            {children}
          </ThemeProvider>
          <Toaster richColors closeButton />
        </TooltipProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};