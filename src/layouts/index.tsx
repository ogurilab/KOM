import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSetAtom } from "jotai";
import dynamic from "next/dynamic";
import { Fragment } from "react";

import { Loader } from "@/components/loader";
import { Pattern } from "@/components/pattern";
import { navAtom } from "@/context";

type Props = {
  children: React.ReactNode;
  title?: string;
  side?: React.ReactNode;
};

const DynamicNavTransition = dynamic(
  () => import("@/layouts/nav").then((mod) => mod.NavInTransition),
  {
    ssr: false,
  }
);

const DynamicNav = dynamic(
  () => import("@/layouts/nav").then((mod) => mod.Nav),
  {
    ssr: false,
    loading: () => (
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white/60 px-6 py-4">
          <Loader variant="dots" className="mx-auto" />
        </div>
      </div>
    ),
  }
);

const DynamicRegister = dynamic(
  () =>
    import("@/features/courses/components/register").then(
      (mod) => mod.Register
    ),
  {
    ssr: false,
  }
);

function Layout({ children, title, side }: Props) {
  const setSidebarOpen = useSetAtom(navAtom);

  return (
    <>
      <div>
        <Pattern />
        <DynamicNavTransition />
        <DynamicNav />
        <div className="sticky top-0 z-10 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:ml-72">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="line-clamp-1 flex-1 text-sm font-semibold leading-6 text-gray-900 ">
            {title ?? "SiLec"}
          </div>
          {side}
        </div>

        <main className="mx-auto h-full max-w-7xl lg:pl-72">
          <div>
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{children}</div>
          </div>
        </main>
      </div>
      <DynamicRegister />
    </>
  );
}

export default Layout;
