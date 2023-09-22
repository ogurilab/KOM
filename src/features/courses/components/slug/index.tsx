import React, { Suspense } from "react";
import { Messages } from "@/features/messages/components";
import Layout from "@/layouts";

export function Course() {
  return (
    <Layout>
      <Suspense>
        <Messages />
      </Suspense>
    </Layout>
  );
}
