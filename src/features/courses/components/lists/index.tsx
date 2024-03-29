import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { ActiveLink } from "@/components/activeLink";
import { Loader } from "@/components/loader";
import { Modal } from "@/components/modal";
import { showNotificationAtom } from "@/components/notification";
import { navAtom, userAtom } from "@/context";
import { useCourses, useDeleteCourse } from "@/features/courses/hooks/lists";
import { Course as TCourse } from "@/schema/db";

const weekItems = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

function CourseMenu({ id, class_code }: { id: string; class_code: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync } = useDeleteCourse();
  const { push, query } = useRouter();
  const user = useAtomValue(userAtom);
  const onNotification = useSetAtom(showNotificationAtom);

  const onCopyHandler = () => {
    navigator.clipboard.writeText(class_code);
    onNotification({
      type: "success",
      title: "IDをコピーしました",
    });
  };

  const onCompleteHandler = async () => {
    await mutateAsync({
      id,
    });

    if (query.slug === id) push("/");
    setIsOpen(false);

    onNotification({
      type: "success",
      title: "コースを削除しました",
    });
  };

  return (
    <>
      <Menu as="div" className="relative flex-none">
        <Menu.Button className="block py-1 text-gray-500 hover:text-gray-900">
          <span className="sr-only">設定を開く</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className={clsx(
                    active ? "bg-gray-50" : "",
                    "flex w-full items-center px-2 py-1 text-sm leading-6 text-gray-900"
                  )}
                >
                  <TrashIcon
                    className="mr-2 h-5 w-5 text-red-400 group-hover:text-red-500"
                    aria-hidden="true"
                  />
                  <span className="font-medium">削除</span>
                </button>
              )}
            </Menu.Item>
            {user?.profile?.role === "Teacher" && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={onCopyHandler}
                    className={clsx(
                      active ? "bg-gray-50" : "",
                      "flex w-full items-center justify-center px-2 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    <DocumentDuplicateIcon
                      className="mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="font-medium">クラスIDをコピー</span>
                  </button>
                )}
              </Menu.Item>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
      <Modal onClose={() => setIsOpen(false)} open={isOpen}>
        <Modal.Title className="text-center">コースを削除</Modal.Title>
        <Modal.Description className="my-8 text-center">
          本当にコースを削除しますか？
        </Modal.Description>
        <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-6">
          <Modal.CloseButton onClose={() => setIsOpen(false)}>
            キャンセル
          </Modal.CloseButton>
          <Modal.CompleteButton isDelete onComplete={onCompleteHandler}>
            削除
          </Modal.CompleteButton>
        </div>
      </Modal>
    </>
  );
}

function Course({ course }: { course: TCourse }) {
  const setIsNavOpen = useSetAtom(navAtom);
  return (
    <li key={course?.name} className="flex justify-between">
      <ActiveLink
        onTransitionComplete={() => setIsNavOpen(false)}
        href={{
          pathname: `/courses/${course?.id}`,
          query: { name: course?.name ?? "" },
        }}
        activeClassName="text-blue-600 font-bold"
        className="group -mx-2 mr-4 flex flex-1 items-center rounded-md px-2 text-sm leading-6 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      >
        <span className="flex-1">{course?.name}</span>
      </ActiveLink>
      <CourseMenu id={course?.id} class_code={course?.class_code} />
    </li>
  );
}

function SplitCourses({
  courses,
  index,
}: {
  courses: TCourse[];
  index: number;
}) {
  return (
    <Disclosure defaultOpen as="div">
      {({ open }) => (
        <>
          <dt>
            <Disclosure.Button className="flex w-full justify-between text-gray-900">
              <span
                className={clsx(
                  new Date().getDay() === index ? "font-semibold" : ""
                )}
              >
                {weekItems[index]}
              </span>
              <span className="flex h-7 items-center">
                {open ? (
                  <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
            </Disclosure.Button>
          </dt>
          <Disclosure.Panel as="dd">
            <ul className="mt-3 space-y-3">
              {courses.map((course) => (
                <Course key={course.id} course={course} />
              ))}
            </ul>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export function Courses() {
  const { data, isPending } = useCourses();
  const hasData = data?.some((courses) => courses.length > 0);

  if (isPending) {
    return <Loader variant="dots" className="mx-auto" />;
  }

  if (!hasData)
    return (
      <div className="flex justify-center">
        <p>コースがありません</p>
      </div>
    );

  return (
    <dl className="grid gap-y-8">
      {hasData &&
        data?.map((courses, i) => {
          return courses.length > 0 ? (
            // eslint-disable-next-line react/no-array-index-key
            <SplitCourses key={`courses-${i}`} courses={courses} index={i} />
          ) : null;
        })}
    </dl>
  );
}
