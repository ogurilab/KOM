import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import {
  messageInputRefAtom,
  qAndAAtom,
  questionAtom,
  selectedCategoryAtom,
  userAtom,
} from "@/context";
import { useQueryMessages, useQueryQuestion } from "@/features/messages/api";
import { Message as TMessage } from "@/schema/db";

export function useMessage({
  id,
  role,
  type,
  has_response,
  question_id,
  course_id,
}: {
  id: TMessage["id"];
  role: TMessage["role"];
  type: TMessage["type"];
  has_response: TMessage["has_response"];
  question_id: TMessage["question_id"];
  course_id: TMessage["course_id"];
}) {
  const { data, isPending } = useQueryQuestion({
    question_id,
    course_id,
  });

  const user = useAtomValue(userAtom);
  const messageInputRef = useAtomValue(messageInputRefAtom);
  const setQuestionId = useSetAtom(questionAtom);
  const setCategory = useSetAtom(selectedCategoryAtom);

  const onClickHandler = () => {
    setQuestionId(id);
    messageInputRef?.current?.focus();
    setCategory("Answer");
  };

  const canAnswer =
    user?.profile?.role === "Teacher" &&
    role === "Student" &&
    (type === "Question" || type === "Request");

  return {
    isPending,
    canAnswer,
    data,
    isAnswer: !!question_id,
    hasAnswer: has_response,
    onClickHandler,
  };
}

export function useMessages() {
  const { query } = useRouter();
  const isQAndA = useAtomValue(qAndAAtom);
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryMessages(query.slug as string, isQAndA);

  const { ref } = useInView({
    onChange: (inView) => {
      if (!inView) return;

      if (isPending || !hasNextPage) return;

      fetchNextPage();
    },
  });

  const messages = useMemo(() => {
    if (isPending) return [];

    const pages = data?.pages.flatMap((page) => {
      if (!page) return [];

      return page;
    });

    if (!pages) return [];

    return pages;
  }, [data?.pages, isPending]);

  return {
    isFetchingNextPage,
    messages,
    isPending,
    ref,
  };
}
