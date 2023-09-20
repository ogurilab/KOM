import { useGoogle } from "@/features/auth/hooks/useGoogle";

function SignInGoogle() {
  const { signInWithGoogle } = useGoogle();

  return (
    <button onClick={signInWithGoogle} type="button">
      Googleでサインインする
    </button>
  );
}

export default SignInGoogle;
