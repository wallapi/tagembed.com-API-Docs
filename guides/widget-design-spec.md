# Widget design spec — tokens, layouts, states

The visual half of the brief for anything built on the Tagembed Developer API
(v3): the design tokens and the theme catalogue their values come from, the two
default layouts, the card treatment and the states a feed has to handle. The data half — endpoints, envelope, field names,
caching, the token rule — lives in [llms.txt](../llms.txt); this file never
contradicts it.

Point an AI at it instead of pasting a hundred lines of CSS into every prompt:

```
Design spec (tokens, layouts, states) - follow it exactly:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
```

The design itself comes from the theme the user picked in the [theme catalogue](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md)
(`guides/themes/`, beside this file) — read that first (section 2). Only if the
AI can reach neither file are the five fallback brand colours worth pasting
inline: `--tbd-indigo:#283da8`, `--tbd-blue:#4462e8`,
`--tbd-blue-ink:#3350d6`, `--tbd-blue-lite:#8ea2fb`, `--tbd-brand:#526ff9`.

---

## 1. Scoping — the page is yours, but keep it self-contained

- The page is server-rendered and you own it, so `:root` and `<body>` are
  yours to style. Every token still carries the `--tbd-` prefix, so the same
  CSS can later drop into a template that has its own variables without
  colliding.
- Prefix every class (`.tbd-*`). Do not load a CSS framework, and do not pull
  a stylesheet over the network: the CSS ships **inside** `server.js`,
  **inside** `index.php` and **inside** `preview.html` — whichever of them the
  build has — in one `<style>` block, because each deliverable is meant to be a
  file you can drop somewhere and run. The same block in every one, so the preview is worth trusting and a
  restyle cannot land in one and miss the others.
- Set the font on `:root`, from the theme's font, and load that family from
  Google Fonts only behind a fallback stack that still looks right when it
  does not load.
- Asked to render into a section of a site that already exists? Then put the
  tokens on that section's own root instead of `:root`, and keep every
  selector under its class — the surrounding page has its own CSS.

## 2. Design tokens — the values come from the theme catalogue

The token **names** are the contract: `--tbd-bg`, `--tbd-surface`, `--tbd-ink` and the
rest below, every class under `.tbd-`, and the rules in sections 3–8. The
**values** are not yours to invent — they come from one theme in the
[theme catalogue](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md), the themes Tagembed itself renders widgets with.
Read that file first; the palette further down is only what you fall back to
when you cannot.

### Themes — where the design comes from

The catalogue is a folder, `guides/themes/`: 19 themes (14 social, 5 review),
each with a thumbnail PNG (to pick from), a preview HTML of the finished
widget in `guides/previews/` (to build from), a *Look* line describing its
layout in words, and a *Values* line. Fetch its README raw:

```
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
```

**Ask before you write any CSS.** If the user already named a theme, use it.
If not, show them the catalogue's theme picker — the thumbnails file as an HTML
artifact, names and thumbnails — and ask which one they want; the build prompts do this as
their first question. Never pick one silently. Only when the prompt tells you
not to ask, pick one — a social theme for a social widget, a review theme for
reviews — and say in one line which one you used.

That theme then decides two things:

- **The layout** — which parts a card shows, in what order, and how the cards
  are arranged — comes from its preview HTML: copy its card markup and
  CSS, with the real posts in place of the samples. The *Look* line says the
  same in words. Sections 4 and
  5 are how the reel and the mosaic are built when the theme is one of them
  (Reels is the reel; the card themes that say "mosaic" are the mosaic);
  every other layout keeps section 3's card treatment and section 6–8's rules.
- **The value of every token** comes from the preview's `:root`; the
  *Values* line is the same set in words, and where they differ the preview
  wins. The names, the
  `--tbd-` prefix and sections 3–8 stay exactly as they are, so one theme
  reskins the whole page:

```
Values entry        →  what it sets
page #…             →  --tbd-bg
card #…             →  --tbd-surface   (not set: fall back to the page colour)
text #…             →  --tbd-body
author #…           →  --tbd-ink       (not set: fall back to the text colour)
font, weight, size  →  --tbd-font, its weight, the post text size
card radius         →  --tbd-radius
image radius        →  the image corner radius
gap                 →  --tbd-gap — the gutter between cards
padding             →  the card padding
text left/centred   →  the card's text-align
clamp N lines       →  -webkit-line-clamp: N; "no clamp" means none
image ratio         →  natural keeps each image's own ratio; square, 16:9,
                       4:3, 9:16 crop to it with object-fit: cover
```

The thumbnail is only for the user to pick from; never build from it. Where
the preview and a value disagree, follow the preview.

Three rules come with it:

