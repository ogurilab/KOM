import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";
import { Course } from "@/schema/db";

const getCourses = async (id?: string) => {
  if (!id) throw new Error("User id is required");

  const { data } = await supabase
    .from("course_members")
    .select("courses (*)")
    .eq("profile_id", id);

  return data;
};

export function useCourses() {
  const user = useAtomValue(userAtom);

  return useQuery({
    queryKey: ["courses", user?.id],
    queryFn: () => getCourses(user?.id),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data) => {
      const courses = data?.map((item) => item.courses);
      if (!courses) return null;

      const sortedByDayOfWeek: Course[][] = Array.from(
        { length: 7 },
        (_, index) => {
          return courses.filter(
            (course) => course?.day_of_week === index
          ) as Course[];
        }
      );

      return sortedByDayOfWeek;
    },
    enabled: !!user,
  });
}
