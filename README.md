# Taskin Mehereen — research website

**To edit the website, open [content/START-HERE.md](content/START-HERE.md).** All editable text, notes, and site settings live in `content/`. Saving changes to `main` automatically builds and publishes [the website](https://taskin-ms.github.io).

| Task | Open |
|---|---|
| Edit homepage and bio | [content/pages/home.md](content/pages/home.md) |
| Edit the guide, citations, or datasets | [content/pages/fieldbook.md](content/pages/fieldbook.md) |
| Write a research note | [content/notes/](content/notes/) |
| Change contact details | [content/settings/site.yaml](content/settings/site.yaml) |

No HTML editing or local software is required for content changes. The guide is one Markdown file; numbered headings generate its section navigation. New notes appear alphabetically under Derivations automatically. Draft notes remain unpublished; source files in this repository are public.

## Development

Use Node.js 22 or newer.

```sh
npm ci
npm run build
npm test
npm start
```

Local preview: http://localhost:4173. `npm start` watches content and template edits. `npm run build` clears and regenerates `_site/`; generated HTML is not committed.

Eleventy builds Markdown into shared Nunjucks layouts under `templates/`. MDX is supported for notes and page bodies, with components under `templates/mdx/`. Plain `.md` is the default. KaTeX renders inline and display equations to native MathML at build time. The guide ships no browser JavaScript. Shared styling lives in `styles.css`, with automatic cache invalidation when styles change.

`.github/workflows/site.yml` installs locked build dependencies, generates the site, runs checks, and publishes `_site/` through GitHub Pages. Only a successful build of `main` deploys. Other builds run checks without changing the public website. If a content edit fails validation, the previous deployment remains available.

Tests cover five-section structure, Markdown math, citation links, MDX rendering, automatic note indexing and order, draft exclusion, and generated local links. `tests/browser.js` and `tests/accessibility.js` provide Playwright checks; accessibility uses an axe-core bundle at ignored `artifacts/axe.min.js`.

## Repository history

`main` contains the current site. The earlier portfolio is preserved at [archive/decommissioned-portfolio-2026-09](https://github.com/taskin-ms/taskin-ms.github.io/tree/archive/decommissioned-portfolio-2026-09) and is not included in deployments.

## Design and attribution

See [DESIGN.md](DESIGN.md) and [PRODUCT.md](PRODUCT.md) for editorial and visual principles. The visual reference is [Cohere in awesome-design-md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/cohere/DESIGN.md). There is no affiliation with Cohere. Manrope and Roboto Mono are self-hosted with their SIL Open Font License files.
