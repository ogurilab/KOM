import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import React, { Fragment, Suspense } from "react";
import { navAtom, registerModalAtom, userAtom } from "@/context";
import { Courses } from "@/features/courses/components/lists";

export function Nav() {
  const setRegisterModal = useSetAtom(registerModalAtom);
  const { push } = useRouter();
  const user = useAtomValue(userAtom);

  const onClickHandler = () => {
    if (user?.profile?.role === "Student") {
      setRegisterModal(true);

      return;
    }

    push("/courses/create");
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white/60 px-6 py-4">
        <div className="flex h-16 shrink-0 items-center">
          {/* <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
        </div>
        <nav className="flex flex-1 flex-col gap-y-8">
          <p className="text-gay-900 border-b pb-2 font-semibold">講義</p>
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <Suspense>
                <Courses />
              </Suspense>
            </li>
            <li className="-mx-6 mt-auto border-t pt-4">
              <button
                onClick={onClickHandler}
                type="button"
                className="flex w-full justify-center gap-8"
              >
                <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                <span className="border-b px-2">登録</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function NavInTransition() {
  const [sidebarOpen, setSidebarOpen] = useAtom(navAtom);
  const setRegisterModal = useSetAtom(registerModalAtom);
  const user = useAtomValue(userAtom);
  const { push } = useRouter();

  const onClickHandler = () => {
    if (user?.profile?.role === "Student") {
      setRegisterModal(true);

      return;
    }

    push("/courses/create");
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
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
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
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  {/* <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  /> */}
                </div>
                <nav className="flex flex-1 flex-col gap-y-8">
                  <p className="text-gay-900 border-b pb-2 font-semibold">
                    講義
                  </p>
                  <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <Suspense>
                        <Courses />
                      </Suspense>
                    </li>
                    <li className="-mx-6 mt-auto border-t pt-4">
                      <button
                        onClick={onClickHandler}
                        type="button"
                        className="flex w-full justify-center gap-8"
                      >
                        <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                        <span className="border-b px-2">登録</span>
                      </button>
                    </li>
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
