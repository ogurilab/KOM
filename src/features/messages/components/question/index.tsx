import React, { Suspense, useState } from "react";
import { CategoryBadge } from "@/components/categoryBadge";
import { Loader } from "@/components/loader";
import { File, FileLoader } from "@/features/files/components";
import { useQueryQuestion } from "@/features/messages/api";
import { AnswerModal } from "@/features/messages/components/answer";
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
  const [isOpen, setIsOpen] = useState(false);

  if (isPending) {
    return <QuestionLoader />;
  }

  return (
    <div className="max-w-max rounded-md border-2 bg-white/80  p-2 outline outline-gray-300">
      <div>
        {data?.type && (
          <div className="mb-1 flex justify-between gap-x-4">
            <CategoryBadge category={data.type} />
            {data.has_response && (
              <>
                <button
                  onClick={() => setIsOpen(true)}
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500"
                >
                  回答を全て見る
                </button>
                <AnswerModal
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  type={data?.type}
                  course_id={course_id}
                  content={data?.content}
                  id={data?.id}
                />
              </>
            )}
          </div>
        )}
      </div>
      <p className="text-sm">{data?.content}</p>
      {data?.file_path && (
        <Suspense fallback={<FileLoader />}>
          <div className="mt-4">
            <File path={data?.file_path} />
          </div>
        </Suspense>
      )}
    </div>
  );
}
