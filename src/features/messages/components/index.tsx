import {
  ChevronDoubleDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useAtomValue, useSetAtom } from "jotai";
import React, { Suspense, memo } from "react";
import { CategoryBadge } from "@/components/categoryBadge";
import { Image } from "@/components/image";
import { Loader } from "@/components/loader";
import {
  messageInputRefAtom,
  questionAtom,
  selectedCategoryAtom,
  userAtom,
} from "@/context";
import { useQueryFile, useQueryQuestion } from "@/features/messages/api";
import { useMessages } from "@/features/messages/hooks";
import { useMessageSubscriptions } from "@/features/messages/hooks/subscriptions";
import { Message as TMessage } from "@/schema/db";

function getIsDifferentDay(targetDate: Date, prevMessageDate?: Date) {
  if (!prevMessageDate) return false;

  return (
    targetDate.getDate() !== prevMessageDate.getDate() ||
    targetDate.getMonth() !== prevMessageDate.getMonth() ||
    targetDate.getFullYear() !== prevMessageDate.getFullYear()
  );
}

function FileLoader() {
  return (
    <div className="grid h-40 w-36 place-items-center rounded-md border border-gray-300 bg-white/50 p-2 ">
      <Loader theme="primary" size="xl" />
    </div>
  );
}

function File({ path }: { path: string }) {
  const { data, isPending } = useQueryFile(path);

  if (isPending) {
    return <FileLoader />;
  }

  return (
    <div>
      {data?.isImage ? (
        <div>
          <Image
            isStyle={false}
            src={data.url}
            alt={data.url}
            className="max-h-80 max-w-full rounded-md object-cover"
          />
        </div>
      ) : (
        <a
          href={data?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-x-2 text-sm"
        >
          <div className="grid h-12 w-12 place-items-center rounded-md bg-blue-600 p-2 group-hover:bg-blue-500">
            <DocumentTextIcon
              aria-hidden="true"
              className="h-8 w-8 text-white"
            />
          </div>
          <div className="grid gap-y-1 text-sm text-gray-600">
            <span className="text-blue-600 hover:text-blue-500">
              {data?.type.split("/")[1].toLocaleUpperCase()}
            </span>
            <span>{data?.size}</span>
          </div>
        </a>
      )}
    </div>
  );
}

function DayIndicator({ date }: { date: Date }) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-dashed border-gray-900" />
      </div>
      <div className="relative flex justify-center">
        <div className="jus flex items-center gap-x-2 rounded-md bg-white px-4 py-1 ">
          <time
            dateTime={date.toISOString()}
            className="text-xs font-semibold text-gray-900"
          >
            {new Date(date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <ChevronDoubleDownIcon
            aria-hidden="true"
            className="h-4 w-4 text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}

const MemoMessage = memo(({ message }: { message: TMessage }) => {
  const { data, isPending } = useQueryQuestion({
    question_id: message.question_id,
    course_id: message.course_id,
  });

  const user = useAtomValue(userAtom);
  const canAnswer =
    user?.profile?.role === "Teacher" && message.role === "Student";
  const setQuestionId = useSetAtom(questionAtom);
  const messageInputRef = useAtomValue(messageInputRefAtom);

  const isAnswer = !!message.question_id;
  const setCategory = useSetAtom(selectedCategoryAtom);

  const onClickHandler = () => {
    setQuestionId(message.id);
    messageInputRef?.current?.focus();
    setCategory("Answer");
  };

  return (
    <div
      className={clsx(
        "flex w-full flex-col",
        message?.role === "Student" ? "items-end pl-20" : "items-start pr-20"
      )}
    >
      {message.type && (
        <div>
          <CategoryBadge category={message.type} />
        </div>
      )}

      <div className="my-4 grid gap-y-2 px-1">
        <p className="inline-block text-sm  md:text-base">{message.content}</p>
        {isAnswer && (
          <div className="rounded-md border-2 bg-white/80 p-2  outline outline-gray-300">
            {isPending ? (
              <div className="px-6">
                <Loader variant="dots" />
              </div>
            ) : (
              <>
                {data?.type && (
                  <div className="mb-1">
                    <CategoryBadge category={data.type} />
                  </div>
                )}
                <p className="text-sm">{data?.content}</p>
              </>
            )}
          </div>
        )}
        {message.file_path && (
          <Suspense fallback={<FileLoader />}>
            <File path={message.file_path} />
          </Suspense>
        )}
      </div>
      {canAnswer && (
        <button
          type="button"
          onClick={onClickHandler}
          className="text-sm text-blue-600 hover:text-blue-500 "
        >
          回答する
        </button>
      )}
    </div>
  );
});

export function Messages() {
  const { messages, ref, isFetchingNextPage, isPending } = useMessages();
  useMessageSubscriptions();

  if (isPending) {
    return (
      <Loader
        theme="primary"
        variant="dots"
        size="xl"
        className="mx-auto mt-40"
      />
    );
  }
  return (
    <div className="grid flex-1 gap-y-6">
      {messages?.map((message, index) => {
        const targetDate = new Date(message?.created_at || "");
        const prevMessage = messages[index - 1];

        const isDifferentDay = prevMessage
          ? getIsDifferentDay(targetDate, new Date(prevMessage?.created_at))
          : true;

        return (
          <div key={message?.id}>
            {isDifferentDay && <DayIndicator date={targetDate} />}
            <MemoMessage message={message} />
          </div>
        );
      })}
      {isFetchingNextPage && (
        <Loader theme="primary" variant="dots" size="xl" className="mx-auto" />
      )}
      <div className="h-4 w-full" ref={ref} />
    </div>
  );
}
