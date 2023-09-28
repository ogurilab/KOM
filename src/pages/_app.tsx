import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useState } from "react";
import "@/styles/globals.css";
import queryClient from "@/lib/query";

const DynamicNotification = dynamic(
  () => import("@/components/notification").then((mod) => mod.Notification),
  {
    ssr: false,
  }
);

const DynamicAuthProvider = dynamic(
  () =>
    import("@/features/auth/components/AuthProvider").then(
      (mod) => mod.AuthProvider
    ),
  {
    ssr: false,
  }
);

const DynamicNextNProgress = dynamic(() => import("nextjs-progressbar"));

export default function App({ Component, pageProps }: AppProps) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <DynamicNextNProgress
        color="#2563eb"
        height={3}
        options={{ showSpinner: false }}
        startPosition={0.1}
      />
      <DynamicAuthProvider />
      <DynamicNotification />
      <Component {...pageProps} />
      <ReactQueryDevtools position="bottom" />
    </QueryClientProvider>
  );
}
