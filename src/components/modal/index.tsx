import { Dialog, Transition } from "@headlessui/react";
import React, { ComponentPropsWithoutRef, Fragment } from "react";
import { cn } from "@/utils/cn";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
};

export function Modal({ children, open, onClose, className }: ModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0  scale-95"
              enterTo="opacity-100  scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100  scale-100"
              leaveTo="opacity-0  scale-95"
            >
              <Dialog.Panel
                className={cn(
                  "relative my-8 w-full max-w-sm transform  overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all",
                  className
                )}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

Modal.Title = function ModalTitle({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Dialog.Title> & {
  children: React.ReactNode;
}) {
  return (
    <Dialog.Title
      {...props}
      className={cn(
        "text-base font-semibold leading-6 text-gray-900",
        className
      )}
    >
      {children}
    </Dialog.Title>
  );
};

Modal.Description = function ModalDescription({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Dialog.Description> & {
  children: React.ReactNode;
}) {
  return (
    <Dialog.Description
      {...props}
      className={cn("mt-2 text-sm text-gray-600", className)}
    >
      {children}
    </Dialog.Description>
  );
};

Modal.CloseButton = function ModalCloseButton({
  onClose,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "onClick"> & {
  onClose: () => void;
}) {
  return (
    <button
      {...props}
      type="button"
      onClick={onClose}
      className={cn(
        "inline-flex  w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50",
        className
      )}
    />
  );
};

Modal.CompleteButton = function ModalCompleteButton({
  children,
  className,
  isDelete = false,
  onComplete,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  children: React.ReactNode;
  isDelete?: boolean;
  onComplete: () => void;
}) {
  return (
    <button
      {...props}
      type={type === "button" ? "button" : "submit"}
      onClick={onComplete}
      className={cn(
        "col-start-2 inline-flex w-full justify-center  rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2",
        isDelete
          ? "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600"
          : "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600",
        className
      )}
    >
      {children}
    </button>
  );
};
