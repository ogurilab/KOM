import { useSetAtom } from "jotai";
import { showNotificationAtom } from "@/components/notification";
import supabase from "@/lib/supabse";

export function useGoogle() {
  const onNotification = useSetAtom(showNotificationAtom);
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "/" },
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
}