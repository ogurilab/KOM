import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { showNotificationAtom } from "@/components/notification";
import {
  messageInputRefAtom,
  questionAtom,
  selectedCategoryAtom,
  userAtom,
} from "@/context";
import { useFile } from "@/features/messages/hooks/files";
import supabase from "@/lib/supabse";
import { Categories, Message, MessageType, RoleType } from "@/schema/db";

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
  role: RoleType;
  question_id: number | null;
  file_path: string | null;
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
  const [selectCategory, setSelectCategory] = useAtom(selectedCategoryAtom);

  const [value, setValue] = useState("");
  const user = useAtomValue(userAtom);
  const { query } = useRouter();
  const [questionId, setQuestionId] = useAtom(questionAtom);
  const [messageRef, setMessageInputRef] = useAtom(messageInputRefAtom);
  const ref = useRef<HTMLTextAreaElement>(null);
  if (messageRef === null && ref.current !== null) {
    setMessageInputRef(ref);
  }

  const {
    onClickFileHandler,
    fileRef,
    onFileChangeHandler,
    selectedFile,
    onDeleteHandler,
    isPendingPreview,
    isUploading,
    mutateUpload,
    setSelectedFile,
  } = useFile({ ref });

  const onNotifications = useSetAtom(showNotificationAtom);

  const { mutateAsync, isPending } = useMutateMessage();

  const onBlurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const isSelectedFileButton =
      relatedTarget &&
      relatedTarget.parentElement === e.currentTarget.parentElement;

    if (questionId && !value && !isSelectedFileButton && !selectedFile) {
      setQuestionId(null);
      setSelectCategory(Categories.Others);
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      (!value && !selectedFile?.file) ||
      !user ||
      typeof query.slug !== "string"
    )
      return;

    if (!user.profile?.role) return;

    try {
      let file_path = null;
      if (selectedFile?.file) {
        const { path } = await mutateUpload({
          file: selectedFile?.file,
          id: nanoid(),
        });

        file_path = path;
      }

      await mutateAsync({
        content: value,
        course_id: query.slug,
        profile_id: user.data.id,
        type: selectCategory,
        role: user.profile?.role,
        question_id: questionId,
        file_path,
      });

      setValue("");
      setQuestionId(null);
      setSelectCategory(Categories.Others);
      setSelectedFile(null);
      if (!fileRef.current) return;
      fileRef.current.value = "";
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
    isPending: isPending || isUploading,
    role: user?.profile?.role,
    messageRef,
    setMessageInputRef,
    ref,
    questionId,
    onBlurHandler,
    onClickFileHandler,
    fileRef,
    onFileChangeHandler,
    selectedFile,
    onDeleteHandler,
    isPendingPreview,
  };
}
