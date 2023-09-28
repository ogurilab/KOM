import Head from "next/head";

export const Title = ({ title = "SiLec" }: { title?: string }) => {
  return (
    <Head>
      <title>{`${title} - SiLec`}</title>
    </Head>
  );
};
