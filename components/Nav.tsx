import Link from "next/link";

export default function Nav() {
  return (
    <nav aria-label="Main">
      <ul className="auxNav flex list-none p-0 m-0">
        <li className="mr-[2.2rem]">
          <Link href="/about" className="text-white transition-colors hover:text-[#757575]">
            About
          </Link>
        </li>
        <li className="mr-[2.2rem]">
          <Link
            href="/how-we-review"
            className="text-white transition-colors hover:text-[#757575]"
          >
            How We Review
          </Link>
        </li>
        <li className="mr-[2.2rem]">
          <Link href="/submit" className="text-white transition-colors hover:text-[#757575]">
            Submit Plugin
          </Link>
        </li>
      </ul>
    </nav>
  );
}
