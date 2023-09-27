import { useRouter } from "next/router";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryMessages } from "@/features/messages/api";

export function useMessages() {
  const { query } = useRouter();
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryMessages(query.slug as string);

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
