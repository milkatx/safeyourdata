# Safe Your Data

**Is your data safe?** A community-driven directory helping designers
understand how plugins and assets handle their data.

Rather than claiming a plugin is "good" or "bad", each review documents what
data the plugin can access, which permissions it requests, whether it talks to
external services, APIs, databases, AI providers, analytics platforms or cloud
storage — and clearly separates what is **verified**, what is **observed**,
what is **inferred**, and what remains **unknown**.

Built with [Next.js](https://nextjs.org/), TypeScript and Tailwind CSS,
powered by a public Google Spreadsheet, and deployed on
[Vercel](https://vercel.com/).

## Credits

This project was originally forked from
[Brazilians Who Design](https://github.com/zehfernandes/brazilianswhodesign),
created by Zé Fernandes and contributors. We adapted its architecture to build
a public directory focused on transparency around privacy and security in
design plugins and assets. We sincerely thank the creators for making their
work open source. The original commit history is preserved in this repository.

## How it works

The entire directory is powered by a **public Google Spreadsheet** — the
single source of truth. The site reads the sheet's CSV export at build time
and revalidates hourly (ISR), so updating the spreadsheet automatically
updates the website. No CMS, no database, no credentials.

When no spreadsheet is configured, the bundled sample data in
[`data/sample.csv`](data/sample.csv) is used, so the project works out of the
box.

The site is also optimized for AI agents following the
[llms.txt](https://llmstxt.org) convention: `/llms.txt` serves a concise
index of all reviews, and `/llms-full.txt` serves the complete review data
as markdown. Both are generated from the same spreadsheet and revalidate
hourly alongside the site.

## Running locally

```
npm install
npm run dev
```

Open `localhost:3000`. That's it — sample data ships with the repo.

## Link your spreadsheet

1. Create a Google Spreadsheet with a header row using the schema below
   (or start from [`data/sample.csv`](data/sample.csv) via File → Import).
2. Share it as **"Anyone with the link can view"**.
3. Copy the ID between `/spreadsheets/d/` and `/edit` in the URL.
4. Create a `.env` file (see [`.env.example`](.env.example)):

```
SHEET_ID="your-spreadsheet-id"
```

### Spreadsheet schema

One row per plugin. Multi-value cells are separated with `;`. Empty cells and
the word `Unknown` render as an explicit "Unknown" state — values are never
guessed. Only rows with `approved` set to `Yes` are published.

| Column | Meaning |
| --- | --- |
| `id`, `slug`, `name` | Identity. `slug` is auto-generated from `name` if empty. |
| `platform`, `category`, `developer`, `pricing` | Directory metadata (Figma, FigJam, Framer, Other…). |
| `logo`, `official_url` | URLs. |
| `description` | One-line description shown in the directory. |
| `risk_level` | `Low`, `Medium`, `High` or `Unknown`. |
| `risk_reason`, `mitigation`, `confidence` | Risk assessment fields. |
| `verification_status` | `Verified`, `Community Review`, `Needs Review` or `Unknown`. |
| `permissions`, `data_accessed` | What the plugin can touch (`;`-separated). |
| `external_services`, `external_apis`, `analytics`, `ai_services`, `cloud_storage` | Where data may go (`;`-separated). |
| `database_connection`, `authentication`, `telemetry`, `cookies` | Scalar findings; `None` is a meaningful reviewed value, distinct from `Unknown`. |
| `privacy_policy`, `terms_of_service`, `github_url`, `support_url` | Resource links. |
| `review_summary`, `tests_performed`, `evidence`, `limitations` | Review methodology. |
| `reviewer`, `reviewed_at`, `updated_at` | Review provenance (ISO dates). |
| `approved` | `Yes` to publish. |

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `SHEET_ID` (and optionally `SITE_URL`) in the project's environment
variables.

## Contributing

Issues and pull requests are welcome — see
[CONTRIBUTING.md](CONTRIBUTING.md). To request a review for a plugin, use the
submit page on the site or open an issue.

## License

[MIT](LICENSE) for the modifications and new work in this repository, with
attribution to the original project preserved — see the [LICENSE](LICENSE)
preamble.
