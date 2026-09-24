# Widget themes — pick one, build from its preview

The 19 widget themes a Tagembed Social Widget build can wear: 14 for social
posts, 5 for reviews. Each one has a thumbnail of the real widget (to pick
from), a finished HTML preview of it (to build from), a line on its layout
and the values its colours, font and spacing come from.

Fetch this file RAW. Thumbnails are PNGs beside it, and the previews are HTML
files in the `previews` folder next to this one:

```
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/<file>.png
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/<theme>.html
```

The thumbnail is for the question only. Once a theme is picked, the build
comes from its preview HTML, never from the thumbnail.

## Agents: ask first — show the picture, never a list

Before writing any code, show the user **the theme picker page itself,
rendered** — the thumbnails, not a list of names. The picker is one small
page with every theme's name under its thumbnail, the images embedded as
base64 so it renders anywhere:

```
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/thumbnails.html
```

Show it the first way your tool allows:

1. **You can make an HTML artifact** (claude.ai, Claude Code, ChatGPT
   canvas, Gemini canvas): fetch it RAW and show it as an HTML artifact,
   exactly as it is. The file is about 45 KB, nearly all of it base64 WebP
   thumbnails — artifacts block outside image links, so the base64 is what
   makes it render. The artifact's code is the whole file, every base64
   string complete: never shorten or re-encode an image, never swap one for
   a link or a placeholder, never turn the page into markdown or a table.
2. **You work in the user's folder** (Claude Code, Cursor, Codex, Copilot,
   Gemini CLI, Windsurf): download it as `theme-picker.html` without
   retyping it (`curl -sSLo theme-picker.html <url>`), then open it in their
   browser — `open theme-picker.html` on macOS, `start theme-picker.html` on
   Windows, `xdg-open theme-picker.html` on Linux. If you cannot run
   commands, tell them to double-click it. Say it can be deleted once they
   have picked.
3. **Neither:** give this link instead — it opens the exact same page in a
   real browser, unlike the raw GitHub link above which shows it as code:
   `https://raw.githack.com/wallapi/tagembed.com-API-Docs/main/guides/themes/thumbnails.html`
   Say it in one line, then ask which theme they want. If even a link is no
   use to them, ask by name directly. Never show a table instead.

Copy the file character for character, the base64 included: never retype,
shorten, resize or redraw it, and add nothing to it.

