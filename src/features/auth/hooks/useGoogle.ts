import { useSetAtom } from "jotai";
import { showNotificationAtom } from "@/components/notification";
import supabase from "@/lib/supabse";

export function useGoogle() {
  const onNotification = useSetAtom(showNotificationAtom);
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
    } catch (e) {
      onNotification({
        type: "error",
        message: "通信環境の良いところで再度お試しください。",
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
}
