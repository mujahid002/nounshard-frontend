import Head from "next/head";
import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>NounShards</title>
        <meta
          name="description"
          content="A simple website to Tokenize the Noun"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/nounshards.ico" />
      </Head>
      <NavBar />
      <main className="bg-[#f8f7f5] min-h-[calc(100vh-76px)] px-10 py-8">
        <div className="container md:mx-auto md:max-w-[850px]">{children}</div>
      </main>
    </>
  );
}
