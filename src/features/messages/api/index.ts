import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";
import { Message } from "@/schema/db";

type GetMessages = {
  slug: string;
  created_at: string;
};

type InfiniteMessages = {
  pages: Message[][];
  pageParams: string[];
};

async function getQuestion({ question_id }: { question_id: number | null }) {
  if (!question_id) return undefined;

  const { data, error } = await supabase
    .from("messages")
    .select("id,content,type")
    .eq("id", question_id)
    .single();

  if (error) throw error;

  return data;
}

async function getMessages({ slug, created_at }: GetMessages) {
  const { data } = await supabase
    .from("messages")
    .select("*,profile:profiles(*)")
    .eq("course_id", slug)
    .lt("created_at", created_at)
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

      if (lastPage.length < 100) return undefined;

      const last = lastPage.at(-1);
      if (!last) return undefined;

      return last.created_at;
    },

    initialPageParam: new Date().toISOString(),
    enabled: !!user && !!slug,
  });
}

export function useQueryQuestion({
  question_id,
  course_id,
}: {
  question_id: number | null;
  course_id: string;
}) {
  const queryClient = useQueryClient();

  const question = question_id
    ? queryClient
        .getQueryData<InfiniteMessages>(["messages", course_id])
        ?.pages.flat()
        .find((q) => q.id === question_id)
    : undefined;

  const enabled = !!question_id && !!course_id && !question;

  return useQuery({
    queryKey: ["question", question_id],
    queryFn: () => getQuestion({ question_id }),
    placeholderData: () => {
      if (!question_id || !question) return undefined;
      return {
        id: question_id,
        content: question.content ?? "",
        type: question.type,
      };
    },
    enabled,
    gcTime: 0,
    staleTime: Infinity,
  });
}
