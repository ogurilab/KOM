import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";
import { Categories, Message } from "@/schema/db";

type GetMessages = {
  slug: string;
  created_at: string;
  only_q_and_a: boolean;
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

async function getMessages({ slug, created_at, only_q_and_a }: GetMessages) {
  const { data } = await supabase
    .from("messages")
    .select("*,profile:profiles(*)")
    .eq("course_id", slug)
    .lt("created_at", created_at)
    .in("type", [
      Categories.Question,
      ...(only_q_and_a
        ? [Categories.Answer]
        : [
            Categories.Answer,
            Categories.Others,
            Categories.ChitChat,
            Categories.Request,
            Categories.Contact,
          ]),
    ])
    .order("created_at", { ascending: false })
    .limit(100);

  return data;
}

export function useQueryMessages(slug: string, only_q_and_a: boolean) {
  const user = useAtomValue(userAtom);

  return useInfiniteQuery({
    queryKey: ["messages", slug, only_q_and_a],
    queryFn: ({ pageParam }) =>
      getMessages({ slug, created_at: pageParam, only_q_and_a }),

    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;

      if (lastPage.length < 100) return undefined;

      const last = lastPage.at(-1);
      if (!last) return undefined;

      return last.created_at;
    },

    initialPageParam: new Date().toISOString(),
    enabled: !!user && !!slug,
    gcTime: 0,
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

async function getFiles(file_path: string | null) {
  if (!file_path) return undefined;

  const { data, error } = await supabase.storage
    .from("files")
    .download(file_path);

  if (error) throw error;

  if (!data) return undefined;

  const isImage = data.type.startsWith("image");
  const sizeText = data.size > 1024 * 1024 ? "MB" : "KB";

  return {
    url: URL.createObjectURL(data),
    isImage,
    type: data.type,
    size: `${(data.size / 1024 / 1024).toFixed(2)} ${sizeText}`,
  };
}

export function useQueryFile(file_path: string | null) {
  return useQuery({
    queryKey: ["file", file_path],
    queryFn: () => getFiles(file_path),
    enabled: !!file_path,
  });
}
