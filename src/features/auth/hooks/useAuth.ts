import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { showNotificationAtom } from "@/components/notification";
import { sessionAtom } from "@/context";
import supabase from "@/lib/supabse";

const useAuth = () => {
  const setSession = useSetAtom(sessionAtom);
  const onNotification = useSetAtom(showNotificationAtom);

  useEffect(() => {
    const { data: authData } = supabase.auth.onAuthStateChange((_, sessions) =>
      setSession(sessions)
    );

    return () => authData.subscription.unsubscribe();
  }, [setSession]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;

      onNotification({
        type: "success",
        title: "ログインしました",
      });
    } catch (e) {
      onNotification({
        type: "error",
        message: "追伸環境の良いところで再度お試しください。",
        title: "ログインできませんでした。",
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();

    onNotification({
      type: "success",
      title: "ログアウトしました",
    });
  };

  return {
    signInWithGoogle,
    signOut,
  };
};

export default useAuth;
