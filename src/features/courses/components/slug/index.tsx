import { useAtom } from "jotai";
import React, { Suspense } from "react";
import { Loader } from "@/components/loader";
import { Title } from "@/components/meta";
import { Switch } from "@/components/switch";
import { qAndAAtom } from "@/context";
import useCourse from "@/features/courses/hooks/slug";
import { Messages } from "@/features/messages/components";
import { MessageForm } from "@/features/messages/components/form";
import Layout from "@/layouts";

export function Course() {
  const { data, isLoading } = useCourse();
  const [isOpen, setIsOpen] = useAtom(qAndAAtom);

  return (
    <Layout
      title={isLoading ? "Loading..." : data?.name}
      side={
        <Switch
          enabled={isOpen}
          setEnabled={setIsOpen}
          label="回答と質問のみ表示"
        />
      }
    >
      <Title title={data?.name} />
      <div className="mb-[147px]">
        <Suspense
          fallback={
            <Loader
              theme="primary"
              variant="dots"
              size="xl"
              className="mx-auto mt-40"
            />
          }
        >
          <Messages />
        </Suspense>
      </div>
      <MessageForm />
    </Layout>
  );
}
