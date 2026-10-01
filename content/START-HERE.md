# Editing the website

**Change text here, not HTML.** Open a file on GitHub, click the pencil, edit it, and choose **Commit changes** to `main`. The website rebuilds automatically. A successful update normally takes about 1–2 minutes; check [Actions](https://github.com/taskin-ms/taskin-ms.github.io/actions) if it takes longer.

## Find what you want to change

| Change | File or folder |
|---|---|
| Homepage text and bio | [pages/home.md](pages/home.md) |
| Resource-page introduction and reading order | [pages/fieldbook.md](pages/fieldbook.md) |
| Name, email, navigation, footer | [settings/site.yaml](settings/site.yaml) |
| Add or edit a resource | [resources/](resources/) |
| Add or edit a research note | [notes/](notes/) |

Text between the opening `---` lines contains labels and details. Text below it is ordinary Markdown. Preserve the labels on the left of `:` and edit the values on the right. Use quotes around values containing `:`. For multi-line text, keep the indentation below `|`.

## Add a resource

1. Open [the resource example](examples/resource.md), choose **Code** or **Raw**, and copy the full file.
2. In the appropriate resource folder, choose **Add file → Create new file**. Give it a descriptive name ending in `.md`, such as `new-velocity-transformation.md`.
3. Fill in the title, authors, source link, and one-sentence summary. Write reading notes below `---`. Set `draft: false` to publish, then commit.

| Folder | Put these here |
|---|---|
| `resources/theory/` | Books and foundational theory |
| `resources/frontier/` | Scaling, DNS, LES, and machine-learning papers |
| `resources/data/` | Datasets and access tools |
| `resources/aero/` | Aerospace studies and research overviews |
| `resources/math/` | External mathematical references |

**The website handles grouping, order, numbering, search, and counts.** Theory puts books first. Research frontiers sorts by year, newest first. Ties and other sections sort by title. You never need numbering in filenames or a separate index file.

Optional resource details: `year`, `format`, `venue`, `access`, `label`, and `keywords`. Formats: `book`, `paper`, `preprint`, `dataset`, `reference`, `note`. If you omit format, the data folder uses `dataset`; other folders use `reference`. Add keywords as a list, for example `keywords: ["Favre", "wall cooling"]`.

Keep existing filenames when editing: their names form stable link anchors. To move a resource to another area, change its folder. To remove one, delete its file. Use `draft: true` to keep a resource out of the public library while you work on it. Draft content remains readable in this public GitHub repository.

## Add a research note

Copy [note.md](examples/note.md) into `notes/` with a new filename. Fill in `title` and `intro`; write the body below `---`. Set `draft: false` when ready.

The note appears in **Mathematical derivations automatically**. Headings become its contents menu. A file named `my-derivation.md` publishes at `/hct/notes/my-derivation.html`. Do not create a duplicate resource entry for it.

Use `.md` for normal notes. Display equations use a fenced `math` block with LaTeX, as shown in the example. No HTML is needed.

For reusable components, copy [note.mdx](examples/note.mdx) instead. Both `.md` and `.mdx` use the same page layout. MDX additionally supports `<Equation>`, `<Callout>`, and `<Disclosure>`; the example shows each one. Components render when the site builds. Browser interactivity uses native controls or maintained client JavaScript; adding arbitrary React event handlers alone does not make a component interactive.

## Add another page

Copy [page.md](examples/page.md) into `pages/`. Change its title, description, and unique `permalink`. Set `navigation: true` to add it to the header automatically. Keep navigation short so it stays readable on mobile. Use Markdown or MDX for the body.

## If an edit does not publish

Open the failed [Actions run](https://github.com/taskin-ms/taskin-ms.github.io/actions) and expand **Build** or **Check**. Resource errors name the file and missing field. Fix that file and commit again. The last successful website stays online while a build fails.

For a quick undo, open the file's **History**, copy the previous text, and save it as a new edit. The decommissioned portfolio is preserved separately on `archive/decommissioned-portfolio-2026-09`.

## Markdown basics

```md
## Heading

A paragraph with **bold text**, *emphasis*, and a [link](https://example.com).

- A list item
- Another item
```

Research copy should name the observable, method, conditions, and limitations. Give the reader information they can use; avoid slogans and claims of expertise.
