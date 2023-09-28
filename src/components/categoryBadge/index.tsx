import clsx from "clsx";
import React from "react";
import { MessageType } from "@/schema/db";

type Categories = {
  [key in MessageType]: {
    label: string;
    color: string;
  };
};

const categories: Categories = {
  ChitChat: {
    label: "雑談",
    color: "bg-green-50 text-green-700 ring-green-700/10",
  },
  Question: {
    label: "質問",
    color: "bg-blue-50 text-blue-600 ring-blue-600/10",
  },
  Contact: {
    label: "連絡",
    color: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
  },
  Request: {
    label: "依頼",
    color: "bg-red-50 text-red-700 ring-red-700/10",
  },
  Answer: {
    label: "回答",
    color: "bg-purple-50 text-purple-600 ring-purple-600/10",
  },
  Others: {
    label: "その他",
    color: "bg-gray-50 text-gray-600 ring-gray-600/10",
  },
} as const;

export function CategoryBadge({
  category,
  className,
}: {
  category: MessageType;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium ring-1 ring-inset",
        categories[category].color,
        className
      )}
    >
      {categories[category].label}
    </span>
  );
}
