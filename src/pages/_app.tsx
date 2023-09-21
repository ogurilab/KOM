import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Notification } from "@/components/notification";
import "@/styles/globals.css";
import queryClient from "@/lib/query";

const DynamicAuthProvider = dynamic(
  () =>
    import("@/features/auth/components/AuthProvider").then(
      (mod) => mod.AuthProvider
    ),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }: AppProps) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <DynamicAuthProvider />
      <Notification />
      <Component {...pageProps} />
      <ReactQueryDevtools position="bottom" />
    </QueryClientProvider>
  );
}
