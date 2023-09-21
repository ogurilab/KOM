import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";

const getProfile = async (id: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return data;
};

const useEventListener = () => {
  const { push, pathname } = useRouter();
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);

  const signInHandler = useCallback(
    async (session: Session) => {
      const { user } = session;

      if (pathname === "/profiles/create") return;

      const data = await queryClient.fetchQuery({
        queryKey: ["profile", user.id],
        queryFn: () => getProfile(user.id),
        staleTime: Infinity,
        gcTime: Infinity,
      });

      if (!data) {
        push("/profiles/create");
        return;
      }

      setUser({
        ...user,
        ...data,
      });

      if (pathname === "/auth") push("/");
    },
    [pathname, push, queryClient, setUser]
  );

  const signOutHandler = useCallback(() => {
    queryClient.clear();
    push("/auth");
  }, [push, queryClient]);

  const onEventHandlers = (event: AuthChangeEvent, session: Session) => {
    switch (event) {
      case "SIGNED_OUT":
        signOutHandler();
        break;
      case "SIGNED_IN":
        signInHandler(session);
        break;

      case "INITIAL_SESSION":
        signInHandler(session);
        break;

      default:
        break;
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

      if (sessions) onEventHandlers(event, sessions);
    });

    return () => data.subscription.unsubscribe();
  }, [onEventHandlers, pathname, push]);

  return null;
}
