import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabse";

async function getFiles(file_path: string | null) {
  if (!file_path) return undefined;

  const { data, error } = await supabase.storage
    .from("files")
    .download(file_path);

  if (error) throw error;

  if (!data) return undefined;

  const isImage = data.type.startsWith("image");
  const sizeText = data.size > 1024 * 1024 ? "MB" : "KB";

  return {
    url: URL.createObjectURL(data),
    isImage,
    type: data.type,
    size: `${(data.size / 1024 / 1024).toFixed(2)} ${sizeText}`,
  };
}

export function useQueryFile(file_path: string | null) {
  const queryClient = useQueryClient();
  const fileData = queryClient.getQueryData<{
    url: string;
    isImage: boolean;
    type: string;
    size: string;
  }>(["file", file_path]);

  const enabled = !!file_path && !fileData;

  return useQuery({
    queryKey: ["file", file_path],
    queryFn: () => getFiles(file_path),
    placeholderData: () => fileData,
    enabled,
  });
}
