import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import React, { Suspense, memo } from "react";
import { CategoryBadge } from "@/components/categoryBadge";
import { DayIndicator, getIsDifferentDay } from "@/components/dayIndicator";
import { Image } from "@/components/image";
import { Loader } from "@/components/loader";

import { File, FileLoader } from "@/features/files/components";
import { useMessage, useMessages } from "@/features/messages/hooks";
import { useMessageSubscriptions } from "@/features/messages/hooks/subscriptions";
import { Message as TMessage } from "@/schema/db";

const MemoMessage = memo(({ message }: { message: TMessage }) => {
  const {
    content,
    type,
    file_path,
    has_response,
    role,
    id,
    course_id,
    question_id,
  } = message;

  const { data, isPending, onClickHandler, canAnswer, isAnswer, hasAnswer } =
    useMessage({
      id,
      role,
      type,
      course_id,
      question_id,
      has_response,
    });

  return (
    <div className="flex gap-x-2">
      {role === "Teacher" && (
        <Image
          src="/teacher.png"
          className="h-10 w-10 rounded-full"
          alt="teacher"
          isStyle={false}
        />
      )}
      <div
        className={clsx(
          "flex w-full flex-1 flex-col",
          role === "Student" ? "items-end pl-20" : "items-start pr-20"
        )}
      >
        {type && (
          <div>
            <CategoryBadge category={type} />
            {hasAnswer && (
              <CheckBadgeIcon
                className="ml-1 inline-block h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            )}
          </div>
        )}

        <div className="my-4 grid gap-y-2 px-1">
          <p className="inline-block text-sm  md:text-base">{content}</p>
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

          {file_path && (
            <Suspense fallback={<FileLoader />}>
              <File path={file_path} />
            </Suspense>
          )}
        </div>
        {/* eslint-disable-next-line no-nested-ternary */}
        {canAnswer ? (
          <button
            type="button"
            onClick={onClickHandler}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500"
          >
            {has_response ? "再度回答" : "回答する"}
          </button>
        ) : has_response ? (
          <button
            type="button"
            className="text-xs font-semibold text-blue-600 hover:text-blue-500"
          >
            回答を見る
          </button>
        ) : null}
      </div>
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
