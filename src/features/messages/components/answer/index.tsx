import React, { Suspense } from "react";
import { CategoryBadge } from "@/components/categoryBadge";
import { Loader } from "@/components/loader";
import { Modal } from "@/components/modal";
import { useQueryAnswer } from "@/features/messages/api";
import { Message as TMessage } from "@/schema/db";

type Props = {
  open: boolean;
  onClose: () => void;
  id: TMessage["id"];
  content: TMessage["content"];
  type: TMessage["type"];
  course_id: TMessage["course_id"];
};

function AnswerModalLoader({
  content,
  type,
  onClose,
}: {
  content: Props["content"];
  type: Props["type"];
  onClose: Props["onClose"];
}) {
  return (
    <div>
      <Modal.Title as="div" className="items-start justify-center">
        <CategoryBadge category={type ?? "Question"} />
        <p className="mt-2 flex-1">
          <span>{content}</span>
        </p>
      </Modal.Title>
      <Modal.Description as="div">
        <Loader variant="dots" size="xl" className="mx-auto my-10" />
      </Modal.Description>
      <div className="mt-6 flex justify-end">
        <Modal.CloseButton
          className="bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
          onClose={onClose}
        >
          閉じる
        </Modal.CloseButton>
      </div>
    </div>
  );
}

function Answer({
  content,
  created_at,
  id,
}: {
  content: TMessage["content"];
  created_at: TMessage["created_at"];
  id: TMessage["id"];
}) {
  return (
    <div key={id} className="flex flex-col">
      <p className="flex-1 font-medium leading-7 text-gray-900">{content}</p>
      <time
        dateTime={new Date(created_at).toISOString()}
        className="ml-auto text-xs text-gray-600"
      >
        {new Date(created_at).toLocaleDateString("ja-JP", {
          month: "long",
          day: "numeric",
          timeZone: "Asia/Tokyo",
        })}
        に回答
      </time>
    </div>
  );
}

function AnswerModalContent({
  id,
  open,
  onClose,
  content,
  type,
  course_id,
}: Props) {
  const { data, isPending } = useQueryAnswer({ id, open, course_id });

  if (isPending) {
    return (
      <AnswerModalLoader onClose={onClose} type={type} content={content} />
    );
  }

  return (
    <div>
      <Modal.Title as="div" className="items-start justify-center">
        <CategoryBadge category={type ?? "Question"} />
        <p className="mt-2 flex-1">
          <span>{content}</span>
        </p>
      </Modal.Title>
      <Modal.Description as="div" className="my-4">
        <p className="mb-2 font-semibold text-blue-600">回答一覧</p>
        <div className="grid max-h-48 gap-y-6 overflow-y-auto">
          {data?.map((answer) => (
            <Answer
              key={answer?.id}
              content={answer?.content}
              created_at={answer?.created_at}
              id={answer?.id}
            />
          ))}
        </div>
      </Modal.Description>
      <div className="flex justify-end">
        <Modal.CloseButton
          className="bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
          onClose={onClose}
        >
          閉じる
        </Modal.CloseButton>
      </div>
    </div>
  );
}

export function AnswerModal({
  open,
  onClose,
  id,
  content,
  type,
  course_id,
}: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <Suspense
        fallback={
          <AnswerModalLoader onClose={onClose} type={type} content={content} />
        }
      >
        <AnswerModalContent
          course_id={course_id}
          type={type}
          content={content}
          id={id}
          open={open}
          onClose={onClose}
        />
      </Suspense>
    </Modal>
  );
}
