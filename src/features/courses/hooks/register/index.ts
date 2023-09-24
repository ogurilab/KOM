import { useMutation, useQueryClient } from "@tanstack/react-query";
import CryptoJS from "crypto-js";
import { useAtomValue } from "jotai";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";
import { Course } from "@/schema/db";

type Args = {
  profile_id: string;
  password: string;
  class_code: string;
};

async function insertCourseMember({ profile_id, password, class_code }: Args) {
  const { data: course, error: cE } = await supabase
    .from("courses")
    .select("class_password, id")
    .eq("class_code", class_code)
    .single();

  const hashedInput = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

  // ハッシュを比較
  if (course?.class_password !== hashedInput) {
    throw new Error("パスワードまたは、クラスコードが違います。");
  }

  if (cE) throw cE;

  const { data, error } = await supabase
    .from("course_members")
    .insert({
      profile_id,
      course_id: course.id,
    })
    .select("courses (*)")
    .single();

  if (error) throw error;

  return data;
}

export function useRegisterCourse() {
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: insertCourseMember,
    onSuccess: ({ courses }) => {
      const prevData = queryClient.getQueryData<
        {
          courses: Course;
        }[]
      >(["courses", user?.data.id]);

      if (!prevData || !courses) return;

      queryClient.setQueryData<
        {
          courses: Course;
        }[]
      >(
        ["courses", user?.data.id],
        [
          ...prevData,
          {
            courses,
          },
        ]
      );
    },
  });
}
