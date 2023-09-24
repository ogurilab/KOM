import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { userAtom } from "@/context";
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
          const prevData = queryClient.getQueryData<InfiniteMessages>([
            "messages",
            query.slug,
          ]);

          if (!prevData) return;

          const firstPage = prevData.pages[0];
          const mergeData = [payload.new, ...firstPage];

          const newPage = prevData.pages.map((page, index) => {
            if (index === 0) return mergeData;
            return page;
          });

          queryClient.setQueryData<InfiniteMessages>(["messages", query.slug], {
            pageParams: prevData.pageParams,
            pages: newPage,
          });
        }
      )
      .subscribe();

    return () => {
      messages.unsubscribe();
    };
  }, [query.slug, queryClient, user]);
}
