# Taskin Mehereen — research fieldbook

A static research site centered on hypersonic compressible turbulence. The [HCT fieldbook](https://taskin-ms.github.io/hct/) brings together foundational theory, scaling and modeling papers, public datasets, aerospace perspectives, and worked mathematical notes.

## Work locally

Use Node.js 22 or newer. There are no npm dependencies to install.

```sh
npm run build
npm test
npm start
```

Open http://127.0.0.1:4173. The server is local only. Generated HTML is committed so GitHub Pages needs no build tools.

## Update the library

Edit `hct/resources.json`, then run `npm run build` and `npm test`. Each entry needs a stable ID, title, authors, year, venue, topic, format, label, access information, tags, source URL, description, and scope/reading cues. Use one of these topics:

| Topic | Section |
|---|---|
| `theory` | Basic theory |
| `frontier` | Research frontiers: scaling, DNS, LES, ML |
| `data` | Datasets and verification |
| `aero` | The aerospace perspective |
| `math` | Mathematical derivations |

Formats are `book`, `paper`, `preprint`, `dataset`, `reference`, and `note`. Verify bibliographic details against original sources. Describe dataset coverage and available quantities accurately; distinguish preprints and project overviews from established results. Add local study notes under `hct/notes/` and cite their sources.

Page introductions live in `index.html` and `hct/index.html`. Resource rows between the library markers are generated; edit the JSON rather than those rows. `styles.css` contains the design tokens and responsive styles. `script.js` handles search, combined filters, shareable URLs, and presentation mode. Reading and navigation also work without JavaScript.

## Publish updates

GitHub Pages serves the root of **`redesign/hct-research-library`**. A push to that branch triggers a deployment to https://taskin-ms.github.io. Check the repository's Actions tab for deployment status; publication takes a short time after each push. The original `main` branch remains available for reference. An unlinked copy of the earlier site is preserved under `archive/`.

## Browser checks

`tests/browser.js` exercises search, filters, keyboard use, presentation preference, responsive layouts, the no-JavaScript fallback, MathML, and recovery from missing pages. Run it with the installed Playwright CLI against the local server:

```sh
playwright-cli -s=hct open http://127.0.0.1:4173
playwright-cli -s=hct run-code --filename=tests/browser.js
```

The same checks use the public site when the browser is first navigated to https://taskin-ms.github.io/hct/. Screenshots are saved under ignored `artifacts/`. `tests/accessibility.js` additionally expects an axe-core browser bundle at `artifacts/axe.min.js` and audits the three reading pages at desktop and mobile widths. Automated checks supplement manual review of keyboard focus, reading order, text scaling, and contrast.

## Design and attribution

The visual direction adapts [Cohere's design reference in awesome-design-md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/cohere/DESIGN.md) to a light petal/mineral palette, strong ink contrast, and an open research bibliography. See `DESIGN.md` for tokens and `PRODUCT.md` for editorial principles. The site makes no claim of affiliation with Cohere.

Manrope and Roboto Mono are self-hosted under `assets/fonts/`; their SIL Open Font License files are included. Flow artwork is original and explicitly schematic, rather than numerical evidence. Presentation mode enlarges small text and strengthens structural lines; it is intended to improve meeting-room readability alongside the high-contrast default.
