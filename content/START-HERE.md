# Editing the website

Open a content file on GitHub, click the pencil, edit, and **Commit changes** to `main`. GitHub Actions rebuilds and publishes the website, normally within 1–2 minutes. No HTML or local software is required.

| Change | File |
|---|---|
| Homepage and bio | [pages/home.md](pages/home.md) |
| Entire compressible-turbulence guide | [pages/fieldbook.md](pages/fieldbook.md) |
| Name, email, navigation, footer | [settings/site.yaml](settings/site.yaml) |
| Research notes | [notes/](notes/) |

## Edit the field guide

Text between `---` lines supplies the title, introduction, and six short navigation labels. The body is ordinary Markdown. Keep the six `## 01 — …` through `## 06 — …` headings. Their numbered headings automatically create the sections and navigation; `###` headings create subsections. The links `#section-01` through `#section-06` remain stable when titles change.

End each section with `### Sources` and a short Markdown list of full citations. The layout gives these lists smaller type and unique anchors automatically. There is no global bibliography.

Edit explanations, add citations, or add a dataset directly in the appropriate section. There is no separate catalog or metadata form. Reference links are defined once at the end of the file:

```md
Pressure–dilatation exchanges kinetic and internal energy ([Mittal & Girimaji, 2019][mg]).

[mg]: https://doi.org/10.1103/PhysRevFluids.4.042601
```

Verify bibliographic and technical claims against the original source before publishing. Inline equations use `$…$`; display equations use a fenced `math` block:

````md
Density $\rho$ evolves through mass conservation.

```math
\partial_t\rho+\partial_j(\rho u_j)=0
```
````

## Add or replace a scientific figure

Upload its file to `assets/figures/`, then place this block where it belongs in the guide. Copy the image's pixel dimensions into `width` and `height`. All figures are responsive and open at full size when selected. Use `kind: scaling` for a larger plot; omit it for a canonical-flow schematic.

````md
```figure
src: /assets/figures/mixing-layer.svg
alt: "Two streams meet and form a growing turbulent shear layer."
width: 600
height: 300
caption: "Original mixing-layer schematic ([Lele, 1994][lele])."
```
````

For a published image, put its paper link, figure number, authors, and verified reuse license in the caption. Keep the axes and legend intact. Attribution for existing assets is recorded in `assets/figures/README.md`.

## Add a research note

Copy [note.md](examples/note.md) into `notes/` with a descriptive filename. Fill in `title` and `intro`, write the body, and set `draft: false` to publish. Notes automatically appear alphabetically under **Derivations** in Section 02. Their headings generate a contents menu. `my-derivation.md` publishes at `/hct/notes/my-derivation.html`.

Use `.md` for normal notes. For components, copy [note.mdx](examples/note.mdx). Both formats use the same layout; MDX additionally supports `<Equation>`, `<Callout>`, and `<Disclosure>`. These render at build time. Native disclosures work without browser JavaScript; arbitrary React event handlers do not make an MDX component interactive.

`draft: true` excludes a note and its link from the website. Draft source is still public in this GitHub repository.

## Add another page

Copy [page.md](examples/page.md) into `pages/`. Set the title, description, and a unique `permalink`. `navigation: true` adds it to the header automatically. Markdown and MDX bodies are supported.

## Publishing errors and undo

Open the failed [Actions run](https://github.com/taskin-ms/taskin-ms.github.io/actions) and read **Build** or **Check**. Invalid math, missing figure captions or alt text, broken internal links, and changes to the six-section structure are checked. The previous successful website stays online if a build fails.

For undo, open a file's **History**, copy the previous text, and commit it as a new edit. The old portfolio is preserved on `archive/decommissioned-portfolio-2026-09`.
