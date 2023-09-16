import useAuth from "../hooks/useAuth";

function SignInGoogle() {
  const { signInWithGoogle } = useAuth();

  return (
    <button onClick={signInWithGoogle} type="button">
      Googleでサインインする
    </button>
  );
}

export default SignInGoogle;
