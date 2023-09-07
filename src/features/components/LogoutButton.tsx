import useAuth from "@/hooks/useAuth";

function LogoutButton() {
  const { signOut } = useAuth();
  return <button onClick={signOut}>ログアウト</button>;
}

export default LogoutButton;
