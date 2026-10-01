# Research fieldbook design system

## Reference and adaptation

Foundation: [Cohere analysis in VoltAgent's awesome-design-md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/cohere/DESIGN.md), inspected 2026-09-30. Its large geometric display typography, soft mineral surfaces, pill actions, and rule-separated research lists fit this brief better than IBM's corporate system or Linear's dark product canvas. This is an original adaptation, not a reproduction or an affiliation with Cohere.

Retain: confident display/body contrast, spacious composition, rounded media, open research rows, restrained motion. Replace proprietary typography with self-hosted Manrope and Roboto Mono. Replace corporate colors with a light petal/mineral palette. Remove marketing claims, trust logos, dark product bands, and fabricated console data.

## Palette

| Role | Value | Use |
|---|---|---|
| Paper | #fbf8fa | Main reading surface |
| Petal | #f0e3eb | Media and featured reading field |
| Mineral | #e8dfed | Secondary illustration field |
| Ink | #28202d | Headings and body |
| Secondary ink | #625569 | Metadata and captions |
| Mulberry | #743752 | Links, active filters, focus |
| Mulberry pressed | #50243a | Pressed action |
| Structural rule | #c7b8c4 | Section division |
| Control outline | #88768b | Input and inactive-control boundaries |

Color is never the sole signal. Active buttons have aria-pressed and a visible selected mark; links are underlined in prose. No gradients, glow, transparency behind text, or pastel-colored body copy. Check actual computed contrast, not just token pairs. Body target 7:1 where possible, metadata at least 4.5:1; interactive boundaries at least 3:1.

## Type and geometry

Manrope: display 400, body 400, UI 500/600. Roboto Mono: figure labels and short research identifiers only. Body 18px, line-height 1.65; metadata 14px, line-height 1.5. Hero 52–100px via clamp; section 32–48px. No ultra-light weights. Reading width 66ch. Numeric labels use tabular figures.

Max width 1328px, desktop gutter 64px, mobile 24px (20px below 380px). Eight-pixel spacing base. Sections breathe at 80–112px; related controls stay within 16–24px. Media radius 24px; primary actions pill-shaped; inputs radius 8px. No shadows. Research resources are rows, not a wall of identical cards.

## Signature

Original, explicitly schematic flow illustrations: a shock line above a wall, a boundary-layer envelope, and streamwise ribbons. Petal and mineral volumes create softness; sharp scientific linework supplies precision. Figures have descriptive alternatives and captions distinguishing illustration from numerical evidence. No fake Mach values, fake datasets, or fictitious results.

## Interaction and projection

All controls at least 44px high. Keyboard focus: 3px mulberry outline, 4px offset. Hover only changes color, surface, or arrow position. Motion below 240ms, transform/opacity only. Respect reduced motion. Core resources and navigation work without JavaScript. Filters update result count and shareable URL; zero results offer one reset action. Narrow screens stack rows and navigation without hiding the HCT entry point.

An explicit presentation mode increases small type and strengthens rules. It persists on this device but has a visible pressed state. Default contrast must already be strong. Print styles remove controls and preserve titles, annotations, and source destinations.
