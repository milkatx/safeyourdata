import type { Metadata } from "next";
import Link from "next/link";
import Title from "@/components/Title";
import { GITHUB_URL, UPSTREAM_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Safe Your Data exists: transparency around privacy and security in design plugins and assets.",
};

export default function AboutPage() {
  return (
    <>
      <Link href="/" className="auxNav arrowback" aria-label="Back to directory">
        ←
      </Link>

      <Title className="title m0 p0" text="Safe your*data is a" noAnimation />

      <p className="f1 extend m-0">
        public directory that explains how design plugins and assets handle
        your data — so designers can make informed decisions.
      </p>

      <div className="moreabout">
        <h3>Why does this project exist?</h3>
        <p>
          Design workflows increasingly run through third-party plugins and
          assets. They read our files, our content, sometimes our clients’
          unreleased work — and there is very little transparency about what
          they can access, which permissions they request, and where that data
          goes. Data privacy has become a real professional responsibility for
          designers, yet the information needed to exercise it is scattered,
          vague, or simply missing.
        </p>

        <h3>What is the mission?</h3>
        <p>
          Helping designers make informed decisions. We don’t claim a plugin is
          “good” or “bad”. Instead, we document what data it can access, which
          permissions it requests, whether it communicates with external
          services, APIs, databases, AI providers, analytics platforms or cloud
          storage — and we clearly separate what is <strong>verified</strong>,
          what is <strong>observed</strong>, what is <strong>inferred</strong>,
          and what remains <strong>unknown</strong>. Read more on{" "}
          <Link href="/how-we-review" className="link">
            how we review
          </Link>
          .
        </p>

        <h3>What do we stand for?</h3>
        <ul>
          <li>Transparency — conclusions are never overstated.</li>
          <li>Community — reviews are open to scrutiny and contribution.</li>
          <li>Open source — the whole project is public and forkable.</li>
          <li>Trust — earned by showing our evidence, not by claiming authority.</li>
          <li>Education — helping the design community understand data privacy.</li>
        </ul>

        <h3 id="open-source">Open source</h3>
        <p>
          This project is open source. Everyone can contribute — issues and
          pull requests are welcome, whether it’s a new review, a correction,
          or code.
        </p>
        <ul>
          <li>
            <a className="link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>
          </li>
          <li>
            <a
              className="link"
              href={`${GITHUB_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Issues
            </a>
          </li>
          <li>
            <a
              className="link"
              href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribution guide
            </a>
          </li>
          <li>
            <a
              className="link"
              href={`${GITHUB_URL}/blob/main/LICENSE`}
              target="_blank"
              rel="noopener noreferrer"
            >
              License
            </a>
          </li>
        </ul>

        <h3 id="credits">Credits</h3>
        <p>
          This project is built upon the incredible open-source project{" "}
          <a className="link" href={UPSTREAM_URL} target="_blank" rel="noopener noreferrer">
            Brazilians Who Design
          </a>
          , created by Zé Fernandes and contributors.
        </p>
        <p>
          We adapted its architecture to create a public directory focused on
          transparency around privacy and security in design plugins and
          assets. We sincerely thank the creators for making their work openly
          available.
        </p>
        <p>
          Original repository:{" "}
          <a className="link" href={UPSTREAM_URL} target="_blank" rel="noopener noreferrer">
            github.com/zehfernandes/brazilianswhodesign
          </a>
        </p>
      </div>
    </>
  );
}
