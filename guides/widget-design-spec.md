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

The design itself lives in [themes.json](themes.json) beside this file — read
that first (section 2). Only if the AI can reach neither file are the five
fallback brand colours worth pasting inline: `--tbd-indigo:#283da8`, `--tbd-blue:#4462e8`,
`--tbd-blue-ink:#3350d6`, `--tbd-blue-lite:#8ea2fb`, `--tbd-brand:#526ff9`.

---

## 1. Scoping — the page is yours, but keep it self-contained

- The page is server-rendered and you own it, so `:root` and `<body>` are
  yours to style. Every token still carries the `--tbd-` prefix, so the same
  CSS can later drop into a template that has its own variables without
  colliding.
- Prefix every class (`.tbd-*`). Do not load a CSS framework, and do not pull
  a stylesheet over the network: the CSS ships **inside** `server.js`,
  **inside** `index.php` and **inside** `preview.html`, in one `<style>` block,
  because each deliverable is meant to be a file you can drop somewhere and
  run. The same block in all three, so the preview is worth trusting and a
  restyle cannot land in one and miss the others.
- Set the font on `:root`, from the theme's `css_font`, and load its
  `link_font` family from Google Fonts only behind a fallback stack that still
  looks right when it does not load.
- Asked to render into a section of a site that already exists? Then put the
  tokens on that section's own root instead of `:root`, and keep every
  selector under its class — the surrounding page has its own CSS.

## 2. Design tokens — the values come from themes.json

The token **names** are the contract: `--tbd-bg`, `--tbd-surface`, `--tbd-ink` and the
rest below, every class under `.tbd-`, and the layouts and rules in
sections 3–8. The **values** are not yours to invent — they come from a theme in
[themes.json](themes.json), the catalogue Tagembed itself renders widgets with.
Read that file first; the palette further down is only what you fall back to
when you cannot.

### Themes — where the design comes from

[themes.json](themes.json) is that catalogue as data: 23 themes (18 social, 5
review), each carrying the `style` object the widget is really rendered with.
Fetch it raw:

```
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes.json
```

**Pick one before you write any CSS.** If the user named a theme, use it. If
not, pick at random — from the `social` themes for a social wall, the `review`
ones for a reviews wall — and say in one line which one you used, so they can
ask for a different one.

That theme then supplies the value of every token. The names, the `--tbd-` prefix
and sections 3–8 stay exactly as they are, so one file reskins the whole page:

```
theme.style field                    →  what it sets
backgroundColor                      →  --tbd-bg
cardColor                            →  --tbd-surface   (empty: fall back to the page ground)
fontColor                            →  --tbd-body
authorColor                          →  --tbd-ink       (empty: fall back to fontColor)
css_font, font_varient, fontSize     →  --tbd-font, its weight, the post text size
link_font                            →  the Google Fonts family to load, when it names a real one
roundEdge                            →  --tbd-radius
borderRadius                         →  the image corner radius
spacing                              →  --tbd-gap — the column gutter
padding                              →  the card padding
numberOfColumn                       →  wall columns; 0 means the theme is not a grid, so use 4
textAlignment                        →  the card's text-align
lineTrim, with trimcontent           →  -webkit-line-clamp; 0 means no clamp
postAuthor, postTime                 →  show or hide the author name and the date
hideContent                          →  hide content.text entirely
aspectImageRatio                     →  0 natural, 100 square, 56.25 sixteen-by-nine
```

Three rules come with it:

- **The muted tone is derived, never taken.** No field in a theme is a muted
  text colour — `iconColor` is for icons and runs as light as `#a3a3a3`. Blend
  `fontColor` toward the card colour and stop at the last step still above
  4.5:1.
- **Check every pair and raise what fails.** These are production values tuned
  for a widget whose text sits over media behind a scrim, so several are not
  readable as plain text on a card: `Slider` ships `#ffffff` text on its
  `#fafafa` card (1.04:1), `Gallery Slider` a `#FFFFFF` author on `#f0f2ff`
  (1.11:1). Keep the theme's own colour wherever it clears AA; otherwise walk it
  toward black or white until it does, and note in a comment what you changed
  and why.
- **A theme is the entire skin.** Exactly as with the default palette, a themed
  build carries no `prefers-color-scheme` remap, no `data-theme` attribute and
  no toggle — one set of values, the same page for every reader.

