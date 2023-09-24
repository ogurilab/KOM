import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { showNotificationAtom } from "@/components/notification";
import supabase from "@/lib/supabse";

export function useForm() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const onNotification = useSetAtom(showNotificationAtom);
  const { push } = useRouter();

  const onChangeHandler =
    (target: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [target]: e.target.value }));
    };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = values;
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        onNotification({
          type: "success",
          title: "新規登録が完了しました。",
          message:
            "確認メールを送信しましたので、メール内のリンクをクリックしてください。",
          isPersistent: true,
        });

        push("/profiles/create");

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      push("/");
      onNotification({
        type: "success",
        title: "ログインしました。",
      });
    } catch (error) {
      onNotification({
        type: "error",
        title: `${isRegister ? "新規登録" : "ログイン"}できませんでした。`,
        message: `${
          isRegister
            ? "再度お試しください。"
            : "メールアドレスまたはパスワードが間違っています。"
        }`,
      });
    }
  };

  return {
    values,
    onChangeHandler,
    onSubmitHandler,
    isRegister,
    setIsRegister,
  };
}