- **The muted tone is derived, never taken.** No theme carries a muted text
  colour. Blend the text colour toward the card colour and stop at the last
  step still above 4.5:1.
- **Raise any pair too faint to read** — judged from the values, no contrast
  script or audit. These are production values tuned for a widget whose text
  sits over media behind a scrim, so some are not readable as plain text on a
  card: `Slider` ships `#ffffff` text on its `#fafafa` card (1.04:1). Keep the
  theme's own colour wherever it clears AA; otherwise walk it toward black or
  white until it does, and note in a comment what you changed and why.
- **A theme is the entire skin.** Exactly as with the default palette, a themed
  build carries no `prefers-color-scheme` remap, no `data-theme` attribute and
  no toggle — one set of values, the same page for every reader.

### Tokens no theme sets — always these

A theme sets the page, card, text, font, radius and spacing values. These it
does not, so every build declares them as they are, alongside the theme's:

```css
/* Brand */
--tbd-indigo:    #283da8;  /* headings, active states             */
--tbd-blue:      #4462e8;  /* links, primary accents              */
--tbd-blue-ink:  #3350d6;  /* link hover — darker, stays readable */
--tbd-blue-lite: #8ea2fb;  /* gradients and fills ONLY, never text*/
--tbd-brand:     #526ff9;  /* the product CTA blue — fills and buttons,
                              never body text: 4.2:1 on white            */

/* Shape, depth, motion - not in any theme */
--tbd-line:      rgba(9,9,11,.09);    /* hairline card border     */
--tbd-shadow:    0 1px 2px rgba(9,9,11,.05),
                 0 4px 12px rgba(9,9,11,.05);
--tbd-shadow-up: 0 2px 4px rgba(9,9,11,.06),
                 0 12px 28px rgba(9,9,11,.10);  /* card hover     */
--tbd-ring:      0 0 0 3px rgba(68,98,232,.35); /* focus ring    */
--tbd-ease:      150ms cubic-bezier(.2,0,.2,1);

/* Type - not in any theme */
--tbd-text:      15px/1.55;   /* post text                        */
--tbd-meta:      13px/1.4;    /* handle, network, date            */
```

### Fallback palette — only when the themes cannot be read

If the network is blocked and you genuinely cannot fetch the theme catalogue,
say so in one line and use the fallback palette instead — never mixed with a theme's
values:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/design/fallback-palette.md
If that cannot be read either, the five brand colours at the top of this file
are enough.

### One skin — no dark mode

The build ships a single palette. Do **not** add a
`@media (prefers-color-scheme: dark)` remap, a `data-theme` attribute or a theme
toggle: the theme's values are the whole skin, and the page
looks the same whatever the reader's OS is set to.

## 3. Card treatment (the shared baseline)

- `--tbd-surface` background, `--tbd-radius` corners, `--tbd-shadow`, **and** a
  1px `--tbd-line` border — the border is what keeps a card visible against a
  dark page ground, where a shadow alone disappears.
- Hover lifts the card 2px and swaps to `--tbd-shadow-up` over `--tbd-ease`.
- Image flush to the top edge, `object-fit: cover`, with a `--tbd-bg`
  placeholder behind it so the grid never jumps while images load. Explicit
    `width`/`height` plus `loading="lazy" decoding="async"`.
- **Media box.** Every image and video sits in a box with its own background:
  the header gradient (§8) with the network name centred on it in white, and
  the `<img>` alt text set to `color: transparent`. Preview panes (Claude's
  artifact view, ChatGPT canvas) block outside images and video, so there the
  card shows that tile instead of a broken icon; everywhere else the real media
  loads over it.
- **Video posts** render `<video controls muted playsinline preload="none">`
  with the video entry's `cdn_url` as the source and the post's first image as
  the `poster` — never autoplay (§7), no JavaScript.
- Header row: 32px round avatar (`author.avatar_url`, omitted entirely when
  null) beside the author name in `--tbd-ink` at 14px/600. Under it, handle +
  network name + date in `--tbd-muted` at `--tbd-meta`, separated by "·", the
  date wrapped in `<time datetime="…">`.
- Body: `content.text` in `--tbd-body` at `--tbd-text`, clamped to 5 lines
  (`-webkit-line-clamp`) so cards in a row stay comparable in height.
- Footer: the "View post" link in `--tbd-blue`, gaining an underline and
  `--tbd-blue-ink` on hover.
- Responsive to the **container**, not the viewport — the widget may sit in a
  narrow sidebar on a wide screen. Size the grid with a container query (or
  `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`), not a
  viewport media query. Gutter and card padding both `--tbd-gap`.

## 4. Layout A — REEL (default for an embedded widget)

A rail of 9:16 media tiles, for a widget embedded in a page it does not own.
Fetch its full spec only when a reel is asked for:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/design/reel-layout.md

