import { AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect } from "react";
import supabase from "@/lib/supabse";

const useEventListener = () => {
  const { push } = useRouter();

  const onEventHandlers = (event: AuthChangeEvent) => {
    switch (event) {
      case "SIGNED_OUT":
        push("/auth");
        break;
      default:
    }
  };

  return { onEventHandlers };
};

export function AuthProvider() {
  const { onEventHandlers } = useEventListener();
  const { push, pathname } = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, sessions) => {
      if (!sessions && pathname !== "/auth") push("/auth");

      onEventHandlers(event);
    });

    return () => data.subscription.unsubscribe();
  }, [onEventHandlers, pathname, push]);

  return null;
}
