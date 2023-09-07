import useAuth from "../hooks/useAuth";

function LogoutButton() {
  const { signOut } = useAuth();
  return (
    <button onClick={signOut} type="button">
      ログアウト
    </button>
  );
}

export default LogoutButton;
