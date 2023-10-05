import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Image } from "@/components/image";
import { Loader } from "@/components/loader";
import { Modal } from "@/components/modal";
import { useQueryFile } from "@/features/files/api";

function ImageZoom({
  src,
  open,
  onClose,
}: {
  src: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-[80%] overflow-hidden"
    >
      <Modal.Description as="div" className="flex">
        <Image
          src={src}
          alt={src}
          isStyle={false}
          className="rounded-md border object-cover"
        />
      </Modal.Description>
    </Modal>
  );
}

export function FileLoader() {
  return (
    <div className="grid h-40 w-36 place-items-center rounded-md border border-gray-300 bg-white/50 p-2 ">
      <Loader theme="primary" size="xl" />
    </div>
  );
}

export function File({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useQueryFile(path);

  if (isPending) {
    return <FileLoader />;
  }

  return (
    <div>
      {data?.isImage ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="block w-full rounded-md"
          >
            <Image
              isStyle={false}
              src={data.url}
              alt={data.url}
              className="max-h-60 w-full max-w-full rounded-md border object-cover"
            />
          </button>
          <ImageZoom
            src={data.url}
            open={open}
            onClose={() => setOpen(false)}
          />
        </>
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
