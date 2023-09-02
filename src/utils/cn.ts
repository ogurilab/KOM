import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classNames: (string | undefined)[]) => {
  return twMerge(clsx(...classNames));
};
