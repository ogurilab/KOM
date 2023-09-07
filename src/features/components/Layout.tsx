import LogoutButton from "./LogoutButton";
import useAuth from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  const { session: isLogin } = useAuth();

  return (
    <>
      <header>
        {isLogin && <LogoutButton />}
        <p>This is the header area</p>
        <hr />
      </header>
      <main>{children}</main>
      <footer>
        <hr />
        <p>This is the footer area</p>
      </footer>
    </>
  );
}

export default Layout;
