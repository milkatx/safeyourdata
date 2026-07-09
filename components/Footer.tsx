import Link from "next/link";
import { GITHUB_URL, UPSTREAM_NAME, UPSTREAM_URL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#363636] pt-8 pb-12 text-sm text-[#757575]">
      <nav aria-label="Footer">
        <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-2 p-0">
          <li>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
          </li>
          <li>
            <Link href="/how-we-review" className="transition-colors hover:text-white">
              How We Review
            </Link>
          </li>
          <li>
            <Link href="/submit" className="transition-colors hover:text-white">
              Submit Plugin
            </Link>
          </li>
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>
      <p className="mt-6 mb-0">
        Forked from{" "}
        <a
          href={UPSTREAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {UPSTREAM_NAME}
        </a>
        . Adapted for plugin privacy and security reviews.
      </p>
    </footer>
  );
}
