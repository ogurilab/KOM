import { useMutation } from "@tanstack/react-query";
import { RefObject, useRef, useState, useTransition } from "react";
import supabase from "@/lib/supabse";

async function insertFile({ id, file }: { id: string; file: File }) {
  const { data, error } = await supabase.storage
    .from("files")
    .upload(id, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  return data;
}

function useMutateFile() {
  return useMutation({
    mutationFn: insertFile,
  });
}

export function useFile({ ref }: { ref: RefObject<HTMLTextAreaElement> }) {
  const { mutateAsync, isPending } = useMutateFile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    preview: string | null;
  } | null>(null);
  const [isPendingPreview, startTransition] = useTransition();

  const onDeleteHandler = () => {
    setSelectedFile(null);
    if (!fileRef.current) return;
    fileRef.current.value = "";

    ref.current?.focus();
  };

  const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    startTransition(() => {
      setSelectedFile((p) => ({
        file,
        preview: p?.preview || null,
      }));
    });

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      startTransition(() => {
        setSelectedFile((p) => {
          if (!p) return null;

          return {
            ...p,
            preview: reader.result as string,
          };
        });
      });
    };

    ref.current?.focus();
  };

  const onClickFileHandler = () => {
    if (!fileRef.current) return;

    fileRef.current.click();
  };

  return {
    onClickFileHandler,
    fileRef,
    onFileChangeHandler,
    selectedFile,
    setSelectedFile,
    isPendingPreview,
    onDeleteHandler,
    mutateUpload: mutateAsync,
    isUploading: isPending,
  };
}
