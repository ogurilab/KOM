import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";
import { showNotificationAtom } from "@/components/notification";
import { userAtom } from "@/context";
import supabase from "@/lib/supabse";
import { Categories, Message, MessageType } from "@/schema/db";

type InfiniteMessages = {
  pages: Message[][];
  pageParams: string[];
};

type Args = {
  content: string;
  course_id: string;
  created_at?: string;
  id?: number;
  profile_id: string;
  type?: MessageType;
  updated_at?: string;
};

const insertMessage = async (body: Args) => {
  const { data, error } = await supabase
    .from("messages")
    .insert(body)
    .select("*,profile:profiles(role)")
    .single();

  if (error) throw error;

  return data;
};

const useMutateMessage = () => {
  const queryClient = useQueryClient();
  const { query } = useRouter();

  return useMutation({
    mutationFn: insertMessage,
    onSuccess: (data) => {
      if (typeof query.slug !== "string") return;

      const prevData = queryClient.getQueryData<InfiniteMessages>([
        "messages",
        query.slug,
      ]);

      if (!prevData) return;

      const firstPage = prevData.pages[0];
      const mergeData = [data, ...firstPage];

      const newPage = prevData.pages.map((page, index) => {
        if (index === 0) return mergeData;
        return page;
      });

      queryClient.setQueryData<InfiniteMessages>(["messages", query.slug], {
        pageParams: prevData.pageParams,
        pages: newPage,
      });
    },
  });
};

export function useMessageForm() {
  const [selectCategory, setSelectCategory] = useState<MessageType>(
    Categories.Others
  );
  const [value, setValue] = useState("");
  const user = useAtomValue(userAtom);
  const { query } = useRouter();

  const onNotifications = useSetAtom(showNotificationAtom);

  const { mutateAsync, isPending } = useMutateMessage();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value || !user || typeof query.slug !== "string") return;

    try {
      await mutateAsync({
        content: value,
        course_id: query.slug,
        profile_id: user.data.id,
        type: selectCategory,
      });

      setValue("");
    } catch (error) {
      onNotifications({
        type: "error",
        title: "送信できませんでした。",
        message: "通信環境の良い場所で再度お試しください。",
      });
    }
  };

  return {
    selectCategory,
    setSelectCategory,
    value,
    setValue,
    onSubmitHandler,
    isPending,
  };
}
