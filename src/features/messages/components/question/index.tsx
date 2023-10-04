import React from "react";
import { CategoryBadge } from "@/components/categoryBadge";
import { Loader } from "@/components/loader";
import { useQueryQuestion } from "@/features/messages/api";
import { Message as TMessage } from "@/schema/db";

export function QuestionLoader() {
  return (
    <div className="max-w-xs rounded-md border-2 bg-white/80 px-2 py-6  outline outline-gray-300">
      <Loader variant="dots" className="mx-auto" />
    </div>
  );
}

export default function Question({
  question_id,
  course_id,
}: {
  question_id: TMessage["question_id"];
  course_id: TMessage["course_id"];
}) {
  const { data, isPending } = useQueryQuestion({
    question_id,
    course_id,
  });

  if (isPending) {
    return <QuestionLoader />;
  }

  return (
    <div className="w-max rounded-md border-2 bg-white/80  p-2 outline outline-gray-300">
      {data?.type && (
        <div className="mb-1">
          <CategoryBadge category={data.type} />
        </div>
      )}
      <p className="text-sm">{data?.content}</p>
    </div>
  );
}
