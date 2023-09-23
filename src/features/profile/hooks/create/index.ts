import { useMutation } from "@tanstack/react-query";
import supabase from "@/lib/supabse";
import { RoleType } from "@/schema/db";

type Args = {
  role: RoleType;
  id: string;
};
export async function insertProfile({ role, id }: Args) {
  const { data, error } = await supabase.from("profiles").insert({
    role,
    id,
  });

  if (error) throw error;

  return data;
}

export function useCreateProfile() {
  return useMutation({
    mutationFn: insertProfile,
  });
}
