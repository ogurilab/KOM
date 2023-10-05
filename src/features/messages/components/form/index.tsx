import { DocumentTextIcon } from "@heroicons/react/24/outline";
import {
  PaperAirplaneIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import React from "react";
import TextareaAutosize from "react-autosize-textarea";
import { CategoryBadge } from "@/components/categoryBadge";
import { Image } from "@/components/image";
import { useMessageForm } from "@/features/messages/hooks/form";
import { Categories, MessageType } from "@/schema/db";

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

const IconColors = {
  [Categories.ChitChat]: "bg-green-600",
  [Categories.Answer]: "bg-purple-600",
  [Categories.Question]: "bg-blue-600",
  [Categories.Contact]: "bg-yellow-700",
  [Categories.Request]: "bg-red-600",
  [Categories.Others]: "bg-gray-600",
};

function FilePreview({
  selectedFile,
  selectCategory,
  onDeleteHandler,
  isPending,
}: {
  selectedFile: {
    file: File;
    preview: string | null;
  };
  selectCategory: MessageType;
  onDeleteHandler: () => void;
  isPending: boolean;
}) {
  const { name, type } = selectedFile.file;
  const isImage = type.startsWith("image");

  return (
    <div
      className={clsx(
        "rounded-md rounded-b-none border border-b-0 px-4 py-2",
        BorderColors[selectCategory]
      )}
    >
      <div
        className={clsx(
          "group relative -ml-2 flex w-fit max-w-full items-center gap-x-2 rounded-xl border p-2",
          BorderColors[selectCategory]
        )}
      >
        {selectedFile.preview && isImage ? (
          <Image
            isLoading={isPending}
            src={selectedFile.preview}
            alt={name}
            className="rounded-md object-cover"
            width={40}
            height={40}
          />
        ) : (
          <>
            <div
              className={clsx(
                IconColors[selectCategory],
                "grid h-10 w-10 place-items-center rounded-md p-2"
              )}
            >
              <DocumentTextIcon
                aria-hidden="true"
                className="h-6 w-6 text-white"
              />
            </div>
            <div className="grid gap-y-1 text-sm text-gray-600">
              <p>{name}</p>
              <p className="line-clamp-1 opacity-50">
                {type.split("/")[1].toLocaleUpperCase()}
              </p>
            </div>
          </>
        )}
        <button
          onClick={onDeleteHandler}
          aria-label="ファイルの添付を解除"
          type="button"
          className="absolute -right-2 -top-2 hidden rounded-full bg-gray-600 hover:bg-gray-500 group-hover:block"
        >
          <XMarkIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}

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
    onClickFileHandler,
    fileRef,
    onFileChangeHandler,
    selectedFile,
    onDeleteHandler,
    isPendingPreview,
    onFocusHandler,
    isAuthLoading,
  } = useMessageForm();

  return (
    <form
      onSubmit={onSubmitHandler}
      className="fixed bottom-0 right-0 z-10 w-full  lg:pl-72"
    >
      <div className="flex flex-col items-center justify-center border-t bg-white p-4 ">
        <div className="mb-4 flex  w-full justify-between px-2.5">
          {!isAuthLoading &&
            Object.values(Categories).map((category) => {
              if (category === "Answer" && role === "Student") return null;
              if (
                role === "Teacher" &&
                (category === "Request" || category === "Question")
              )
                return null;

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
          <div className="h-max w-full">
            {selectedFile && (
              <FilePreview
                onDeleteHandler={onDeleteHandler}
                isPending={isPendingPreview}
                selectCategory={selectCategory}
                selectedFile={selectedFile}
              />
            )}
            <div className="relative">
              <button
                onClick={onClickFileHandler}
                type="button"
                aria-label="ファイルを添付"
                className={clsx(
                  "absolute left-2  top-3 h-5 w-5 rounded-full",
                  SubmitColor[selectCategory]
                )}
              >
                <input
                  aria-label="ファイルを添付"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.tsv,.rtf,.pages,.key,.numbers"
                  onChange={onFileChangeHandler}
                  ref={fileRef}
                  type="file"
                  className="sr-only"
                />
                <PlusIcon className="h-5 w-5 text-white" />
              </button>
              <TextareaAutosize
                onFocus={onFocusHandler}
                ref={ref}
                aria-label="コメントを入力"
                className={clsx(
                  "w-full resize-none appearance-none  px-4 py-2 pl-10 placeholder:pt-1 placeholder:text-xs disabled:border-red-500 disabled:bg-white disabled:opacity-50  disabled:ring-red-500",
                  BorderColors[selectCategory],
                  selectedFile
                    ? "rounded-md rounded-t-none border border-t-0 focus:ring-0"
                    : "rounded-md border"
                )}
                maxRows={4}
                onChange={(e) => setValue(e.currentTarget.value)}
                value={value}
                onBlur={onBlurHandler}
                placeholder={questionId ? "回答を入力" : "コメントを入力"}
              />
            </div>
          </div>
          <button
            aria-label={isPending ? "送信中" : "送信"}
            type="submit"
            disabled={isPending}
            className={clsx(
              "grid h-10 w-10 place-items-center rounded-full p-2  focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50",
              SubmitColor[selectCategory]
            )}
          >
            <PaperAirplaneIcon
              aria-hidden="true"
              className="h-6 w-6 text-white"
            />
          </button>
        </div>
        <p className="mt-4 hidden text-gray-600 sm:block">
          ルールを守って投稿してください。
        </p>
      </div>
    </form>
  );
}
