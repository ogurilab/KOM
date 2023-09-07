import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null); // ログイン状態を管理
  const [error, setError] = useState(""); // エラー状況を管理

  useEffect(() => {
    // ログイン状態の変化を監視
    const { data: authData } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    // リスナーの解除
    return () => authData.subscription.unsubscribe();
  }, []);

  // Googleでサインイン
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        setError(error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        console.error("Googleとの連携に失敗しました。");
      }
    }
  };

  // ログインユーザーのプロフィール取得: Google
  const profileFromGoogle: {
    nickName: string;
    avatarUrl: string;
  } = {
    nickName: session?.user?.user_metadata.user_name,
    avatarUrl: session?.user?.user_metadata.avatar_url,
  };

  // サインアウト
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    session,
    error,
    profileFromGoogle,
    signInWithGoogle,
    signOut,
  };
};

export default useAuth;
