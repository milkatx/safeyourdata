import type { Metadata } from "next";
import Link from "next/link";
import Title from "@/components/Title";
import { ArrowLeft } from "@/components/Arrows";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit Plugin",
  description:
    "Request a privacy and security review for a design plugin or asset that isn't in the directory yet.",
};

export default function SubmitPage() {
  return (
    <>
      <Link href="/" className="auxNav arrowback" aria-label="Back to directory">
        <ArrowLeft className="text-[2rem]" />
      </Link>

      <Title className="title m0 p0" text="Submit a*plugin" noAnimation />

      <div className="moreabout">
        <p>
          Missing a plugin or asset you’d like reviewed? Fill in what you know
          — the form opens a prefilled GitHub issue where the review request is
          tracked publicly.
        </p>
        <SubmitForm />
      </div>
    </>
  );
}
