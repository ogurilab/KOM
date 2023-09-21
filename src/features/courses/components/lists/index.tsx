import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Course } from "@/features/courses/components/lists/item";
import { useCourses } from "@/features/courses/hooks/lists";
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

function SplitCourses({
  courses,
  index,
}: {
  courses: TCourse[];
  index: number;
}) {
  return (
    <Disclosure
      defaultOpen={index === new Date().getDay()}
      as="li"
      className=""
    >
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full justify-between text-gray-900">
            <span className="leading-7">{weekItems[index]}</span>
            <span className="mr-6 flex h-7 items-center">
              {open ? (
                <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </span>
          </Disclosure.Button>
          <Disclosure.Panel as="ul" className="mt-2">
            {courses.map((course) => (
              <Course key={course.id} course={course} />
            ))}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

export function Courses() {
  const { data } = useCourses();

  return (
    <ul className="grid gap-y-8">
      {data?.map((courses, i) => {
        return courses.length > 0 ? (
          // eslint-disable-next-line react/no-array-index-key
          <SplitCourses key={`courses-${i}`} courses={courses} index={i} />
        ) : null;
      })}
    </ul>
  );
}
