import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Notification } from "@/components/notification";
import "@/styles/globals.css";

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
  return (
    <>
      <DynamicAuthProvider />
      <Notification />
      <Component {...pageProps} />
    </>
  );
}
