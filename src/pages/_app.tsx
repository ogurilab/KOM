import type { AppProps } from "next/app";
import { Notification } from "@/components/notification";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Notification />
      <Component {...pageProps} />;
    </>
  );
}
