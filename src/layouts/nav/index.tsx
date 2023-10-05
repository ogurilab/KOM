import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, Suspense } from "react";
import { Loader } from "@/components/loader";
import { navAtom, registerModalAtom, userAtom } from "@/context";
import { useGoogle } from "@/features/auth/hooks/useGoogle";
import { Courses } from "@/features/courses/components/lists";

export function Nav() {
  const setRegisterModal = useSetAtom(registerModalAtom);
  const { push } = useRouter();
  const user = useAtomValue(userAtom);
  const { signOut } = useGoogle();

  const onClickHandler = () => {
    if (user?.profile?.role === "Student") {
      setRegisterModal(true);

      return;
    }

    push("/courses/create");
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pt-4">
        <Link
          href="/"
          className="flex shrink-0 items-center text-3xl font-black sm:text-4xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-16" src="/logo.png" alt="SiLec" />
          <span className="inline-block flex-1 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-center text-transparent">
            SiLec
          </span>
        </Link>

        <div className="flex flex-1 flex-col gap-y-8">
          <p className="text-gay-900 border-b pb-2 font-semibold">講義</p>
          <div className="flex flex-1 flex-col gap-y-7">
            <div>
              <Suspense
                fallback={<Loader variant="dots" className="mx-auto" />}
              >
                <Courses />
              </Suspense>
            </div>

            <button
              onClick={onClickHandler}
              type="button"
              className="group sticky bottom-0 -mx-6 mt-auto border-t bg-white px-4 py-4"
            >
              <div className="relative flex w-full justify-center">
                <DocumentPlusIcon className="absolute left-2 h-6 w-6 text-blue-600 group-hover:text-blue-500 " />
                <span className="px-2 font-semibold text-blue-600 group-hover:text-blue-500">
                  講義を{user?.profile?.role === "Student" ? "登録" : "作成"}
                </span>
              </div>
            </button>
            <div className="-mt-6 flex items-end justify-between pb-4">
              <span className="text-sm font-semibold">
                {user?.profile?.role === "Student" ? "学生" : "教員"}
                でログイン中
              </span>
              <button
                type="button"
                className="px-2 text-gray-400 hover:text-gray-900"
                aria-label="ログアウト"
                onClick={signOut}
              >
                <ArrowLeftOnRectangleIcon
                  className="h-6 w-6 "
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NavInTransition() {
  const [sidebarOpen, setSidebarOpen] = useAtom(navAtom);
  const setRegisterModal = useSetAtom(registerModalAtom);
  const user = useAtomValue(userAtom);
  const { push } = useRouter();
  const { signOut } = useGoogle();

  const onClickHandler = async () => {
    if (user?.profile?.role === "Student") {
      setRegisterModal(true);

      setSidebarOpen(false);
      return;
    }

    await push("/courses/create");
    setSidebarOpen(false);
  };

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20 lg:hidden"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16  flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pt-4">
                <Link
                  href="/"
                  className="flex shrink-0 items-center text-3xl font-black sm:text-4xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-16" src="/logo.png" alt="SiLec" />
                  <span className="inline-block flex-1 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-center text-transparent">
                    SiLec
                  </span>
                </Link>
                <nav className="flex flex-1 flex-col gap-y-8">
                  <p className="text-gay-900 border-b pb-2 font-semibold">
                    講義
                  </p>
                  <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <Suspense
                        fallback={<Loader variant="dots" className="mx-auto" />}
                      >
                        <Courses />
                      </Suspense>
                    </li>
                    <button
                      onClick={onClickHandler}
                      type="button"
                      className="sticky bottom-0 -mx-6 mt-auto border-t bg-white px-4 py-4"
                    >
                      <div className="relative flex w-full justify-center">
                        <DocumentPlusIcon className="absolute left-1 h-6 w-6 text-blue-600 group-hover:text-gray-900" />
                        <span className="px-2 font-semibold text-blue-600">
                          講義を
                          {user?.profile?.role === "Student" ? "登録" : "作成"}
                        </span>
                      </div>
                    </button>
                    <div className="-mt-6 flex items-end justify-between pb-4">
                      <span className="text-sm font-semibold">
                        {user?.profile?.role === "Student" ? "学生" : "教員"}
                        でログイン中
                      </span>
                      <button
                        type="button"
                        className="px-2 text-gray-400 hover:text-gray-900"
                        aria-label="ログアウト"
                        onClick={signOut}
                      >
                        <ArrowLeftOnRectangleIcon
                          className="h-6 w-6 "
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
