# Layout A — REEL

Part of [widget-design-spec.md](../widget-design-spec.md), section 4. Sections
2–3 (tokens, card treatment) and 6–8 apply to it unchanged.

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