## 5. Layout B — MOSAIC (the card themes, and the default when no theme is set)

A masonry mosaic. It is the default for a section on your own site because it
gets real width,
and a mosaic reads as a mosaic precisely BECAUSE the tiles are different heights.

- Columns via CSS multi-column so heights pack naturally: `columns: 4`,
  `column-gap: --tbd-gap`, every card `break-inside: avoid` with
  `margin-bottom: --tbd-gap`. Step down on **container** width, not viewport:
  4 above 1100px, 3 above 800px, 2 above 520px, 1 below.
- Keep each image's OWN aspect ratio: `width:100%`, `height:auto`, and the real
  `width`/`height` attributes on the `<img>` so nothing reflows as it loads. Do
  NOT crop to a fixed ratio — uniform crops are what turn a widget into a generic
  card grid.
- Card as in §3, but padding `--tbd-gap` on the text half only; the image stays
  flush to the top and side edges.
- Text-only posts become a tinted tile rather than an empty card: the
  `--tbd-indigo` → `--tbd-blue` gradient at 8% opacity over `--tbd-surface`,
  `content.text` at 17px/1.5 in `--tbd-ink`, clamped to 10 lines. These tiles
  give the widget its rhythm — without them a text-heavy feed collapses into gaps.
- Footer row per card: 24px avatar, author name in `--tbd-ink`, network name and
  date in `--tbd-muted` at `--tbd-meta`, the "View post" link in `--tbd-blue`
  pushed right.
- Hover lifts the card 2px to `--tbd-shadow-up` and scales the image inside to
  1.03, clipped by the card's overflow.
- Every image `loading="lazy" decoding="async"`. A widget puts far more media on
  screen at once than a reel does; this is where it pays.

Other layouts — the grids, sliders, collage, single-post and badge themes in
the catalogue, or on request a vertical feed or a full-screen signage view —
all reuse §2 and §3 unchanged. Sliders and carousels are a CSS scroll-snap row
with plain `#id` links for arrows: no JavaScript anywhere in the build.

## 6. States

- **Empty and error states render as real markup on the page.** Never a blank
  body, never a stack trace, and never a page that renders only a header with
  nothing under it.
- **Stale over blank.** When the API call fails, the server keeps serving the
  last successful cached copy (see llms.txt rule 7); the UI shows that copy, not
  an error.
- **Preview fallback.** The server files carry a small inline `SAMPLE_POSTS`
  array (the same posts `preview.html` shows, in the shape of `body.posts`).
  When `ACCESS_TOKEN` is empty, or the API call fails with no cached copy yet,
  the server renders `SAMPLE_POSTS` instead of an error, with a small note:
  "preview data — live posts load once the token is set". The browser never
  fetches anything, on this path or any other, and a token is never on it.
- **The static preview.** The same posts, already expanded into markup, ship as
  `preview.html` — a file that opens from a double-click with no server, no
  build step and no call of any kind. It carries the same note and the same
  CSS as the server deliverable, and it is where this spec gets reviewed
  before a token exists. It wears the same theme as the rest of the build — see
  **Themes** in section 2.
- **Loading.** Skeleton tiles in `--tbd-bg` at the final tile shape, so the
  layout does not jump when posts arrive.

## 7. Accessibility and motion

- Every link and control shows `--tbd-ring` on `:focus-visible`. Never
  `outline: none` without a replacement.
- Under `prefers-reduced-motion`, drop the hover lift, the image scale and every
  transition; never autoplay video — show the poster and a play affordance.
- Keep every text/surface pair at WCAG AA after any restyle — by choosing the
  values, not by running an audit.
- Escape every value you print, and allow only `http(s)` URLs in `href` and
  `src` attributes.

## 8. The page shell

The widget is the content, but it arrives as a whole page, so the frame around
it is part of the build. Keep it quiet: it exists to make the posts look good,
not to compete with them.

- **One header** — the wordmark in the
  `linear-gradient(135deg, var(--tbd-indigo), var(--tbd-blue))` treatment, and a
  single line of context. No hero, no marketing copy, no second accent colour.
- **The page ground is `--tbd-bg`**, the cards `--tbd-surface`, so the mosaic
  reads as one surface instead of floating on bare white.
- **Content max-width ~1200px**, centred, with a 16px minimum side gutter at
  every width.
- **A footer line is enough**: the post count and when the cache last
  refreshed. That one line is what tells them the page is live, and it costs
  nothing to render.
- **One skin, no switching.** No `prefers-color-scheme` remap, no `data-theme`
  attribute and no light/dark toggle anywhere in the build.
- **Responsive to ~400px**, and byte-for-byte the same result from
  `preview.html` and the server deliverable — and from the Node.js and the PHP
  one, when both were asked for.
