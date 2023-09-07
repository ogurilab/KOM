import Layout from "@/features/auth/components/Layout";
import SignInGoogle from "@/features/auth/components/SignInGoogle";

export default function Home() {
  return (
    <Layout>
      <SignInGoogle />
    </Layout>
  );
}
