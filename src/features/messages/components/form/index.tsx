import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import React from "react";
import TextareaAutosize from "react-autosize-textarea";
import { CategoryBadge } from "@/components/categoryBadge";
import { useMessageForm } from "@/features/messages/hooks/form";
import { Categories } from "@/schema/db";

const BorderColors = {
  [Categories.ChitChat]:
    "border-green-600 focus:ring-green-500 focus:border-green-500",
  [Categories.Answer]:
    "border-purple-600 focus:ring-purple-500 focus:border-purple-500",
  [Categories.Question]:
    "border-blue-600 focus:ring-blue-500 focus:border-blue-500",
  [Categories.Contact]:
    "border-yellow-700 focus:ring-yellow-600 focus:border-yellow-600",
  [Categories.Request]:
    "border-red-600 focus:ring-red-500 focus:border-red-500",
  [Categories.Others]:
    "border-gray-600 focus:ring-gray-500 focus:border-gray-500",
};

const SubmitColor = {
  [Categories.ChitChat]: "bg-green-600 hover:bg-green-500 focus:ring-green-500",
  [Categories.Answer]:
    "bg-purple-600 hover:bg-purple-500 focus:ring-purple-500",
  [Categories.Question]: "bg-blue-600 hover:bg-blue-500 focus:ring-blue-500",
  [Categories.Contact]:
    "bg-yellow-700 hover:bg-yellow-600 focus:ring-yellow-600",
  [Categories.Request]: "bg-red-600 hover:bg-red-500 focus:ring-red-500",
  [Categories.Others]: "bg-gray-600 hover:bg-gray-500 focus:ring-gray-500",
};

export function MessageForm() {
  const {
    selectCategory,
    setSelectCategory,
    value,
    setValue,
    onSubmitHandler,
    isPending,
    role,
    ref,
    questionId,
    onBlurHandler,
  } = useMessageForm();

  return (
    <form
      onSubmit={onSubmitHandler}
      className="fixed bottom-0 right-0 z-10 w-full  lg:pl-72"
    >
      <div className="flex flex-col items-center justify-center border-t bg-white p-4 ">
        <div className="mb-4 flex  w-full justify-between px-2.5">
          {Object.values(Categories).map((category) => {
            if (category === "Answer" && role === "Student") return null;

            return (
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
            );
          })}
        </div>
        <div className="flex w-full max-w-lg flex-1 gap-x-4">
          <TextareaAutosize
            ref={ref}
            aria-label="コメントを入力"
            className={clsx(
              " w-full resize-none appearance-none rounded-md border  px-4 py-2 placeholder:pt-1 placeholder:text-xs disabled:border-red-500 disabled:bg-white disabled:opacity-50  disabled:ring-red-500",
              BorderColors[selectCategory]
            )}
            maxRows={4}
            onChange={(e) => setValue(e.currentTarget.value)}
            value={value}
            onBlur={onBlurHandler}
            placeholder={questionId ? "回答を入力" : "コメントを入力"}
          />
          <button
            type="submit"
            disabled={isPending}
            className={clsx(
              "grid h-10 w-10 place-items-center rounded-full p-2  focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50",
              SubmitColor[selectCategory]
            )}
          >
            <PaperAirplaneIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <p className="mt-4 text-gray-600">ルールを守って投稿してください。</p>
      </div>
    </form>
  );
}