**Never show a table or a list.** The picker page is the whole answer to the
theme question — no table of any kind (no "For", "Look", "What it looks like"
or thumbnail-link columns), and never the theme names alone. The file exists
at the link above; if a fetch of it fails, say the fetch failed — never that
there is no picker file. The per-theme sections under
[The themes](#the-themes) are for the build, not for the user — never
summarise them in the question.

Then ask which theme they want; take its name or its number. If they already named a theme,
skip the question. Never pick one for them at random.

Your whole reply to the theme question is: the picker, then one line —
"Which theme do you want? Reply with its name or number."

## How a theme becomes the build

**The picked theme's preview file is the template.** Fetch it RAW —
`guides/previews/<theme>.html`, the *Preview* line under the theme below —
before writing any code. It is the finished widget: the design is already
done, and the build only puts the posts into it. Never redraw it from the
thumbnail, the *Look* line or taste. If you cannot fetch it, say so in one
line — do not rebuild it from memory.

Read it in this order — the file is laid out so the part the build needs
comes first, even if a long fetch gets cut off: the `<style>` block in the
head, then at the top of `<body>` the `<!-- tbd:template … -->` note, the
card `<template>` and (slider themes) the arrow `<script>`, then the
`<section>`. The sample cards come last, between the `tbd:cards` marks, and
carry large base64 images: they only show the look — never copy them, never
retype their images.

1. **Copy the whole file as it is** — the `<style>` block (every `:root`
   value, rule and class), the `<section>` and everything inside it except
   the sample cards, the header, the arrow `<script>`. That copy is
   `preview.html`, and the same page is what the server code renders.
2. **Inject the posts.** Between `<!-- tbd:cards -->` and
   `<!-- /tbd:cards -->` sit the sample cards. Replace them with one card per
   post: the theme's own card from the `<template id="tbd-card-template">`
   at the top of the body, every `{{slot}}` filled as the table below says.
   `preview.html` fills it from the sample posts JSON; the server code fills
   it from `body.posts`, in a loop, at request time — same template, same
   output. The two badge themes mark `<!-- tbd:badge -->` instead and
   fill `<template id="tbd-badge-template">` once, from all review posts.
3. **Delete the build notes**: the `<!-- tbd:template … -->` comment, the
   `<template>` element and the two `tbd:cards` marks.
4. **Keep the `<script>`** if the theme has one — it is the slider arrows,
   copied as it is (see *Sliders* below).

Nothing else changes: no class renamed, no part moved or dropped, no CSS
added. The only text a build may set is the `.tbd-header` line (the user's own
title, or keep it), the `<p class="tbd-note">` "preview data" line the build
brief asks for, and `<p class="tbd-empty">` in place of the cards when there
are no posts — all three already styled by the file. The preview file's
sample posts, names, avatars and links are placeholders — none of them goes
into the build; the posts come only from the sample posts JSON or the API.

## Filling the card

Every value is HTML-escaped before it goes in. Absent values are `null` —
never print "null".

| Slot | From the post |
| ---- | ------------- |
| `{{permalink}}` | `source.permalink`, only if it starts `http://` or `https://`. None: the card is `<div class="tbd-card">…</div>` instead of the `<a>`, same classes |
| `{{network_name}}` | `network.name` |
| `{{network_slug}}` | `network.slug` |
| `{{network_mark}}` | by slug: instagram `IG`, facebook `f`, twitter / x `X`, linkedin `in`, pinterest `P`, google `G`, yelp `y`, tripadvisor `T`, trustpilot `★`, youtube `▶`, tiktok `♪`; any other: the first letter of `network.name` |
| `{{media}}` | the FIRST `media[]` entry of type `"image"`: `<img src="{cdn_url}" alt="" loading="lazy">`. A post with a `"video"` entry: `<video controls muted playsinline preload="none" poster="{first image cdn_url}"><source src="{video cdn_url}"></video>` (no poster attribute when it has no image). The `src` is `cdn_url` copied character for character — `http(s)`, or the `data:image/…` URI the sample posts carry |
| `{{media_width}}` `{{media_height}}` | that media entry's `width` and `height`. Either one null: drop the whole `style` attribute |
| `{{avatar}}` | `author.avatar_url` set: `<img class="tbd-avatar" src="{avatar_url}" alt="" loading="lazy" data-initial="{initial}">`; null: `<span class="tbd-avatar">{initial}</span>`. The initial is the first letter of `{{author}}`, upper-cased |
| `{{author}}` | `author.name`, else `author.handle` |
| `{{created_at}}` | `created_at` as given |
| `{{date}}` | the same instant, UTC, as `Sep 16, 2022` |
| `{{text}}` | `content.text`, escaped, as plain text (no `<br>`, no links) |
| `{{rating}}` | `rating`, the number as given (0–5) |
| `{{stars}}` | `rating` rounded: that many `★`, then `☆` up to five |

When a part has no data:

- **No image and no video.** If the card has a `.tbd-text`, drop the whole
  `.tbd-media` div. A photo-only card (no `.tbd-text`) keeps the `.tbd-media`
  div empty, with no `style`: it shows the network-name tile.
- **`rating` is null.** Drop the `.tbd-stars` div.

Badge themes (`tbd-badge-template`), from the posts whose `rating` is not
null: `{{average}}` their mean to one decimal (`4.9`), `{{average_stars}}`
that mean rounded as stars, `{{count}}` how many there are, and
`{{networks}}` one `<span class="tbd-net" data-net="{slug}" data-mark="{mark}"
title="{name}"></span>` per network among them, in the order first seen.

Filled with the sample posts JSON, every template gives back exactly the
sample cards the preview file shows — that is the check that the injection
is right.

- **Where they disagree, the preview wins.** The *Look* and *Values* lines
  below describe the same theme in words; if a value there differs from the
  preview's `:root`, use the preview. The design spec maps each `--tbd-*` token, under **Themes** in
  section 2:
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
- **Sliders:** the slider, carousel and rail previews carry one small
  `<script>` that scrolls the row by one view when an arrow is clicked. It is
  part of the design: copy it as it is, into `preview.html` and the server's
  page alike. It fetches nothing and reads no data — the posts are already in
  the HTML. That script is the only JavaScript a build carries; the row
  itself is CSS scroll-snap, so it still swipes if scripts are off.
- Review themes are for review posts (a `rating` 0–5). Badges show the average
  `rating` of the posts, rounded to one decimal, and how many there are.
- One theme is the whole skin: no dark mode, no toggle, no second theme.

## The themes

For the build only — the details the build copies. Never show these
sections, or a summary or table of them, to the user when asking which theme.

### 1. Classic Card — social

![Classic Card](bigThumb5.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb5.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/classic-card.html?v=2026-09-24c
- **Look:** a mosaic of cards (design spec §5). Each card starts with the
  author row — 32px round avatar, name and date, network icon pushed right —
  then the post text, then the image flush to the bottom and side edges.
  Rounded corners, soft shadow, no visible border.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` · author
  `#000000` · font Open Sans, 14px · card radius 8 · image radius 0 · gap 10 ·
  padding 10 · text left · clamp 4 lines · image natural ratio

### 2. Social Card — social

![Social Card](bigThumb19.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb19.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/social-card.html?v=2026-09-24c
- **Look:** a mosaic of cards. Image flush on top, then the author row
  (avatar, name and date, network icon right), then the post text. Square-ish
  cards with a 1px hairline border.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` · author
  `#000000` · font Open Sans, 14px · card radius 8 · image radius 0 · gap 10 ·
  padding 10 · text left · clamp 5 lines · image natural ratio

### 3. Modern Card — social

![Modern Card](bigThumb20.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb20.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/modern-card.html?v=2026-09-24c
- **Look:** a mosaic of cards. Image flush on top, then the post text, then
  the author row at the bottom (avatar, name and date, network icon right).
  1px hairline border, light type.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#2B2B2B` · author
  `#2B2B2B` · font Open Sans 300, 14px · card radius 8 · image radius 0 · gap
  10 · padding 8 · text left · clamp 3 lines · image natural ratio

### 4. Classic Photo — social

![Classic Photo](bigThumb3.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb3.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/classic-photo.html?v=2026-09-24c
- **Look:** a uniform grid, 3 across on a wide screen. Each card is a 16:9
  cropped photo with just the author row under it — avatar, name and date,
  network icon right. No post text. Soft shadow.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` · author
  `#000000` · font not set (use Open Sans), 14px · card radius 8 · image radius
  8 · gap 12 · padding 12 · text left · no clamp · image 16:9

### 5. Square Photo — social

![Square Photo](bigThumb4.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb4.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/square-photo.html?v=2026-09-24c
- **Look:** a uniform grid of square cropped photos, 3 across on a wide
  screen, with a small gap. No card, no text, no author on the tile — the
  author and network go in the image's `alt` and the tile links to the post.
  Text-only posts become a square tinted tile with the text in it.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` · author
  `#000000` · font Open Sans, 14px · card radius 8 · image radius 0 · gap 10 ·
  padding 10 · text left · no clamp · image square

### 6. Collage — social

![Collage](bigThumb50.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb50.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/collage.html?v=2026-09-24c
- **Look:** photos only, in repeating blocks of three: one big tile taking
  two thirds of the width, and two small square tiles stacked beside it. The
  next block mirrors it (big tile on the right). On hover a tile darkens and
  shows the network icon and a "View post" outlined button. Tiles touch.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` · author
  `#000000` · font Open Sans, 14px · card radius 8 · image radius 0 · gap 10 ·
  padding 10 · text left · no clamp · image cropped to the tile

### 7. Vivid — social

![Vivid](bigThumb83.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb83.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/vivid.html?v=2026-09-24c
- **Look:** a mosaic of rounded cards. Image on top, then a text panel
  filled with a soft pastel gradient — yellow, green, blue, orange, pink,
  cycling card by card — holding the author row (avatar, name, network icon
  right) and the post text. Text-only posts are all panel.
- **Values:** page `#ffffff` · card `#fafafa` · text `#1f1b1b` · author
  `#1f1b1b` · font not set (use Open Sans), 14px · card radius 3 · image radius
  0 · gap 0 (use 10 between cards) · padding 10 · text left · clamp 4 lines ·
  image natural ratio

### 8. Horizontal Slider — social

![Horizontal Slider](bigThumb16.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb16.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/horizontal-slider.html?v=2026-09-24c
- **Look:** one horizontal row of landscape photos, 3 in view on a wide
  screen, no text on them. Dark square prev/next arrows sit over the first and
  last photo's outer edge.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` · author
  `#000000` · font Open Sans, 14px · card radius 8 · image radius 8 · gap 10 ·
  padding 10 · text left · clamp 3 lines · image cropped 4:3

### 9. Horizontal Columns — social

![Horizontal Columns](bigThumb47.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb47.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/horizontal-columns.html?v=2026-09-24c
- **Look:** a slider of cards, 3 in view. Photo on top; a round avatar with a
  white ring sits on the photo's bottom edge, centred; under it the name and
  date, the network icon and the post text, all centred. Rounded cards, soft
  shadow, round grey arrows outside the row.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` · author
  `#000000` · font Open Sans, 14px · card radius 8 · image radius 0 · gap 10 ·
  padding 10 · text centred · clamp 5 lines · image cropped 16:10

### 10. Slider — social

![Slider](bigThumb81.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb81.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/slider.html?v=2026-09-24c
- **Look:** a slider of square photos with rounded corners, 3 in view, no
  text under them. On hover a photo darkens and shows the network icon in the
  middle. Small white round arrows on the row's ends.
- **Values:** page `#ffffff` · card `#fafafa` · text `#ffffff` (only over the
  darkened photo) · author `#000000` · font not set (use Open Sans), 14px ·
  card radius 3 · image radius 8 · gap 0 (use 10 between photos) · padding 0 ·
  text left · no clamp · image square

### 11. Reels — social

![Reels](bigThumb61.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb61.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/reels.html?v=2026-09-24c
- **Look:** a row of tall 9:16 tiles with rounded corners, 3 in view, photo
  or video poster filling each one, no text. The network icon shows in the
  middle of a tile on hover. The reel layout in the design spec (§4) is this
  theme.
- **Values:** page `#ffffff` · card `#ffffff` · text `#000000` · author
  `#2B2B2B` · font Open Sans, 14px · card radius 8 · image radius 8 · gap 12 ·
  padding 10 · text left · no clamp · image 9:16

### 12. Story Theme — social

![Story Theme](bigThumb60.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb60.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/story-theme.html?v=2026-09-24c
- **Look:** a row of tall 9:16 story cards with large rounded corners, the
  card in the middle full strength and its neighbours faded. Each card has the
  author's round avatar with a white ring at the top centre and, at the
  bottom over a dark fade, the first line of the text, the date and the
  handle in white. Round arrows between the cards; video posts show a play
  icon.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#000000` (white over
  the photo) · author `#000000` · font Open Sans, 14px · card radius 8 · image
  radius 0 · gap 10 · padding 10 · text left · no clamp · image 9:16

### 13. Single Post — social

![Single Post](bigThumb52.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb52.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/single-post.html?v=2026-09-24c
- **Look:** one post at a time: a large photo centred on the page, nothing
  else on it, with round translucent white prev/next arrows half over its left
  and right edges. Scroll-snap moves one post per step.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#2B2B2B` · author
  `#2B2B2B` · font Inter, 14px · card radius 3 · image radius 0 · gap 10 ·
  padding 0 · text centred · clamp 5 lines · image natural ratio

### 14. Widget Theme — social

![Widget Theme](bigThumb49.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb49.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/widget-theme.html?v=2026-09-24c
- **Look:** single posts in one centred column, about 520px wide. Each post:
  the author row on top (large avatar, name and date, network logo right),
  the photo full width under it, then the post text. Posts follow one another
  down the page with space between.
- **Values:** page `#E9EAF0` · card `#ffffff` · text `#2B2B2B` · author
  `#2B2B2B` · font Inter, 14px · card radius 3 · image radius 0 · gap 10 ·
  padding 0 · text centred · clamp 5 lines · image natural ratio

### 15. Review Box — reviews

![Review Box](bigThumb79.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb79.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/review-box.html?v=2026-09-24c
- **Look:** a grid of review cards, 2 to 4 across. Each card: 5 gold stars
  centred on top (filled to the post's `rating`), the review text, then the
  author row at the bottom — avatar, name and date, network logo right.
  Rounded cards, soft shadow.
- **Values:** page `#ffffff` · card `#fafafa` · text `#000000` · author
  `#000000` · font not set (use Open Sans), 14px · card radius 3 · image radius
  0 · gap 0 (use 16 between cards) · padding 0 (use 16) · text left · clamp 5
  lines

### 16. Review Carousel — reviews

![Review Carousel](bigThumb80.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb80.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/review-carousel.html?v=2026-09-24c
- **Look:** the Review Box card — stars centred on top, text, author row with
  the network logo right — in one horizontal row, 3 in view, with white round
  arrows on the ends.
- **Values:** page `#F0F7FF` · card `#FFFFFF` · text `#000000` · author not
  set (use the text colour) · font Open Sans, 14px · card radius 8 · image
  radius 8 · gap 12 · padding 12 · text left · clamp 6 lines

### 17. Review List — reviews

![Review List](bigThumb85.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb85.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/review-list.html?v=2026-09-24c
- **Look:** full-width review rows stacked down the page. Each row: avatar
  with name and date on the left, network logo on the right, the stars centred
  under them, then the review text. Rounded rows, soft shadow.
- **Values:** page `#ffffff` · card `#FFFFFF` · text `#000000` · author
  `#000000` · font Open Sans, 14px · card radius 8 · image radius 0 · gap 0
  (use 12 between rows) · padding 10 · text left · clamp 5 lines

### 18. Rating Badge — reviews

![Rating Badge](bigThumb82.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb82.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/rating-badge.html?v=2026-09-24c
- **Look:** one small badge card, not a list of posts: the network logo on
  top, "<Network> Reviews" under it, the average rating large and bold (e.g.
  "4.0"), 5 gold stars, then "Based on N reviews". Rounded, soft shadow, on a
  pale inner panel.
- **Values:** page `#f5f6f7` · card `#fafafa` · text `#000000` · author not
  set (use the text colour) · font not set (use Inter), 14px · card radius 3 ·
  image radius 8 · padding 0 (use 16) · text centred

### 19. Badge — reviews

![Badge](bigThumb84.png)

- **Thumbnail (picker only):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/bigThumb84.png
- **Preview (build from this):** https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/badge.html?v=2026-09-24c
- **Look:** one wide, low badge card: the logos of the networks the reviews
  come from as small overlapping circles, then the average rating large and
  bold with 5 gold stars on the same line, then an underlined "Read our N
  reviews" link. Rounded, soft shadow.
- **Values:** page `#f5f6f7` · card `#fafafa` · text `#000000` · author not
  set (use the text colour) · font not set (use Inter), 14px · card radius 3 ·
  image radius 0 · padding 0 (use 16) · text left
