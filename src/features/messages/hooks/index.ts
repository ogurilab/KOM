import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  messageInputRefAtom,
  qAndAAtom,
  questionAtom,
  selectedCategoryAtom,
} from "@/context";
import { useQueryMessages } from "@/features/messages/api";
import { Message as TMessage } from "@/schema/db";

export function useMessage({
  id,
  role,
  type,
  has_response,
  question_id,
}: {
  id: TMessage["id"];
  role: TMessage["role"];
  type: TMessage["type"];
  has_response: TMessage["has_response"];
  question_id: TMessage["question_id"];
}) {
  const messageInputRef = useAtomValue(messageInputRefAtom);
  const setQuestionId = useSetAtom(questionAtom);
  const setCategory = useSetAtom(selectedCategoryAtom);

  const [answerModalIsOpen, setAnswerModalIsOpen] = useState(false);

  const onClickHandler = () => {
    setQuestionId(id);
    messageInputRef?.current?.focus();
    setCategory("Answer");
  };

  const canAnswer =
    role === "Student" && (type === "Question" || type === "Request");

  return {
    canAnswer,
    isAnswer: !!question_id,
    hasAnswer: has_response,
    onClickHandler,
    answerModalIsOpen,
    setAnswerModalIsOpen,
  };
}

export function useMessages() {
  const { query } = useRouter();
  const isQAndA = useAtomValue(qAndAAtom);
  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = useQueryMessages(query.slug as string, isQAndA);

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
    isPlaceholderData,
  };
}