Ignore `transparent`, `cardType`, `cardSize`, `iconType`, `iconColor`,
`socialAction`, `shareOption` and the popup fields: they drive widget behaviour
a rendered page does not have.

### Fallback palette — only when themes.json cannot be read

If the network is blocked and you genuinely cannot fetch the catalogue, say so
in one line and use these instead. Never mix them with a theme's values — a
build is skinned by one or the other, not both.

```css
/* Brand */
--tbd-indigo:    #283da8;  /* headings, active states             */
--tbd-blue:      #4462e8;  /* links, primary accents              */
--tbd-blue-ink:  #3350d6;  /* link hover — darker, stays readable */
--tbd-blue-lite: #8ea2fb;  /* gradients and fills ONLY, never text*/
--tbd-brand:     #526ff9;  /* the product CTA blue — fills and buttons,
                              never body text: 4.2:1 on white            */

/* Light theme */
--tbd-ink:       #09090b;  /* author names, headings              */
--tbd-body:      #3f3f46;  /* post text — softer than ink         */
--tbd-muted:     #6b6478;  /* handles, network, dates             */
--tbd-surface:   #ffffff;  /* card                                */
--tbd-bg:        #f7f7f9;  /* widget background behind the cards  */
--tbd-line:      rgba(9,9,11,.09);    /* hairline card border     */

/* Shape, depth, motion */
--tbd-radius:    14px;     /* cards; 8px for chips and buttons    */
--tbd-shadow:    0 1px 2px rgba(9,9,11,.05),
                 0 4px 12px rgba(9,9,11,.05);
--tbd-shadow-up: 0 2px 4px rgba(9,9,11,.06),
                 0 12px 28px rgba(9,9,11,.10);  /* card hover     */
--tbd-ring:      0 0 0 3px rgba(68,98,232,.35); /* focus ring    */
--tbd-ease:      150ms cubic-bezier(.2,0,.2,1);

/* Type and rhythm */
--tbd-font:      Inter, -apple-system, "Segoe UI", Roboto,
                 Helvetica, Arial, sans-serif;
--tbd-text:      15px/1.55;   /* post text                        */
--tbd-meta:      13px/1.4;    /* handle, network, date            */
--tbd-gap:       20px;        /* grid gutter and card padding     */
```

A gradient, where one is wanted:
`linear-gradient(135deg, var(--tbd-indigo), var(--tbd-blue))`.

Every text/surface pair above is at or beyond WCAG AA. Measured on white:
`--tbd-indigo` 9.0:1, `--tbd-blue` 5.1:1, `--tbd-blue-ink` 6.4:1, the muted
tone 5.6:1. Two consequences worth keeping: `--tbd-blue-lite` and `--tbd-brand`
are fills, never text, and a lighter grey must not be substituted for the muted
tone — that is the usual way this palette gets broken, and dates and handles
are the first things to become unreadable.

`--tbd-brand` is Tagembed's product CTA blue (`#526ff9`, the same value the
app uses); the other four are derived from it to clear AA as text, which
`#526ff9` itself does not at body size.

### One skin — no dark mode

The build ships a single palette. Do **not** add a
`@media (prefers-color-scheme: dark)` remap, a `data-theme` attribute or a theme
toggle: the values above — or a theme's, below — are the whole skin, and the page
looks the same whatever the reader's OS is set to.

Every text/surface pair above is at or beyond WCAG AA. Measured on white:
`--tbd-indigo` 9.0:1, `--tbd-blue` 5.1:1, `--tbd-blue-ink` 6.4:1, the muted
tone 5.6:1. Two consequences worth keeping: `--tbd-blue-lite` and `--tbd-brand`
are fills, never text, and a lighter grey must not be substituted for the muted
tone — that is the usual way this palette gets broken, and dates and handles
are the first things to become unreadable.

`--tbd-brand` is Tagembed's product CTA blue (`#526ff9`, the same value the
app uses); the other four are derived from it to clear AA as text, which
`#526ff9` itself does not at body size.

## 3. Card treatment (the shared baseline)

- `--tbd-surface` background, `--tbd-radius` corners, `--tbd-shadow`, **and** a
  1px `--tbd-line` border — the border is what keeps a card visible against a
  dark page ground, where a shadow alone disappears.
