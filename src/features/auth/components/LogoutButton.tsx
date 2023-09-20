import { useGoogle } from "@/features/auth/hooks/useGoogle";

function LogoutButton() {
  const { signOut } = useGoogle();
  return (
    <button onClick={signOut} type="button">
      ログアウト
    </button>
  );
}

export default LogoutButton;
