/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtom } from "jotai";
import React from "react";
import { Modal } from "@/components/modal";
import { registerModalAtom } from "@/context";

function RegisterForm() {
  return (
    <form className="flex flex-col gap-8">
      <div>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="ID"
        />
      </div>
      <div>
        <input
          type="password"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Password"
        />
      </div>
    </form>
  );
}

function RegisterModal() {
  const [open, setOpen] = useAtom(registerModalAtom);
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Modal.Title className="text-center">授業登録</Modal.Title>
      <Modal.Description className="my-8">
        <RegisterForm />
      </Modal.Description>
      <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-6">
        <Modal.CompleteButton onComplete={() => setOpen(false)}>
          登録
        </Modal.CompleteButton>
        <Modal.CloseButton onClose={() => setOpen(false)}>
          キャンセル
        </Modal.CloseButton>
      </div>
    </Modal>
  );
}

export function Register() {
  return <RegisterModal />;
}
