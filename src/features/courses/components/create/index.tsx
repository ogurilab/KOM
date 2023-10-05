/* eslint-disable no-nested-ternary */
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import React, { Fragment } from "react";
import { Loader } from "@/components/loader";
import { Title } from "@/components/meta";
import { useCreateCourse } from "@/features/courses/hooks/create";
import Layout from "@/layouts";

function Select({
  value,
  onChange,
  items,
  label,
}: {
  items: { id: string | number; name: string }[];
  value: { id: string | number; name: string };
  onChange: (v: { id: string | number; name: string }) => void;
  label?: string;
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{value.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.id + item.name}
                    className={({ active }) =>
                      clsx(
                        active ? "bg-blue-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-8 pr-4"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={clsx(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {item.name}
                        </span>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? "text-white" : "text-blue-600",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

function Input({
  label,
  placeholder,
  type,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="sr-only">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        placeholder={placeholder}
      />
    </div>
  );
}

export function CreateCourse() {
  const {
    values,
    onChangeInput,
    onChangeSelect,
    Semesters,
    Days,
    Times,
    onSubmitHandler,
    code,
    onCopyCode,
    isPending,
  } = useCreateCourse();

  const steps = [
    {
      title: "パスワード",
      id: 1,
      component: (
        <Input
          label="パスワード"
          placeholder="Password"
          type="password"
          value={values.password}
          onChange={onChangeInput("password")}
        />
      ),
    },
    {
      title: "授業名",
      id: 2,
      component: (
        <Input
          label="授業名"
          placeholder="授業名"
          type="text"
          value={values.name}
          onChange={onChangeInput("name")}
        />
      ),
    },
    {
      title: "年度",
      id: 3,
      component: (
        <Input
          label="年度"
          placeholder="年度"
          type="number"
          value={values.year}
          onChange={onChangeInput("year")}
        />
      ),
    },
    {
      title: "開講学期",
      id: 4,
      component: (
        <Select
          value={{ id: values.semester.id, name: values.semester.name }}
          onChange={onChangeSelect("semester")}
          items={Semesters}
        />
      ),
    },
    {
      title: "曜日",
      id: 5,
      component: (
        <Select
          value={{ id: values.day.id, name: values.day.name }}
          onChange={onChangeSelect("day")}
          items={Days}
        />
      ),
    },
    {
      title: "時限",
      id: 6,
      component: (
        <Select
          label="連続の講義の場合は最初の時限を選択してください。"
          value={{ id: values.period.id, name: values.period.name }}
          onChange={onChangeSelect("period")}
          items={Times}
        />
      ),
    },
  ];

  return (
    <Layout>
      <Title title="講義の作成" />
      <div className="pb-72">
        <div className="flex flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:px-0">
          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              講義の作成
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              生徒が登録する講義を作成します。
            </p>
          </div>
        </div>
        <form onSubmit={onSubmitHandler} className="mt-6">
          <dl className="divide-y divide-gray-300">
            {steps.map((step) => (
              <div
                key={step.id}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  {step.title}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {step.component}
                </dd>
              </div>
            ))}
          </dl>
          <button
            type="submit"
            className="mx-auto mt-20 flex w-full max-w-xs justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? <Loader theme="white" /> : "作成する"}
          </button>
        </form>
        {code && (
          <div>
            <p className="mt-10 text-center text-sm font-semibold leading-6 text-gray-900">
              以下は講義コードです。生徒はこのコードを入力することで講義に登録できます。
            </p>
            <button
              onClick={onCopyCode}
              type="button"
              className=" mx-auto mt-6 flex items-center justify-center gap-x-4 rounded-md border border-gray-500 bg-white px-4 py-2 text-center text-sm font-semibold leading-6 text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span className="mt-1 text-sm font-semibold leading-6 text-gray-900">
                {code}
              </span>
              <DocumentDuplicateIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
