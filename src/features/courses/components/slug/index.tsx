import React, { Suspense } from "react";
import useCourse from "@/features/courses/hooks/slug";
import { Messages } from "@/features/messages/components";
import { MessageForm } from "@/features/messages/components/form";
import Layout from "@/layouts";

// const MockData = Array.from({ length: 1000 }, (_, i) => ({
//   content: `メッセージ${i}`,
// }));

export function Course() {
  const { data, isLoading } = useCourse();
  return (
    <Layout title={isLoading ? "Loading..." : data?.name}>
      <div className="mb-[147px]">
        <Suspense>
          <Messages />
        </Suspense>
      </div>
      <MessageForm />
    </Layout>
  );
}
