# Contributing

Thanks for helping make design tooling more transparent. There are three ways
to contribute:

## 1. Request a plugin review

Open a [review request issue](../../issues/new?template=plugin-submission.yml)
(or use the [submit page](https://safeyourdata.vercel.app/submit)). Include the
plugin URL and anything you already know about its data handling.

## 2. Contribute a review

Reviews live in the public Google Spreadsheet (see the
[README](README.md#link-your-spreadsheet) for the schema). Open an issue with
your findings and evidence, and a maintainer will add the row. Ground rules:

- Never overstate conclusions. Label every claim as verified, observed,
  inferred, or unknown.
- Unknown values stay **Unknown** — never guessed.
- Cite your evidence: manifest, policy text, traffic capture, source code.

## 3. Contribute code

- Fork, branch, and open a pull request.
- `npm install && npm run dev` to run locally (sample data works out of the
  box, no env vars needed).
- `npm run build && npm run typecheck` must pass.
- Keep the visual language of the site — it is intentionally faithful to
  [Brazilians Who Design](https://github.com/zehfernandes/brazilianswhodesign),
  the project this one is forked from.
