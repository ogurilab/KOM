import { useRouter } from "next/router";

export default function useCourse() {
  const {
    query: { name },
  } = useRouter();

  return {
    name: name as string,
  };
}
