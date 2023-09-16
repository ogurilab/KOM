import LogoutButton from "@/features/auth/components/LogoutButton";
import SignInGoogle from "@/features/auth/components/SignInGoogle";
import Layout from "@/layouts";

export default function Home() {
  return (
    <Layout>
      <SignInGoogle />
      <LogoutButton />
    </Layout>
  );
}
