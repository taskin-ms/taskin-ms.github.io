# Research fieldbook design system

## Reference and adaptation

Foundation: [Cohere analysis in VoltAgent's awesome-design-md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/cohere/DESIGN.md), inspected 2026-09-30. Its large geometric display typography, soft mineral surfaces, pill actions, and rule-separated research lists fit this brief better than IBM's corporate system or Linear's dark product canvas. This is an original adaptation, not a reproduction or an affiliation with Cohere.

Retain: display/body contrast, spacious composition, and restrained rules. Use self-hosted Manrope and Roboto Mono with the light petal/mineral palette. The field guide uses one reading column, five numbered sections, and a plain bibliography. Remove marketing claims, card catalogs, and decorative diagrams.

## Palette

| Role | Value | Use |
|---|---|---|
| Paper | #fbf8fa | Main reading surface |
| Petal | #f0e3eb | Media and featured reading field |
| Mineral | #e8dfed | Secondary illustration field |
| Ink | #28202d | Headings and body |
| Secondary ink | #625569 | Metadata and captions |
| Mulberry | #743752 | Links, section numbers, focus |
| Mulberry pressed | #50243a | Pressed action |
| Structural rule | #c7b8c4 | Section division |
| Control outline | #88768b | Input and inactive-control boundaries |

Color is never the sole signal. Links are underlined in prose. No gradients, glow, transparency behind text, or pastel body copy. Check computed contrast: body target 7:1 where possible, secondary text at least 4.5:1.

## Type and geometry

Manrope: display 400, body 400, UI 500/600. Roboto Mono: figure labels and short research identifiers only. Body 18px, line-height 1.65; metadata 14px, line-height 1.5. Hero 52–100px via clamp; section 32–48px. No ultra-light weights. Reading width 66ch. Numeric labels use tabular figures.

Keep the existing wide layout for the homepage. The guide's outer width is capped at 1008px with responsive gutters; paragraphs stay within 72ch. Five numbered section headings, understated equation rules, and hanging bibliography entries establish hierarchy. No shadows or badges.

## Signature

Typography, numbered chapters, and equations supply the guide's visual identity. The prior schematic is removed. Add a diagram only when it explains specific physics; never use fabricated simulation results or decorative telemetry.

## Interaction and projection

Section navigation has five native anchor links with 44px target height. Keyboard focus uses a 3px mulberry outline and 4px offset. The full guide, citations, equations, and navigation work without browser JavaScript. Narrow layouts wrap navigation; long equations scroll within their own container.

Default contrast must work on a projector without a presentation toggle. Print styles remove site navigation and preserve all five sections, equations, and references.

## Content and templates

Keep the visual system independent of authoring format. Markdown and MDX content receive the same typography, palette, navigation, and layouts. Shared templates own the HTML; content files own the text. MDX components render at build time and follow the existing tokens. Notes and resources should state their methods and scope directly, without slogans or generic motivational copy.
