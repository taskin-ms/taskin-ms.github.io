# Editing the website

Open a content file on GitHub, click the pencil, edit, and **Commit changes** to `main`. GitHub Actions rebuilds and publishes the website, normally within 1–2 minutes. No HTML or local software is required.

| Change | File |
|---|---|
| Homepage and bio | [pages/home.md](pages/home.md) |
| Entire compressible-turbulence guide | [pages/fieldbook.md](pages/fieldbook.md) |
| Name, email, navigation, footer | [settings/site.yaml](settings/site.yaml) |
| Research notes | [notes/](notes/) |

## Edit the field guide

Text between `---` lines supplies the title, introduction, and five short navigation labels. The body is ordinary Markdown. Keep the five `## 01 — …` through `## 05 — …` headings and the final `## References`. Their numbered headings automatically create the sections and navigation; `###` headings create subsections. The links `#section-01` through `#section-05` remain stable when titles change.

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

## Add a research note

Copy [note.md](examples/note.md) into `notes/` with a descriptive filename. Fill in `title` and `intro`, write the body, and set `draft: false` to publish. Notes automatically appear alphabetically under **Derivations** in Section 02. Their headings generate a contents menu. `my-derivation.md` publishes at `/hct/notes/my-derivation.html`.

Use `.md` for normal notes. For components, copy [note.mdx](examples/note.mdx). Both formats use the same layout; MDX additionally supports `<Equation>`, `<Callout>`, and `<Disclosure>`. These render at build time. Native disclosures work without browser JavaScript; arbitrary React event handlers do not make an MDX component interactive.

`draft: true` excludes a note and its link from the website. Draft source is still public in this GitHub repository.

## Add another page

Copy [page.md](examples/page.md) into `pages/`. Set the title, description, and a unique `permalink`. `navigation: true` adds it to the header automatically. Markdown and MDX bodies are supported.

## Publishing errors and undo

Open the failed [Actions run](https://github.com/taskin-ms/taskin-ms.github.io/actions) and read **Build** or **Check**. Invalid math, broken internal links, and changes to the five-section structure are checked. The previous successful website stays online if a build fails.

For undo, open a file's **History**, copy the previous text, and commit it as a new edit. The old portfolio is preserved on `archive/decommissioned-portfolio-2026-09`.
