import { RadioGroup } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Title } from "@/components/meta";
import { showNotificationAtom } from "@/components/notification";
import { Pattern } from "@/components/pattern";
import { userAtom } from "@/context";
import { useCreateProfile } from "@/features/profile/hooks/create";
import { Role } from "@/schema/db";

const RoleOptions = [
  {
    role: Role.Student,
    title: "生徒",
    description: "講義の登録を行うことができます。",
  },
  {
    role: Role.Teacher,
    title: "教授",
    description: "講義の作成を行うことができます。",
  },
] as const;

function SelectRole() {
  const [selected, setSelected] = useState(RoleOptions[0]);
  const { mutateAsync } = useCreateProfile();
  const onNotification = useSetAtom(showNotificationAtom);
  const [user, setUser] = useAtom(userAtom);
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!user) return;
      const { role } = selected;

      await mutateAsync({
        role,
        id: user.data.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["profile", user.data.id],
      });

      setUser({
        data: user.data,
        profile: {
          role,
          id: user.data.id,
        },
      });
      onNotification({
        type: "success",
        title: "プロフィールを作成しました。",
      });

      push("/");
    } catch (error) {
      onNotification({
        type: "error",
        title: "エラーが発生しました。",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <RadioGroup
        as="div"
        className="grid gap-y-6"
        value={selected}
        onChange={setSelected}
      >
        <RadioGroup.Label className="sr-only">
          生徒か教授かを選択してください
        </RadioGroup.Label>
        <div className="mx-auto flex flex-col justify-center gap-6 -space-y-px  rounded-md  md:flex-row">
          {RoleOptions.map((setting, settingIdx) => (
            <RadioGroup.Option
              key={setting.role}
              value={setting}
              className={({ checked }) =>
                clsx(
                  settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                  settingIdx === RoleOptions.length - 1
                    ? "rounded-bl-md rounded-br-md"
                    : "",
                  checked
                    ? "z-10 border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-white",
                  "relative flex cursor-pointer border p-4 focus:outline-none"
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span
                    className={clsx(
                      checked
                        ? "border-transparent bg-blue-600"
                        : "border-gray-300 bg-white",
                      active ? "ring-2 ring-blue-600 ring-offset-2" : "",
                      "mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border"
                    )}
                    aria-hidden="true"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <span className="ml-3 flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={clsx(
                        checked ? "text-blue-900" : "text-gray-900",
                        "block text-sm font-medium"
                      )}
                    >
                      {setting.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={clsx(
                        checked ? "text-blue-700" : "text-gray-500",
                        "block text-sm"
                      )}
                    >
                      {setting.description}
                    </RadioGroup.Description>
                  </span>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
        <button
          className="mx-auto flex w-full  max-w-xs justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          type="submit"
        >
          登録する
        </button>
      </RadioGroup>
    </form>
  );
}

export function CreateProfile() {
  return (
    <>
      <Title title="プロフィール作成" />
      <Pattern />
      <div className="flex min-h-screen flex-1 flex-col  px-6 py-12 lg:px-8">
        <div className="mt-0 flex  max-w-xl flex-1 flex-col items-center gap-y-6 sm:mx-auto  sm:w-full ">
          <h2 className="mt-6 w-full text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            生徒か教授を選択してください
          </h2>
          <SelectRole />
        </div>
      </div>
    </>
  );
}
