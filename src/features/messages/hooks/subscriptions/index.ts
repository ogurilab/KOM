import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { qAndAAtom, userAtom } from "@/context";
import supabase from "@/lib/supabse";
import { Message } from "@/schema/db";

type InfiniteMessages = {
  pages: Message[][];
  pageParams: string[];
};

export function useMessageSubscriptions() {
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const { query } = useRouter();
  const isQAndA = useAtomValue(qAndAAtom);

  useEffect(() => {
    if (!user) return () => {};

    const messages = supabase
      .channel("custom-insert-channel")
      .on<Message>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `profile_id=neq.${user.profile?.id}`,
        },
        (payload) => {
          const data = payload.new;
          const prevData = queryClient.getQueryData<InfiniteMessages>([
            "messages",
            query.slug,
            isQAndA,
          ]);

          if (!prevData) return;

          const isAnswer = data.question_id !== null;

          const newPage: Message[][] = prevData.pages.map((page, index) => {
            if (index === 0 && !isAnswer) return [data, ...page];

            const changedQuestionData: Message[] = page.map((message) => {
              if (message.id !== data.question_id) return message;

              return {
                ...message,
                has_response: true,
              };
            });

            return [data, ...changedQuestionData];
          });

          queryClient.setQueryData<InfiniteMessages>(
            ["messages", query.slug, isQAndA],
            {
              pageParams: prevData.pageParams,
              pages: newPage,
            }
          );
        }
      )
      .subscribe();

    return () => {
      messages.unsubscribe();
    };
  }, [isQAndA, query.slug, queryClient, user]);
}
