'use client';

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { useState } from "react";


export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {

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
          {children}
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
