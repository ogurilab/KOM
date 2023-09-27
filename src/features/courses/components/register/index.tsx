/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { Modal } from "@/components/modal";
import { showNotificationAtom } from "@/components/notification";
import { registerModalAtom, userAtom } from "@/context";
import { useRegisterCourse } from "@/features/courses/hooks/register";
import { getSupabaseError } from "@/lib/error";

export function RegisterForm({
  onChangeId,
  onChangePassword,
  class_code,
  password,
}: {
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  class_code: string;
  password: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="ID"
          value={class_code}
          onChange={onChangeId}
        />
      </div>
      <div>
        <input
          type="password"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="Password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
    </div>
  );
}

function useRegister() {
  const [open, setOpen] = useAtom(registerModalAtom);
  const { mutateAsync } = useRegisterCourse();
  const [value, setValue] = React.useState({
    class_code: "",
    password: "",
  });
  const onNotification = useSetAtom(showNotificationAtom);
  const user = useAtomValue(userAtom);

  const onChangeHandler =
    (target: keyof typeof value) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue((prev) => ({ ...prev, [target]: e.target.value }));
    };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.profile?.id) return;

    try {
      await mutateAsync({
        class_code: value.class_code,
        password: value.password,
        profile_id: user?.profile?.id,
      });

      onNotification({
        type: "success",
        title: "授業登録が完了しました。",
      });
    } catch (error) {
      onNotification({
        type: "error",
        title: getSupabaseError(error),
      });
    }

    setValue({
      class_code: "",
      password: "",
    });
  };

  return {
    open,
    setOpen,
    value,
    onChangeHandler,
    onSubmitHandler,
  };
}

function RegisterModal() {
  const { open, setOpen, value, onChangeHandler, onSubmitHandler } =
    useRegister();

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Modal.Title className="text-center">授業登録</Modal.Title>
      <form onSubmit={onSubmitHandler}>
        <Modal.Description as="div" className="my-8">
          <RegisterForm
            onChangeId={onChangeHandler("class_code")}
            onChangePassword={onChangeHandler("password")}
            {...value}
          />
        </Modal.Description>
        <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-6">
          <Modal.CompleteButton type="submit" onComplete={() => setOpen(false)}>
            登録
          </Modal.CompleteButton>
          <Modal.CloseButton onClose={() => setOpen(false)}>
            キャンセル
          </Modal.CloseButton>
        </div>
      </form>
    </Modal>
  );
}

export function RegisterTop() {
  const { value, onChangeHandler, onSubmitHandler } = useRegister();
  return (
    <form onSubmit={onSubmitHandler}>
      <div className="my-8 text-sm text-gray-600">
        <RegisterForm
          onChangeId={onChangeHandler("class_code")}
          onChangePassword={onChangeHandler("password")}
          {...value}
        />
      </div>
      <div className="mt-5 grid gap-3 sm:mt-6">
        <button
          type="submit"
          className="mx-auto inline-flex w-full max-w-xs justify-center  rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          登録
        </button>
      </div>
    </form>
  );
}

export function Register() {
  return <RegisterModal />;
}
