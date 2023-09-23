import React, { useState } from "react";
import supabase from "@/lib/supabse";

export function useForm() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler =
    (target: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [target]: e.target.value }));
    };

  /*  //TODO ここの実装をおねがいします */

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = values;

    // (サインアップ最初)
    supabase.auth.signUp({ email, password });
    // (サインイン通常)
    supabase.auth.signInWithPassword({ email, password });

    // supabaseにログインする処理
  };

  return {
    values,
    onChangeHandler,
    onSubmitHandler,
  };
}
