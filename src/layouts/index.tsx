import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSetAtom } from "jotai";
import dynamic from "next/dynamic";
import { Fragment, Suspense } from "react";

import { Pattern } from "@/components/pattern";
import { navAtom } from "@/context";

type Props = {
  children: React.ReactNode;
  title?: string;
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

function Layout({ children, title }: Props) {
  const setSidebarOpen = useSetAtom(navAtom);

  return (
    <>
      <div>
        <Pattern />
        <Suspense>
          <DynamicNavTransition />
          <DynamicNav />
        </Suspense>
        <div className="sticky top-0 z-10 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:ml-72">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900 ">
            {title ?? "SiLec"}
          </div>
        </div>

        <main className="lg:pl-72">
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
