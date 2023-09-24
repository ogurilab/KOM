import { useMutation } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "react";
import { showNotificationAtom } from "@/components/notification";
import { userAtom } from "@/context";
import { useRegisterCourse } from "@/features/courses/hooks/register";
import { InsertCourseSchema } from "@/schema/db";

const Days = [
  { id: "0", name: "日曜日" },
  { id: "1", name: "月曜日" },
  { id: "2", name: "火曜日" },
  { id: "3", name: "水曜日" },
  { id: "4", name: "木曜日" },
  { id: "5", name: "金曜日" },
  { id: "6", name: "土曜日" },
];

const Times = [
  { id: "1", name: "1限" },
  { id: "2", name: "2限" },
  { id: "3", name: "3限" },
  { id: "4", name: "4限" },
  { id: "5", name: "5限" },
  { id: "6", name: "6限" },
  { id: "7", name: "7限" },
  { id: "8", name: "8限" },
];

const Semesters = [
  { id: "前期", name: "前期" },
  { id: "後期", name: "後期" },
  { id: "通年", name: "通年" },
];

async function createCourse(body: InsertCourseSchema) {
  const data = await fetch("/api/courses", {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());

  return data;
}

function useMutateCourse() {
  return useMutation({
    mutationFn: createCourse,
  });
}

type Values = {
  password: string;
  name: string;
  year: number;
  semester: { id: string | number; name: string };
  day: { id: string | number; name: string };
  period: { id: string | number; name: string };
};

const defaultValues = {
  password: "",
  name: "",
  year: Number(new Date().getFullYear()),
  semester: { id: Semesters[0].id, name: Semesters[0].name },
  day: { id: Days[0].id, name: Days[0].name },
  period: { id: Times[0].id, name: Times[0].name },
};

function checkValues(values: Values) {
  const { password, name, year, semester, day, period } = values;

  if (!password || !name || !year || !semester || !day || !period) {
    return false;
  }

  return true;
}

export function useCreateCourse() {
  const [values, setValues] = useState<Values>(defaultValues);
  const user = useAtomValue(userAtom);
  const onNotification = useSetAtom(showNotificationAtom);
  const [code, setCode] = useState<string>("");
  const { mutateAsync } = useMutateCourse();
  const { mutateAsync: mutateAsyncRegister } = useRegisterCourse();

  const onChangeInput =
    (target: keyof Pick<typeof values, "password" | "name" | "year">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [target]: e.target.value }));
    };

  const onChangeSelect =
    (target: keyof Pick<typeof values, "semester" | "day" | "period">) =>
    (val: { id: string | number; name: string }) => {
      setValues((v) => ({ ...v, [target]: val }));
    };

  const onCopyCode = () => {
    navigator.clipboard.writeText(code);
    onNotification({
      type: "success",
      title: "コピーしました",
    });
  };

  const onRestValues = () => setValues(defaultValues);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const { day, semester, period, ...rest } = values;
    const class_code = nanoid();
    try {
      if (!checkValues(values))
        throw new Error("入力されていない項目があります");

      await mutateAsync({
        ...rest,
        day_of_week: Number(day.id),
        term: semester.id.toString(),
        time_slot: Number(period.id),
        user_id: user.data.id,
        class_code,
        class_password: values.password,
      });

      await mutateAsyncRegister({
        profile_id: user.data.id,
        password: values.password,
        class_code,
      });

      onNotification({
        type: "success",
        title: "授業を作成しました",
        message: "講義コードをコピーして学生に共有してください",
      });
      setCode(class_code);
      onRestValues();
    } catch (error) {
      if (error instanceof Error) {
        onNotification({
          type: "error",
          title: "エラー",
          message: error.message,
        });

        return;
      }
      onNotification({
        type: "error",
        title: "エラー",
        message: "授業の作成に失敗しました",
      });
    }
  };

  return {
    values,
    onChangeInput,
    onChangeSelect,
    Semesters,
    Days,
    Times,
    onSubmitHandler,
    code,
    onCopyCode,
  };
}
