import {
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Pattern } from "@/components/pattern";

const faqs = [
  {
    name: "匿名なのになぜ、認証するのですか？",
    description:
      "学校の情報や講義の情報など、学生にとって重要な情報を扱うため、認証を行っています。教授に使用者の情報が漏れることはありません。誹謗中傷などがあった場合は、使用者の情報を教授に伝えることがあります。",
    icon: ShieldExclamationIcon,
    id: "auth",
  },
  {
    name: "なぜページが見つかりませんか？",
    description:
      "お探しのページは削除されたか、移動した可能性があります。または、URLが間違っている可能性があります。",
    icon: MagnifyingGlassIcon,
    id: "search",
  },
];

function Page() {
  return (
    <div>
      <Pattern />
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
        <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base font-semibold leading-8 text-red-600">
            何かがうまくいかなかったようです。
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Internal Server Error
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
            申し訳ありません。現在サーバエラーが発生しております。再度時間をおいてアクセスしてください.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">よくある質問</h2>
          <ul className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5">
            {faqs.map((faq) => (
              <li key={faq.id} className="relative flex gap-x-6 py-6">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white/60 shadow-sm ring-1 ring-gray-900/10">
                  <faq.icon
                    aria-hidden="true"
                    className="h-6 w-6 text-indigo-600"
                  />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    <p>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {faq.name}
                    </p>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {faq.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => window.location.assign(window.location.origin)}
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
