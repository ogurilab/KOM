import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";

export function getIsDifferentDay(targetDate: Date, prevMessageDate?: Date) {
  if (!prevMessageDate) return false;

  return (
    targetDate.getDate() !== prevMessageDate.getDate() ||
    targetDate.getMonth() !== prevMessageDate.getMonth() ||
    targetDate.getFullYear() !== prevMessageDate.getFullYear()
  );
}

export function DayIndicator({ date }: { date: Date }) {
  const today = new Date();
  const someDate = new Date(date); // dateは比較対象の日付

  const isToday =
    today.getDate() === someDate.getDate() &&
    today.getMonth() === someDate.getMonth() &&
    today.getFullYear() === someDate.getFullYear();

  const isYesterday =
    today.getDate() - 1 === someDate.getDate() &&
    today.getMonth() === someDate.getMonth() &&
    today.getFullYear() === someDate.getFullYear();

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
            {/* eslint-disable-next-line no-nested-ternary */}
            {isToday
              ? "今日"
              : isYesterday
              ? "昨日"
              : new Date(date).toLocaleDateString("ja-JP", {
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
