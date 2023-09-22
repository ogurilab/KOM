import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQueryMessages } from "@/features/messages/api";

export function useMessages() {
  const { query } = useRouter();
  const { data, isPending } = useQueryMessages(query.id as string);

  const messages = useMemo(() => {
    if (isPending) return [];

    const reversed = data?.pages.flatMap((page) => {
      if (!page) return [];
      return [...page].reverse();
    });

    return reversed;
  }, [data?.pages, isPending]);

  return {
    messages,
  };
}
