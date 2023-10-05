import React from "react";
import { Title } from "@/components/meta";
import { Pattern } from "@/components/pattern";
import { useForm } from "@/features/auth/hooks/useForm";
import { useGoogle } from "@/features/auth/hooks/useGoogle";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 262"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
};

function GoogleButton() {
  const { signInWithGoogle } = useGoogle();
  return (
    <button
      aria-label="Googleでログイン"
      type="button"
      onClick={signInWithGoogle}
      className="flex items-center justify-center gap-3 rounded-full border bg-white/60 px-6 py-2 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <GoogleIcon className="h-6 w-6" />
      <span className="font-medium leading-6 text-gray-900">
        Googleでログイン
      </span>
    </button>
  );
}

function AuthForm() {
  const {
    onChangeHandler,
    values,
    onSubmitHandler,
    isRegister,
    setIsRegister,
  } = useForm();

  return (
    <form onSubmit={onSubmitHandler} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          メールアドレス
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={onChangeHandler("email")}
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          パスワード
        </label>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={onChangeHandler("password")}
            autoComplete="current-password"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm leading-6">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            {isRegister ? "ログイン" : "新規登録"}はこちら
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isRegister ? "新規登録" : "ログイン"}
        </button>
      </div>
    </form>
  );
}

export function Auth() {
  return (
    <>
      <Title title="Auth" />
      <Pattern />
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <Logo /> */}
          <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            SiLec
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <AuthForm />
          <div>
            <div className="relative mt-10">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="px-6 text-gray-900">または</span>
              </div>
            </div>

            <div className="mt-6 grid ">
              <GoogleButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
