import Link from "next/link";
import { GITHUB_URL, UPSTREAM_NAME, UPSTREAM_URL } from "@/lib/site";

const internalLinks = [
  { href: "/", label: "Browse Plugins" },
  { href: "/about", label: "About" },
  { href: "/how-we-review", label: "How We Review" },
  { href: "/submit", label: "Submit Plugin" },
  { href: "/about#credits", label: "Credits" },
  { href: "/about#open-source", label: "Open Source" },
] as const;

const externalLinks = [
  { href: GITHUB_URL, label: "GitHub" },
  { href: `${GITHUB_URL}/blob/main/LICENSE`, label: "License" },
  { href: `${GITHUB_URL}/blob/main/PRIVACY.md`, label: "Privacy" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#363636] pt-8 pb-12 text-sm text-[#757575]">
      <nav aria-label="Footer">
        <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-2 p-0">
          {internalLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="transition-colors hover:text-white">
                {label}
              </Link>
            </li>
          ))}
          {externalLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {label}
              </a>
            </li>
          ))}
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
