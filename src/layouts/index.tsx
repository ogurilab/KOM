import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSetAtom } from "jotai";
import { Fragment, Suspense } from "react";

import { Pattern } from "@/components/pattern";
import { navAtom } from "@/context";
import { Register } from "@/features/courses/components/register";
import { Nav, NavInTransition } from "@/layouts/nav";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  const setSidebarOpen = useSetAtom(navAtom);

  return (
    <>
      <div>
        <Pattern />
        <Suspense>
          <NavInTransition />
          <Nav />
        </Suspense>
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
        </div>

        <main className="lg:pl-72">
          <div>
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{children}</div>
          </div>
        </main>
      </div>
      <Register />
    </>
  );
}

export default Layout;
