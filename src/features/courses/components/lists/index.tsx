import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import { ActiveLink } from "@/components/activeLink";
import { Modal } from "@/components/modal";
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

function DeleteCourse({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync } = useDeleteCourse();

  const onCompleteHandler = () => {
    mutateAsync({
      id,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Menu as="div" className="relative flex-none">
        <Menu.Button className="block p-2 text-gray-500 hover:text-gray-900">
          <span className="sr-only">Open options</span>
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className={clsx(
                    active ? "bg-gray-50" : "",
                    "flex w-full items-center justify-center px-2 py-1 text-sm leading-6 text-gray-900"
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
  return (
    <li key={course?.name} className="flex">
      <ActiveLink
        href={`/courses/${course?.id}`}
        activeClassName="text-blue-600"
        className="group flex flex-1 items-center gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      >
        {({ isActive }) => (
          <>
            <span
              className={clsx(
                "border-y-8 border-l-[14px] border-solid border-y-transparent border-l-gray-900 ",
                isActive
                  ? "border-l-blue-600"
                  : "border-l-gray-900 group-hover:border-l-gray-600"
              )}
            />
            <span>{course?.name}</span>
          </>
        )}
      </ActiveLink>
      <DeleteCourse id={course?.id} />
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
    <li>
      <div>
        <div className="flex w-full justify-between text-gray-900">
          <span className="leading-7">{weekItems[index]}</span>
          <span className="mr-6 flex h-7 items-center" />
        </div>
        <ul className="mt-2">
          {courses.map((course) => (
            <Course key={course.id} course={course} />
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Courses() {
  const { data } = useCourses();
  const hasData = data?.some((courses) => courses.length > 0);

  return (
    <ul className="grid gap-y-8">
      {hasData ? (
        data?.map((courses, i) => {
          return courses.length > 0 ? (
            // eslint-disable-next-line react/no-array-index-key
            <SplitCourses key={`courses-${i}`} courses={courses} index={i} />
          ) : null;
        })
      ) : (
        <div className="flex justify-center">
          <p>コースがありません</p>
        </div>
      )}
    </ul>
  );
}
