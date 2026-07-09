import Link from "next/link";
import Title from "@/components/Title";
import { ArrowLeft } from "@/components/Arrows";

export default function NotFound() {
  return (
    <>
      <Link href="/" className="auxNav arrowback" aria-label="Back to directory">
        <ArrowLeft className="text-[2rem]" />
      </Link>
      <Title className="title m0 p0" text="Not*found" noAnimation />
      <div className="moreabout">
        <p>
          This page doesn’t exist — or the plugin hasn’t been reviewed yet.{" "}
          <Link href="/" className="link">
            Browse the directory
          </Link>{" "}
          or{" "}
          <Link href="/submit" className="link">
            submit a plugin for review
          </Link>
          .
        </p>
      </div>
    </>
  );
}
