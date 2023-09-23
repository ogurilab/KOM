import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { atom, useAtomValue, useSetAtom } from "jotai";
import React, { Fragment } from "react";

type TextProps = {
  title: string;
  message?: string;
};

export type NotificationType = "success" | "error" | "info";

export type NotificationState = {
  duration?: number;
  type: NotificationType;
  isShown?: boolean;
  isPersistent?: boolean;
  timer?: NodeJS.Timeout | null;
} & TextProps;

export type Notification = NotificationState;

const defaultState: NotificationState = {
  title: "",
  message: "",
  duration: 3000,
  isShown: false,
  type: "info",
  isPersistent: false,
  timer: null,
};

const notificationAtom = atom<Notification>(defaultState);
const onHideAtom = atom(null, (get, set) => {
  const { timer } = get(notificationAtom);
  if (timer) {
    clearTimeout(timer);
  }
  set(notificationAtom, { ...defaultState });
});
export const showNotificationAtom = atom(
  null,
  (get, set, arg: Notification) => {
    const { duration, timer } = get(notificationAtom);

    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      set(notificationAtom, {
        ...arg,
        isShown: false,
      });
    }, duration || 3000);

    set(notificationAtom, { ...arg, timer: newTimer, isShown: true, duration });
  }
);

const TypeIcons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
};

const TypeColors = {
  success: "stroke-green-500",
  error: "stroke-red-500",
  info: "stroke-amber-500",
};

const TypeTextColors = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-amber-500",
};

const getTypeIcons = (type: NotificationType): React.FC => {
  const Icon = TypeIcons[type];

  return (props) => <Icon {...props} />;
};

export function Notification() {
  const {
    title,
    message,
    type,
    isShown: show,
  } = useAtomValue(notificationAtom);

  const onHide = useSetAtom(onHideAtom);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[200] flex  px-4 py-6 sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={show}
        >
          <div
            className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
            role="alert"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getTypeIcons(type)({
                    className: clsx("w-6 h-6", TypeColors[type]),
                  })}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className={`text-sm font-bold ${TypeTextColors[type]}`}>
                    {title}
                  </p>
                  {message && (
                    <div className="mt-1 text-sm leading-4 text-gray-500">
                      {message && <p>{message}</p>}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onHide}
                    type="button"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
