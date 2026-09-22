# Widget design spec — tokens, layouts, states

The visual half of the brief for anything built on the Tagembed Developer API
(v3): the design tokens, the two default layouts, the card treatment and the
states a feed has to handle. The data half — endpoints, envelope, field names,
caching, the token rule — lives in [llms.txt](../llms.txt); this file never
contradicts it.

Point an AI at it instead of pasting a hundred lines of CSS into every prompt:

```
Design spec (tokens, layouts, states) - follow it exactly:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
```

If the AI cannot browse, the five brand colours below are the minimum worth
pasting inline: `--tbd-indigo:#283da8`, `--tbd-blue:#4462e8`,
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
- Set the font on `:root`. Load Inter from Google Fonts only with a fallback
  stack that still looks right when it does not load.
- Asked to render into a section of a site that already exists? Then put the
  tokens on that section's own root instead of `:root`, and keep every
  selector under its class — the surrounding page has its own CSS.

## 2. Design tokens

Use exactly these. Do not invent other colours.

```css
/* Brand — identical in both themes */
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

### Dark theme — ON BY DEFAULT

Remap **only** these tokens under `@media (prefers-color-scheme: dark)`, so the
brand hues stay recognisable. A `data-theme="light"` / `data-theme="dark"`
attribute on `<html>` must override the OS preference in both directions, so a
reader who chooses a theme keeps it whatever their OS says.

```css
--tbd-ink:      #f4f4f5;   --tbd-body:     #d4d4d8;
--tbd-muted:    #a1a1aa;   --tbd-surface:  #18181b;
--tbd-bg:       #101012;   --tbd-line:     rgba(255,255,255,.10);
--tbd-blue:     #8ea8ff;   --tbd-blue-ink: #b9c6ff;
--tbd-indigo:   #a9b6f0;
```

Every text/surface pair above is at or beyond WCAG AA. Measured on white:
`--tbd-indigo` 9.0:1, `--tbd-blue` 5.1:1, `--tbd-blue-ink` 6.4:1, the muted
tone 5.6:1; on the dark surfaces, `--tbd-blue` 7.8:1, `--tbd-blue-ink` 10.6:1,
`--tbd-indigo` 9.0:1, muted 6.9:1. Two consequences worth keeping:
`--tbd-blue-lite` and `--tbd-brand` are fills, never text, and a lighter grey
must not be substituted for the muted tone — that is the usual way this
palette gets broken, and dates and handles are the first things to become
unreadable.

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
  before a token exists. [preview.html](preview.html) in this folder is a
  reference build of it.
- **Loading.** Skeleton tiles in `--tbd-bg` at the final tile shape, so the
  layout does not jump when posts arrive.

## 7. Accessibility and motion

- Every link and control shows `--tbd-ring` on `:focus-visible`. Never
  `outline: none` without a replacement.
- Under `prefers-reduced-motion`, drop the hover lift, the image scale and every
  transition; never autoplay video — show the poster and a play affordance.
- Keep every text/surface pair at WCAG AA after any restyle, in both themes.
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
- **Both themes work.** Honour `prefers-color-scheme`. A theme toggle is
  optional; if you add one, it is a class on `<html>` flipped by a few inline
  lines — and it is the only JavaScript this build may ship.
- **Responsive to ~400px**, and byte-for-byte the same result from the Node.js
  and the PHP deliverable.
