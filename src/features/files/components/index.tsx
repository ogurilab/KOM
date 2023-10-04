import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { Image } from "@/components/image";
import { Loader } from "@/components/loader";
import { useQueryFile } from "@/features/messages/api";

export function FileLoader() {
  return (
    <div className="grid h-40 w-36 place-items-center rounded-md border border-gray-300 bg-white/50 p-2 ">
      <Loader theme="primary" size="xl" />
    </div>
  );
}

export function File({ path }: { path: string }) {
  const { data, isPending } = useQueryFile(path);

  if (isPending) {
    return <FileLoader />;
  }

  return (
    <div>
      {data?.isImage ? (
        <div className="rounded-md border">
          <Image
            isStyle={false}
            src={data.url}
            alt={data.url}
            className="max-h-60 max-w-full rounded-md object-cover"
          />
        </div>
      ) : (
        <a
          href={data?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-x-2 text-sm"
        >
          <div className="grid h-12 w-12 place-items-center rounded-md bg-blue-600 p-2 group-hover:bg-blue-500">
            <DocumentTextIcon
              aria-hidden="true"
              className="h-8 w-8 text-white"
            />
          </div>
          <div className="grid gap-y-1 text-sm text-gray-600">
            <span className="text-blue-600 hover:text-blue-500">
              {data?.type.split("/")[1].toLocaleUpperCase()}
            </span>
            <span>{data?.size}</span>
          </div>
        </a>
      )}
    </div>
  );
}
