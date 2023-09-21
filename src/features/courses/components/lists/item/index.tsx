import React from "react";
import { ActiveLink } from "@/components/activeLink";
import { Course } from "@/schema/db";

export function Course({ course }: { course: Course }) {
  return (
    <li key={course?.name}>
      <ActiveLink
        href={`/courses/${course?.id}`}
        activeClassName="bg-indigo-50 text-indigo-600"
        className="group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
      >
        <span className="border-y-8 border-l-[14px] border-solid  border-y-transparent border-l-gray-900 group-hover:border-l-gray-600" />
        <span>{course?.name}</span>
      </ActiveLink>
    </li>
  );
}
