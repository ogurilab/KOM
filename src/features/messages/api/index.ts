import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";

type GetMessages = {
  slug: string;
  created_at: string;
};

async function getMessages({ slug, created_at }: GetMessages) {
  const { data } = await supabase
    .from("messages")
    .select("*,profile:profiles(*)")
    .eq("course_id", slug)
    .lte("created_at", created_at)
    .order("created_at", { ascending: false })
    .limit(100);

  return data;
}

export function useQueryMessages(slug: string) {
  const user = useAtomValue(userAtom);

  return useInfiniteQuery({
    queryKey: ["messages", slug],
    queryFn: ({ pageParam }) => getMessages({ slug, created_at: pageParam }),

    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;

      const last = lastPage.at(-1);
      if (!last) return undefined;

      return last.created_at;
    },

    initialPageParam: new Date().toISOString(),
    enabled: !!user && !!slug,
  });
}
