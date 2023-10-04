import { useAtom, useAtomValue } from "jotai";
import React, { Suspense } from "react";
import { Loader } from "@/components/loader";
import { Title } from "@/components/meta";
import { Switch } from "@/components/switch";
import { qAndAAtom, userAtom } from "@/context";
import useCourse from "@/features/courses/hooks/slug";
import { Messages } from "@/features/messages/components";
import { MessageForm } from "@/features/messages/components/form";
import Layout from "@/layouts";

export function Course() {
  const { name } = useCourse();
  const [isOpen, setIsOpen] = useAtom(qAndAAtom);
  const user = useAtomValue(userAtom);

  return (
    <Layout
      title={name}
      side={
        <Switch
          enabled={isOpen}
          setEnabled={setIsOpen}
          label={
            user?.profile?.role === "Teacher" ? "Q&Aのみ表示" : "回答のみ表示"
          }
        />
      }
    >
      <Title title={name} />
      <div className="mb-32">
        {user ? (
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
        ) : (
          <Loader
            theme="primary"
            variant="dots"
            size="xl"
            className="mx-auto mt-40"
          />
        )}
      </div>
      <MessageForm />
    </Layout>
  );
}
