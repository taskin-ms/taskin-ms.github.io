# Taskin Mehereen — research website

**To edit the website, start with [content/START-HERE.md](content/START-HERE.md).** All editable text, resources, notes, and site settings live in `content/`. Saving changes to `main` automatically builds and publishes [the website](https://taskin-ms.github.io).

| Task | Open |
|---|---|
| Edit homepage and bio | [content/pages/home.md](content/pages/home.md) |
| Edit the resource page | [content/pages/fieldbook.md](content/pages/fieldbook.md) |
| Add a paper, book, or dataset | [content/resources/](content/resources/) |
| Write a research note | [content/notes/](content/notes/) |
| Change contact details | [content/settings/site.yaml](content/settings/site.yaml) |

No HTML editing or local software is required for content changes. The editing guide includes copyable examples. Resource grouping, sorting, numbering, search metadata, and counts are generated. New notes appear in the library automatically. Drafts remain unpublished; remember that source files in this repository are public.

## Development

Use Node.js 22 or newer.

```sh
npm ci
npm run build
npm test
npm start
```

Local preview: http://localhost:4173. `npm start` watches content and template edits. `npm run build` clears and regenerates `_site/`; generated HTML is not committed.

Eleventy builds Markdown into shared Nunjucks layouts under `templates/`. MDX is also supported for research notes and page bodies, with reusable components under `templates/mdx/`. Plain `.md` is the default authoring format. MDX renders at build time; its runtime is not shipped to readers. Interactive components use native HTML or maintained client JavaScript. Styles and the library's browser behavior are in `styles.css` and `script.js`.

`.github/workflows/site.yml` installs locked build dependencies, generates the site, runs checks, and publishes `_site/` through GitHub Pages. Only a successful build of `main` deploys. Other builds run checks without changing the public website. If a content edit fails validation, the previous deployment remains available.

Tests cover filters, automatic sorting, Markdown math, MDX rendering, automatic note indexing, draft exclusion, counts, and generated local links. `tests/browser.js` and `tests/accessibility.js` provide additional Playwright checks; the latter uses an axe-core bundle at ignored `artifacts/axe.min.js`.

## Repository history

`main` contains the current site. The earlier portfolio is preserved at [archive/decommissioned-portfolio-2026-09](https://github.com/taskin-ms/taskin-ms.github.io/tree/archive/decommissioned-portfolio-2026-09) and is not included in deployments.

## Design and attribution

See [DESIGN.md](DESIGN.md) and [PRODUCT.md](PRODUCT.md) for the design and editorial principles. The visual reference is [Cohere in awesome-design-md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/cohere/DESIGN.md). There is no affiliation with Cohere. Manrope and Roboto Mono are self-hosted with their SIL Open Font License files. The flow illustration is schematic, not numerical data.
