import useAuth from "@/hooks/useAuth";

function SignInGoogle() {
  const { signInWithGoogle, error } = useAuth();

  return (
    <div>
      <button onClick={signInWithGoogle}>Googleでサインインする</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default SignInGoogle;
