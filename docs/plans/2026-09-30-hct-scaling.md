# Targeted HCT additions

1. Verify the scaling sources and figure rights. Use three original flow-topology schematics and one unchanged published pressure-scaling figure.
2. Preserve the guide layout; insert scaling as Section 04, renumber downstream sections, and render section-local Sources from Markdown. Document the figure syntax.
3. Build and check equations, local/external links, responsive figures, accessibility, and publishing. Commit and deploy main, then verify the public page.

## Source verification

- John, J. P. & Donzis, D. A. (2024), *Physics of Fluids* 36, 106121, DOI 10.1063/5.0218585. Publisher-formatted article: https://d-nb.info/1373498471/34. Article page 1 explicitly licenses all content under CC BY 4.0 except where otherwise noted. Figure 2 has no separate rights restriction. Retain both panels, all axes, and the legend; credit authors, DOI, figure number, and license directly below.
- Figure 2 compares normalized pressure variance against turbulent Mach number with a renormalized statistic against D = delta sqrt(1 + delta²) / Mt. The second vertical axis also changes; the caption must say so. The equipartition factor F and dilatational Mach number enter the renormalization. Do not imply that only the horizontal axis changes.
- Donzis, D. A. & Jagannathan, S. (2013), *Journal of Fluid Mechanics* 733, 221–244, DOI 10.1017/jfm.2013.445. Verified Cambridge publisher page and author-hosted published PDF https://tacl.tamu.edu/wp-content/uploads/sites/36/2018/02/DJ2013.pdf. Its simulations use solenoidal forcing; do not attribute a variable-forcing study to this paper.
- Pope, S. B. (2000), *Turbulent Flows*, Cambridge University Press, DOI 10.1017/CBO9780511840531. Verified publisher metadata at https://www.cambridge.org/highereducation/books/turbulentflows/C58EFF59AF9B81AE6CFAC9ED16486B3A.
- Existing guide sources were verified in 2026-09-30-hct-source-verification.md.

## Notation

Mt uses the three-component rms velocity magnitude, consistently with Sections 01 and 04 and the Donzis papers. Re_lambda uses a one-component rms velocity. The kinetic-energy spectrum uses sqrt(rho / mean rho) u, giving energy per unit mean mass; orthogonal Helmholtz decomposition of this weighted field supplies an additive modal spectrum. Helmholtz decomposition of unweighted u supplies the delta parameter, not an automatic density-weighted energy split.

## Validation

Local build, content tests, Markdown/MDX publishing tests, and internal-link checks pass. Browser checks pass at 1440, 768, 390, and 320 px, including no-JavaScript rendering, keyboard navigation, images, and print. Axe reports zero WCAG A/AA violations on desktop and mobile. New DOIs and the CC BY license are also confirmed through registered Crossref metadata. External checks find no missing pages; five publisher endpoints reject automated fetches with HTTP 403 (four Annual Reviews pages and the AIP article), with valid DOI targets and publisher/primary-source metadata verified independently. The open published AIP PDF is linked alongside its DOI.
