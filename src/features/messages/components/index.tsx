import clsx from "clsx";
import React from "react";
import { CategoryBadge } from "@/components/categoryBadge";
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

function DayIndicator({ date }: { date: Date }) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-dashed border-gray-900" />
      </div>
      <div className="relative flex justify-center">
        <time
          dateTime={date.toISOString()}
          className="rounded-md bg-white px-6 text-xs font-semibold text-gray-900"
        >
          {new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
    </div>
  );
}

function Message({ message }: { message: TMessage }) {
  return (
    <div
      className={clsx(
        "flex flex-col",
        message?.role === "Student" ? "items-end pl-20" : "items-start pr-20"
      )}
    >
      {message.type && (
        <div>
          <CategoryBadge category={message.type} />
        </div>
      )}
      <p className="inline-block border-b border-b-gray-900 px-2 py-1 text-sm md:px-4 md:py-2 md:text-base">
        {message.content}
      </p>
    </div>
  );
}

export function Messages() {
  const { messages, ref } = useMessages();
  useMessageSubscriptions();

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
            <Message message={message} />
          </div>
        );
      })}
      <div className="h-4 w-full" ref={ref} />
    </div>
  );
}
