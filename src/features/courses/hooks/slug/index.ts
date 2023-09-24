import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";

const getCurse = async (slug: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("name")
    .eq("id", slug)
    .single();

  if (error) throw error;

  return data;
};

const useQueryCourse = (
  slug: string,
  user_id?: string,
  name?: string | string[]
) => {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCurse(slug),
    enabled: !!slug && !!user_id,
    placeholderData: () => {
      if (!name || typeof name !== "string") return undefined;
      return {
        name,
      };
    },
  });
};

export default function useCourse() {
  const {
    query: { slug, name },
  } = useRouter();

  const user = useAtomValue(userAtom);
  const { data, isLoading } = useQueryCourse(
    slug as string,
    user?.data.id,
    name
  );

  return { data, isLoading };
}
