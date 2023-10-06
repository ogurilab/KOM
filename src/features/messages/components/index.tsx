import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import React, { Suspense, memo } from "react";
import { CategoryBadge } from "@/components/categoryBadge";
import { DayIndicator, getIsDifferentDay } from "@/components/dayIndicator";
import { Image } from "@/components/image";
import { Loader } from "@/components/loader";

import { File, FileLoader } from "@/features/files/components";
import { AnswerModal } from "@/features/messages/components/answer";
import Question, {
  QuestionLoader,
} from "@/features/messages/components/question";
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

  const {
    onClickHandler,
    canAnswer,
    isAnswer,
    hasAnswer,
    answerModalIsOpen,
    setAnswerModalIsOpen,
  } = useMessage({
    id,
    role,
    type,
    question_id,
    has_response,
  });

  return (
    <div className=" flex gap-x-2">
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
            <Suspense fallback={<QuestionLoader />}>
              <Question question_id={question_id} course_id={course_id} />
            </Suspense>
          )}

          {file_path && (
            <Suspense fallback={<FileLoader />}>
              <File path={file_path} />
            </Suspense>
          )}
        </div>
        {/* eslint-disable-next-line no-nested-ternary */}
        {canAnswer && (
          <button
            type="button"
            onClick={onClickHandler}
            className="text-xs font-semibold text-purple-600 hover:text-purple-500"
          >
            {has_response ? "再度回答" : "回答する"}
          </button>
        )}
        {has_response && (
          <>
            <button
              onClick={() => setAnswerModalIsOpen(true)}
              type="button"
              className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-500"
            >
              回答を見る
            </button>

            <AnswerModal
              course_id={course_id}
              type={type}
              content={content}
              id={id}
              key={id}
              open={answerModalIsOpen}
              onClose={() => setAnswerModalIsOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
});

export function Messages() {
  const { messages, ref, isFetchingNextPage, isPending, isPlaceholderData } =
    useMessages();
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

  const hasMessages = messages?.length > 0;

  return (
    <div className="grid flex-1 gap-y-6">
      {isPlaceholderData && hasMessages && (
        <div
          aria-hidden="true"
          className="absolute inset-0 isolate z-10 animate-pulse rounded-lg bg-white/60"
        />
      )}
      {hasMessages ? (
        messages?.map((message, index) => {
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
        })
      ) : (
        <div className="mt-40 text-center text-gray-400">
          メッセージはありません
        </div>
      )}
      {isFetchingNextPage && (
        <Loader theme="primary" variant="dots" size="xl" className="mx-auto" />
      )}
      <div className="h-4 w-full" ref={ref} />
    </div>
  );
}
