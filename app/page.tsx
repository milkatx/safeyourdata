import { Suspense } from "react";
import Nav from "@/components/Nav";
import Title from "@/components/Title";
import Directory from "@/components/Directory";
import { getPlugins } from "@/lib/sheets";

export const revalidate = 3600;

export default async function Home() {
  const plugins = await getPlugins();

  return (
    <>
      <Nav />
      <Title className="title m0 p0" text="Is your*data safe?" />
      <Suspense fallback={null}>
        <Directory plugins={plugins} />
      </Suspense>
    </>
  );
}