- Hover lifts the card 2px and swaps to `--tbd-shadow-up` over `--tbd-ease`.
- Image flush to the top edge, `object-fit: cover`, with a `--tbd-bg`
  placeholder behind it so the grid never jumps while images load. Explicit
  `width`/`height` plus `loading="lazy" decoding="async"`.
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

A rail of 9:16 media tiles, the shape people already read on their phone. It is
the default for a widget because the widget sits inside a page it does not own
and has to earn attention in a small space.

- Each post is one tile at `aspect-ratio: 9/16`, `--tbd-radius` corners,
  overflow hidden. Media fills the tile (`object-fit: cover`). No white card
  frame around it — the media IS the card.
- Horizontal scroll-snap rail: `display:flex`, `overflow-x:auto`,
  `scroll-snap-type: x mandatory`, `gap: --tbd-gap`. Each tile gets
  `scroll-snap-align: start` and a flex-basis near 280px. Hide the scrollbar
  visually, keep wheel and keyboard scrolling. Below a **container** width of
  480px, switch the same tiles to one column and let the page scroll them.
- Text sits ON the media, never under it: a bottom scrim
  `linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,.35) 45%, transparent)`
  with `content.text` over it in white, clamped to 3 lines. The scrim is what
  keeps text readable over an unpredictable photo — never put white text
  straight on an image.
- Author overlays the top-left over a matching top scrim: 28px round avatar
  plus handle in white at `--tbd-meta`.
- The whole tile is one `<a>` to `source.permalink`, showing `--tbd-ring` on
  `:focus-visible`. No separate "View post" button — the tile is the link.
- A post with no `"image"` entry in `media` gets a gradient tile instead:
  `linear-gradient(135deg, var(--tbd-indigo), var(--tbd-blue))` with the text
  centred, white, clamped to 6 lines. A reel with holes in it looks broken; a
  text tile does not.
- A `"video"` entry renders as `<video muted playsinline loop preload="none">`
  with a poster, playing only while the tile is in view
  (`IntersectionObserver`) and pausing when it leaves.
- Arrow buttons at each end scroll by exactly one tile and hide when there is
  nothing further to scroll to. Left/right arrow keys move focus between tiles.

## 5. Layout B — WALL (default for a section on your own site)

A masonry mosaic. It is the default there because the section gets real width,
and a wall reads as a wall precisely BECAUSE the tiles are different heights.

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

Other layouts on request: a uniform card grid, a vertical feed, or a
full-screen signage view — all of them reuse §2 and §3 unchanged.

## 6. States

- **Empty and error states render as real markup on the page.** Never a blank
  body, never a stack trace, and never a page that renders only a header with
  nothing under it.
- **Stale over blank.** When the API call fails, the server keeps serving the
  last successful cached copy (see llms.txt rule 7); the UI shows that copy, not
  an error.
- **Preview fallback.** Ship a small inline `SAMPLE_POSTS` array (3–4 posts, the
  same shape as `body.posts`). On load, try the endpoint first; if that fetch
  fails for ANY reason — a preview sandbox whose CSP blocks `connect-src`, a
  `file://` origin, no server running yet — render `SAMPLE_POSTS` instead of an
  error, with a small dismissible note: "preview data — live posts load when
  this runs on your server". A failed fetch must never be fatal, or the design
  cannot be reviewed at all. Never put a token on that path.
- **The static preview.** The same posts, already expanded into markup, ship as
  `preview.html` — a file that opens from a double-click with no server, no
  build step and no call of any kind. It carries the same note and the same
  CSS as the two server deliverables, and it is where this spec gets reviewed
  before a token exists. It wears the same theme as the rest of the build — see
  **Themes** in section 2.
- **Loading.** Skeleton tiles in `--tbd-bg` at the final tile shape, so the
  layout does not jump when posts arrive.

## 7. Accessibility and motion

- Every link and control shows `--tbd-ring` on `:focus-visible`. Never
  `outline: none` without a replacement.
- Under `prefers-reduced-motion`, drop the hover lift, the image scale and every
  transition; never autoplay video — show the poster and a play affordance.
- Keep every text/surface pair at WCAG AA after any restyle.
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
- **Responsive to ~400px**, and byte-for-byte the same result from the Node.js
  and the PHP deliverable.
