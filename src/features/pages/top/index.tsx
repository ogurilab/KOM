import clsx from "clsx";
import { useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import React from "react";
import { Title } from "@/components/meta";
import { userAtom } from "@/context";
import Layout from "@/layouts";

const DynamicRegister = dynamic(
  () =>
    import("@/features/courses/components/register").then(
      (mod) => mod.RegisterTop
    ),
  {
    ssr: false,
  }
);

const DynamicCreateCourse = dynamic(
  () =>
    import("@/features/courses/components/create").then(
      (mod) => mod.CreateTopCourse
    ),
  {
    ssr: false,
  }
);

export function Top() {
  const user = useAtomValue(userAtom);

  return (
    <Layout title="Home">
      <Title title="Home" />
      <h2 className="text-center text-3xl font-bold text-gray-900">
        <span>Welcome to</span>
        <span className="bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-center text-transparent">
          {" "}
          SiLec
        </span>
      </h2>

      <p className="mt-4 text-center leading-6 text-gray-600">
        このサイトは、教授と匿名で質問を行うことができます。
      </p>

      <div className="mt-32">
        <h3 className="text-center text-xl font-bold text-gray-900">
          講義を{user?.profile?.role === "Student" ? "登録" : "作成"}
          してみましょう！
        </h3>

        <div
          className={clsx(
            "mt-10",
            user?.profile?.role === "Student" ? "mx-auto max-w-sm" : ""
          )}
        >
          {user?.profile?.role === "Student" ? (
            <DynamicRegister />
          ) : (
            <DynamicCreateCourse />
          )}
        </div>
      </div>
    </Layout>
  );
}
