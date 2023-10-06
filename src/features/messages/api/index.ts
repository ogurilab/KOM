import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { qAndAAtom, userAtom } from "@/context";
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
    .select("id,content,type,file_path")
    .eq("id", question_id)
    .single();

  if (error) throw error;

  return data;
}

async function getMessages({ slug, created_at, only_q_and_a }: GetMessages) {
  const AllCategories = [
    Categories.Question,
    Categories.Others,
    Categories.ChitChat,
    Categories.Request,
    Categories.Contact,
    Categories.Answer,
  ];

  const filteredCategories = [
    Categories.Question,
    Categories.Request,
    Categories.Answer,
  ];

  const { data } = await supabase
    .from("messages")
    .select("*,profile:profiles(*)")
    .eq("course_id", slug)
    .lt("created_at", created_at)
    .in("type", only_q_and_a ? filteredCategories : AllCategories)
    .order("created_at", { ascending: false })
    .limit(100);

  return data;
}

export function useQueryMessages(slug: string, only_q_and_a: boolean) {
  const user = useAtomValue(userAtom);

  return useInfiniteQuery({
    queryKey: ["messages", slug, only_q_and_a],
    queryFn: ({ pageParam }) =>
      getMessages({
        slug,
        created_at: pageParam,
        only_q_and_a,
      }),

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
        .getQueryData<InfiniteMessages>(["messages", course_id, false])
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
        file_path: question.file_path,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 30,
  });
}

async function getAnswer({ id }: { id: number | null }) {
  if (!id) return undefined;

  const { data, error } = await supabase
    .from("messages")
    .select("id,content,type,created_at,role")
    .eq("question_id", id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export function useQueryAnswer({
  id,
  open,
  course_id,
  is_only_teacher,
}: {
  id: number;
  open: boolean;
  course_id: string;
  is_only_teacher: boolean;
}) {
  const queryClient = useQueryClient();
  const isQAndA = useAtomValue(qAndAAtom);

  const placeholderAnswers = queryClient
    .getQueryData<InfiniteMessages>(["messages", course_id, isQAndA])
    ?.pages.flat()
    .filter((q) => q.question_id === id);

  const enabled = !!id && open;

  return useQuery({
    queryKey: ["answer", id],
    queryFn: () => getAnswer({ id }),
    enabled,
    placeholderData: () => {
      if (!placeholderAnswers) return undefined;

      return placeholderAnswers.map((answer) => ({
        id: answer.id,
        content: answer.content ?? "",
        type: answer.type,
        created_at: answer.created_at,
        role: answer.role,
      }));
    },
    select: (data) => {
      if (!data) return undefined;

      return data.filter((answer) => {
        if (is_only_teacher) return answer.role === "Teacher";
        return true;
      });
    },
    staleTime: 1000 * 60 * 30,
  });
}
