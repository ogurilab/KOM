import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";
import { Course } from "@/schema/db";

const getCourses = async (id?: string) => {
  if (!id) throw new Error("User id is required");

  const { data, error } = await supabase
    .from("course_members")
    .select("courses (name,id,day_of_week,class_code)")
    .eq("profile_id", id);

  if (error) throw error;

  return data;
};

const deleteCourse = async ({ id }: { id: string }) => {
  const { error } = await supabase
    .from("course_members")
    .delete()
    .eq("course_id", id);

  if (error) throw error;

  return id;
};

export function useDeleteCourse() {
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: (data, { id }) => {
      const prevData = queryClient.getQueryData<
        {
          courses: Course;
        }[]
      >(["courses", user?.data.id]);

      if (!prevData || !data) return;

      queryClient.setQueryData<
        {
          courses: Course;
        }[]
      >(
        ["courses", user?.data.id],
        prevData.filter((item) => item.courses.id !== id)
      );
    },
  });
}

export function useCourses() {
  const user = useAtomValue(userAtom);

  return useQuery({
    queryKey: ["courses", user?.data.id],
    queryFn: () => getCourses(user?.data.id),
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
