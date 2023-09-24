import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import React from "react";
import TextareaAutosize from "react-autosize-textarea";
import { CategoryBadge } from "@/components/categoryBadge";
import { useMessageForm } from "@/features/messages/hooks/form";
import { Categories } from "@/schema/db";

const BorderColors = {
  [Categories.ChitChat]: "border-green-600",
  [Categories.Question]: "border-blue-600",
  [Categories.Contact]: "border-yellow-700",
  [Categories.Request]: "border-red-600",
  [Categories.Others]: "border-gray-600",
};

export function MessageForm() {
  const {
    selectCategory,
    setSelectCategory,
    value,
    setValue,
    onSubmitHandler,
    isPending,
  } = useMessageForm();

  return (
    <form
      onSubmit={onSubmitHandler}
      className="fixed bottom-0 right-0 z-20 w-full  lg:pl-72"
    >
      <div className="flex flex-col items-center justify-center border-t bg-white p-4 ">
        <div className="mb-2 flex  w-full justify-between px-2.5">
          {Object.values(Categories).map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setSelectCategory(category)}
              className={clsx(
                "flex cursor-pointer items-center justify-center rounded-md  text-xs font-medium",
                selectCategory === category
                  ? `${BorderColors[category]} border-2`
                  : ""
              )}
            >
              <CategoryBadge category={category} />
            </button>
          ))}
        </div>
        <div className="flex w-full max-w-lg flex-1 gap-x-4">
          <TextareaAutosize
            aria-label="コメントを入力"
            className={clsx(
              " w-full resize-none appearance-none rounded-md border border-gray-300 px-4 py-2 placeholder:pt-1 placeholder:text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:border-red-500 disabled:bg-white disabled:opacity-50  disabled:ring-red-500"
            )}
            maxRows={4}
            onChange={(e) => setValue(e.currentTarget.value)}
            value={value}
          />
          <button
            type="submit"
            disabled={isPending}
            className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 p-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <p className="mt-4 text-gray-600">ルールを守って投稿してください。</p>
      </div>
    </form>
  );
}
