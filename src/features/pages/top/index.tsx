import dynamic from "next/dynamic";
import React from "react";
import { Title } from "@/components/meta";
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

export function Top() {
  return (
    <Layout title="Home">
      <Title title="Home" />
      <h2 className="text-center text-3xl font-bold text-gray-900">
        <span>Welcome to</span>
        <span className="text-blue-600"> SiLec</span>
      </h2>

      <p className="mt-4 text-center leading-6 text-gray-600">
        このサイトは、教授と匿名で質問を行うことができます。
      </p>

      <div className="mt-32">
        <h3 className="text-center text-xl font-bold text-gray-900">
          講義を登録してみましょう！
        </h3>

        <div className="mx-auto mt-10 max-w-md">
          <DynamicRegister />
        </div>
      </div>
    </Layout>
  );
}
