# Prompt Library — build your social widget with any AI

Copy-paste prompts for building a **server-rendered social widget** with the
Tagembed Developer API (v3). Start with
[Prompt 1](#prompt-1--the-main-prompt-start-here), paste it, set the token it
asks you for at the end — that is the whole workflow.

**The brief lives in three files, not in the prompt.** Every prompt below just
names your choices and links these; the AI fetches them and has the full
contract. They are raw URLs on purpose — a `github.com/…/blob` link returns an
HTML page, the raw one returns the file:

| File | What it carries | Raw URL to paste |
| ---- | --------------- | ---------------- |
| Build brief | what to build, the file manifest, the delivery checklist — and it links the other two | [widget-build-brief.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md) |
| API spec | endpoints, envelope, field names, integration rules | [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) |
| Design spec | `--tbd-*` tokens, the shipped themes in themes.json, card treatment, widget and reel layouts, page shell | [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md) |

All three live in the public docs repo
[github.com/wallapi/tagembed.com-API-Docs](https://github.com/wallapi/tagembed.com-API-Docs),
so they are versioned once and every prompt, tool document and agent reads the
same copy. If your AI cannot open URLs, see
[when the AI cannot browse](#when-the-ai-cannot-browse).

## What you get: a server-rendered page

Every prompt below produces the same shape. The page arrives from your server
with the posts already in the HTML — nothing in the browser calls anything:

```
     [ browser ]        one request, a finished page, no JavaScript fetching
          ▲
          │
   [ your server ]      holds ACCESS_TOKEN, caches 5 min, renders the HTML
          │
          ▼
   GET {API_BASE_URL}/v3/posts   Authorization: Bearer …
```

Your server is the only thing that ever sees the token, and it never reaches
the rendered HTML. That is what makes the page safe to put on a public site.

**You get both languages, every time** — not a choice you have to make up
front. Each one is complete on its own, CSS included, so there is no stylesheet
to wire up:

| Node.js | PHP |
| ------- | --- |
| `server.js` — the API call, the cache, the HTML and the CSS, all in it | `index.php` — **one file**, everything in it, CSS included |
| `package.json` | nothing to install |
| `cache/posts.json` | its own `cache/posts.json`, created on first run |
| `README.md` — documents **both** languages | covered by the same README |

**And one file both of them share: `preview.html`.** The same wall, the same
CSS, with the sample posts written straight into the HTML — no server, no
token, no API call anywhere in it. Double-click it and the design is on screen,
which is how you review the look before you have a token, on a laptop with
neither PHP nor Node installed, or in a chat window that can run neither.
Because all three render the same markup from the same tokens, a restyle has to
land in all three or they drift apart. Its skin comes from
[themes.json](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes.json) — the 23 shipped widget themes as data. One theme
supplies every colour, the font, the radius, the spacing, the column count and
the author/date toggles, and that is the whole skin: no light/dark switch
anywhere in the build. The field-by-field mapping is in [the design spec](widget-design-spec.md),
under **Themes** in section 2, and the build names the theme it used.

It is `preview.html` and not `index.html` on purpose: an `index.html` sitting
next to `index.php` is served *instead* of it by most Apache and nginx
configurations, so the live page would silently become the sample page the
first time the folder is uploaded.

Two environments, same prompts:

- **In-editor agent** (Claude Code, Cursor, Codex, Copilot, Antigravity): the
  agent creates and edits files in your project directly. Optionally drop a
  [context file](build-a-social-widget.md#per-tool-context-files) in the project
  first; then your follow-ups can be one-liners.
- **Browser AI** (ChatGPT, Gemini, claude.ai — no filesystem access): start
  with [Prompt 0](#prompt-0--browser-ai-preamble) so the AI outputs every file
  complete and ready to save, plus a setup checklist.

## The two values

**One you fetch, one you already know.** The only thing you get from the
dashboard is the token. The base URL is the same for every account — nothing
to look up and nothing to copy. Every prompt below asks you for the token at
the _end_ of the reply, once the code is already written, so you are never sat
waiting on a question before you have anything. The code reads both from
environment variables, so wherever you put them (`.env`, cPanel, Vercel) they
stay out of the source. Nothing runs until you fill them in:

| Value        | Environment variable | Where it comes from                                                                                            |
| ------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Token        | `ACCESS_TOKEN`       | your dashboard — the four steps below                                                                          |
| API base URL | `API_BASE_URL`       | always `https://api.tagembed.com/api` — it is an environment variable only so staging can be pointed elsewhere  |

### Getting the token

1. Log in to your Tagembed dashboard.
2. Open the gallery you want the posts from, or create one.
3. On that gallery's card, click the **⋮** (three dots) menu.
4. Click **Access Token** and copy the value.

---

## Prompt 1 — The main prompt (start here)

Self-contained: the facts that cannot be guessed are in the prompt itself, so
it works even when the AI cannot open a link. Paste it as-is.

```
Build me a social widget: a web page, rendered by my own server, that
shows a live feed of the social posts collected in my Tagembed gallery.

The API is documented here - read it before writing anything, because
the field names below are not the ones other social-wall APIs use:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt

What to deliver - all of these, in this reply, not a choice:
- index.php: ONE self-contained PHP 8 file with everything in it, the
  API call, the cache, the HTML and the CSS. Nothing to install and
  nothing to require.
- server.js + package.json: the same four things again in Node.js 18+
  with Express. No separate stylesheet in either version.
- preview.html: those same sample posts already expanded into static
  HTML. I double-click it, no server and nothing installed, and it
  calls NOTHING - no fetch, no token, no script at all. Same CSS and
  markup as the two above, so a later restyle applies to all three.
  Not index.html - that gets served instead of index.php.
- README.md covering them: the files, the two environment variables,
  how to run each one written for someone who has never opened a
  terminal, how the cache works, and a short list of what to check when
  it goes wrong.

Looks
- The design comes from themes.json, which the design spec links and
  maps field by field. Pick ONE social theme at random and skin the
  whole build with it: its colours, font, radius, spacing, column
  count, text alignment, line trim and author/date toggles. Tell me
  which theme you used so I can ask for another.
- One skin only - no dark mode, no prefers-color-scheme remap, no
  data-theme attribute, no light/dark toggle anywhere.
- Some theme colours are unreadable as plain text (white on a near
  white card). Keep the theme's colour where it clears WCAG AA,
  otherwise darken or lighten it until it does, and say what you
  changed.

Calling the API
- GET https://api.tagembed.com/api/v3/posts?limit=24, with the header
  Authorization: Bearer <my token>.
- Take the token from the ACCESS_TOKEN environment variable and the
  base URL from API_BASE_URL, defaulting to the address above. Neither
  belongs in the source.
- The response is wrapped. Posts are at body.posts and paging at
  body.paging - never at the top level. A request can fail while
  returning HTTP 200, so check the envelope's `status` flag as well as
  the status code.
- Do not add a `fields` parameter; it does not exist, and the whole
  post object comes back either way.
- Do not touch `sort`. Pinned posts first and newest after is already
  the default, and it is the order a widget wants.
- For a second page, send body.paging.next_cursor back as `after` on a
  normal server-side request. Treat that cursor as opaque: never build
  one, never pass a post id.

Caching
- Keep the last response in a local JSON file and reuse it until it is
  5 minutes old. That holds the whole site to roughly 288 API calls a
  day no matter how busy it gets.
- When a refresh fails, keep serving the cached copy - a stale widget
  beats an empty one. With no cache yet, render the empty state rather
  than an error.

What each post gives you
- author.name, or author.handle when the name is null - either can be
  null, so handle that rather than printing "null".
- network.name for the source network, content.text for the body (it
  arrives as plain text), created_at for the date.
- The image is the FIRST entry in `media` whose type is "image", read
  from its cdn_url. Do not reach for media[0]: on many posts that is a
  video file. When there is no image entry, render no image element.
- source.permalink links back to the original post; add
  rel="noopener noreferrer". It can be null.
- Anything missing is null, never an empty string or a zero.

Non-negotiable
- Every API call happens on the server. The token must not reach the
  browser - not in the HTML, not in a comment, not in an attribute.
- Escape everything you print, and allow only http and https URLs in
  href and src.

Finish by commenting each part of the code in a line or two, then ask
me for my access token - and tell me where to find it: my Tagembed
dashboard, the gallery's card, its three-dots menu, "Access Token" -
and how to set the environment variables and run each version.
```

Want it on brand rather than unstyled? Add this line — the design spec carries
the palette, the shipped themes, the card treatment and the layouts:

```
For the looks, follow this design spec exactly:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
Keep its CSS inside index.php and inside server.js - no stylesheet.
```

## Prompt A — the short alternative (AI that can browse)

Same result, four lines instead of sixty: the build brief names what to build
and links the API spec and the design spec itself, so an AI that can fetch
URLs gets the whole contract from one link. Prompt 1 is the safer default —
it carries the facts itself, so nothing breaks when a fetch silently fails.

```
Build me a social widget: a page my server renders, showing the live
posts from my Tagembed gallery. Server-side only - nothing in the
browser calls the API.
The brief is here - fetch it RAW and follow it exactly:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
Fetch the API spec RAW too - it has the field names, which are the one
thing you cannot guess, and the brief alone does not carry them:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
Plus the design spec the brief links, for the looks.
Give me BOTH: the Node.js set (server.js, package.json, cache file)
and a single self-contained index.php - each with its CSS inside it,
no separate stylesheet - plus a preview.html: the same page as a
static file with the brief's sample posts baked into the HTML,
calling nothing, so I can double-click it and see the design before I
have a token. Same CSS in all three. Then one README.md covering
them.
The code
must read my base URL and token from the API_BASE_URL and ACCESS_TOKEN
environment variables - never hard-code them. Write the code first,
then at the end of the same reply ask me for my token, with the steps
to find it (dashboard - the gallery's card - its three-dots menu -
"Access Token"), and offer to put it in a .env for me.
```

---

## Prompt 0 — Browser-AI preamble

Prepend this when you are NOT in a code editor (ChatGPT/Gemini/claude.ai
web). It makes the AI hand you finished files and exact setup steps instead of
fragments.

```
You cannot access my filesystem, so work in "deliverable mode":
output every file COMPLETE and ready to save - no placeholders, no
"rest stays the same", no truncation - each starting with a header
line naming its exact path, e.g. `### FILE: index.php`. That means
both languages in full: the Node.js files AND the single-file PHP, in
the same reply, never "the PHP version is similar". Include
preview.html complete as well - the static sample-data version of the
same page - because it is the only one of the three I can open
without installing anything. Then the README,
which the build brief's section 6 describes - including where each
file goes and where to set the two env vars on my hosting (.env,
cPanel, Vercel/Netlify, Docker - ask which I use if it matters). Offer
each file as a download if this chat can. When I report an error,
reply with the corrected COMPLETE file, not a diff.
```

---

## When the AI cannot browse

Some tools cannot fetch a URL at all (a locked-down enterprise chat, an offline
model, an editor with web access switched off). Then the links carry nothing —
so paste the files instead of the prompt's link list:

1. Attach or paste [llms.txt](../llms.txt) and
   [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md)
   in the first message, then the prompt.
2. In-editor agents: drop both files in the repo once (see the
   [context files](build-a-social-widget.md#per-tool-context-files)) and every
   later prompt can be one line.

If you can only paste a few lines, these are the ones that cannot be guessed —
add them to any prompt:

```
Render on the server; the browser must not call the API at all.
Posts are at body.posts inside an envelope, not at the top level.
Per post: author.name (fall back to author.handle), network.name,
content.text (already plain text - escape it), created_at, and the
FIRST media entry whose type is "image" via its cdn_url. Absent values
are null. Paginate by sending paging.next_cursor back as `after`.
Brand colours, on :root: --tbd-indigo #283da8, --tbd-blue #4462e8,
--tbd-blue-ink #3350d6, --tbd-blue-lite #8ea2fb, --tbd-brand #526ff9.
Keep every text/surface pair at WCAG AA. One skin only - no dark
mode, no prefers-color-scheme remap, no theme toggle.
```

---

## Prompt 2 — Integrate into my existing website

For rendering the widget INTO a site that already exists. In an editor agent it
will scan the project and adapt; in a browser AI, tell it your stack.

```
Render a Tagembed social widget INTO my EXISTING website - a section
inside pages I already have, adjusted to my project's structure,
conventions and templating. Still server-side: the posts are in the
HTML before it leaves my server, and the browser calls nothing.

Fetch these three RAW and follow them exactly - together they are the
whole brief, so do not guess and do not borrow conventions from other
social-wall APIs:
1. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
2. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
3. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md

My stack: [plain PHP | Express | describe yours]. If you are running
inside my repository, inspect it and follow its existing patterns;
otherwise assume a conventional layout for that stack. Fit into my
existing build and deploy; do not introduce new frameworks. Cache in
[file | Redis | my framework's cache].

Two things differ from the brief's defaults, because this is a section
of my own site rather than a page of its own:
- Layout: the WALL in design spec section 5 - a masonry mosaic. The
  section gets real width here, and a wall reads as a wall precisely
  BECAUSE the tiles are different heights. [Swap for: the reel rail in
  section 4 | uniform card grid | vertical feed.]
- Keep the tokens on the section's own root rather than :root, and
  every selector under its own class - the surrounding page has its
  own CSS and the two must not collide.

Also give me a standalone preview.html: just the widget section, with
the brief's sample posts baked into the HTML as finished markup and
the same scoped CSS. It calls nothing - no fetch, no token - so I can
double-click it and review the section on its own, outside my site's
stylesheet, before wiring it into a template. Not index.html, which
would collide with my site's own entry point.

The code reads my base URL and token from the API_BASE_URL and
ACCESS_TOKEN environment variables - do not open with questions and
wait. Write the code in this first reply, then tell me which files you
added or changed, what I must configure, and how to verify it locally
- and at the end ask me for my token, with the steps (dashboard - the
gallery's card - its three-dots menu - "Access Token"), offering to put
it in my .env.
```

---

## Prompt 3 — Design the widget (iterate on looks)

Follow-up prompts after Prompt 1 or 2 — send them one at a time, iterate
small. The layouts these reference (widget, reel, grid) are specified in the
[design spec](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md).

```
Restyle the widget as a [WALL mosaic | REEL rail | 3-column card grid |
full-screen signage view] with [rounded cards + soft shadows | flat
minimal | editorial with a serif headline]. The layouts are specified
in sections 4-5 of
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
Keep using the --tbd-* design tokens already declared - do not
introduce new colours or a CSS framework, and keep the CSS inside the
same file. Keep every text/surface pair at WCAG AA, and do not add a
dark mode or a theme toggle - the build is one skin. Keep the data layer
and the caching untouched - CSS and markup only, and apply the same
change to ALL THREE - the Node.js file, the PHP file and preview.html -
so they stay identical. Give me back the updated preview.html too: it
is how I check the restyle without running anything.
```

```
Add a network filter bar above the widget - server-side, as links that
reload the page with a query parameter, not a browser fetch. There is
no networks parameter: a feed is one network's source on the gallery,
so filter with ?feed_ids= using the feed ids of the selected network.
Each post carries feed_id and network.name, so you can build the bar
from the posts you already fetched. Cache each filter under its own
key. Apply it to both server files, and put the same bar in the same
styling into preview.html so the three still look alike - inert there,
since a static file has no server to reload against.
```

```
Add a "Next page" link under the widget. Use body.paging.next_cursor
passed back as `after` in the page's own query string, and hide the
link when body.paging.has_more is false. The cursor is opaque: pass it
back verbatim, never construct or parse one, and never send a post id
as `after`. Keep the same `sort` on every page - changing sort
mid-pagination invalidates the cursor and returns 422.
Cache each page under its own key (the cursor is part of the key) with
the same TTL as the first page. Otherwise every visitor paging through
is a fresh API call and my daily hit count scales with traffic instead
of with time. Apply it to both server files. preview.html has no
second page to go to, so leave it as it is.
```

```
Auto-refresh for signage: have the page refresh itself every [60]
seconds with <meta http-equiv="refresh" content="60">. The server
keeps its own [5]-minute cache, so this adds no extra Tagembed API
calls - most of those refreshes are served from the cache file.
```

```
Show carousels properly: request expand=album so the parent post's
`media` array contains every slide, and render them as a row of
thumbnails inside the card. Without that parameter each slide is a
separate post sharing the same album_id. Also add expand=products and
show the shopping tags under the post when `products` is not null -
each has title, price, currency_symbol, url, image_url and in_stock.
Both expansions cost extra queries, so request them only where I
actually render them.
```

---

## Prompt 4 — Upgrade or change the cache

```
Change the caching layer to [Redis | Memcached | my framework's cache |
stale-while-revalidate: serve the cached copy instantly and refresh in
the background]. Keep the same behavior contract: [5]-minute TTL,
always serve the last good copy on API failure, never render blank.
Show me exactly what to install and which env vars to add
(e.g. REDIS_URL), keep a file-cache fallback if Redis is down, and
apply it to both the Node.js and the PHP deliverable.
```

---

## What these prompts do and do not produce

Worth knowing before you paste one, so you can add the missing line yourself.

**You get, without asking:** both languages in full, a `preview.html` that
renders the sample posts with no server and no token, the server-side fetch, the
5-minute file cache, the stale-on-failure fallback, an empty state, escaped
output, the token kept out of the rendered HTML, a README that documents both,
and step-by-step run instructions. That is the part that decides whether the
thing survives contact with real traffic, and it is fully specified — in the
[build brief](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md)
and the specs it links, which is why the prompts themselves are short.

**The one failure mode of the link-based prompts:** an AI that silently could
not fetch a link builds from memory, and memory means another social-wall API.
That is exactly why Prompt 1 spells the facts out inline — nothing to fetch,
nothing to fail. The link-based prompts tell the AI to say so in one line
instead of pretending, and if your tool cannot browse at all, use the
paste-the-files route in
[when the AI cannot browse](#when-the-ai-cannot-browse).

**API calls it will make:** one per cache period — roughly **288 a day** at a
5-minute TTL, no matter how many visitors. Two things break that number, and
both are covered in the prompts: a per-process cache (multiply by the number of
PHP-FPM workers or Node instances) and uncached pagination (scales with clicks,
not with time). If you host the same gallery on several sites, each one counts
separately against the daily ceiling.

**You DO get a styled page, on brand.** The full token set (palette, type
scale, radius, elevation, focus ring, card treatment, responsive rule) plus a
the shipped themes, AA-checked contrast and the page shell live in the
[design spec](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md),
so the first render already looks like ours instead of an unstyled list. The
layout is decided too: **Prompt 1** and **Prompt 2** both build a WALL mosaic,
because a page and a full-width section each have the width for one. It is a
bracket you can swap. Iterate on the look with
[Prompt 3](#prompt-3--design-the-widget-iterate-on-looks); it reuses the same
tokens, so restyling never drifts off-brand.

Also only-if-you-ask: video playback (`<video>` for video media), carousels
(`expand=album`), shopping tags (`expand=products`), filters, a network bar,
auto-refresh, i18n, and accessibility beyond the contrast and focus rules the
tokens already carry.

## Getting good results — four habits

1. **Link the spec, don't retype it.** The three raw URLs are the prompt's
   payload: field names like `content.text` and `media[].cdn_url` are not
   guessable, and an AI that has them in front of it stops inventing. Keep
   the links; drop anything else you don't need. If your tool cannot fetch
   them, paste the files ([when the AI cannot browse](#when-the-ai-cannot-browse))
   — "see the attached spec" with nothing attached is the one way this fails.
2. **State the constraints** — they are what separate a demo from something
   shippable: server-side rendering, token in an env var, 5-minute cache with
   a stale fallback, escaped output, cursor pagination via `next_cursor`.
3. **Ask at the end, not at the start.** An assistant told to ask before
   starting ends its turn with questions and a plan, and the code only arrives
   after you answer (Gemini does this literally). So the prompts put the
   question last: code first, then "what is your token?" — you get both, in
   the order that wastes none of your time. Keep that ordering if you rewrite
   a prompt.
4. **Iterate in small steps**: one prompt = one change ("make it masonry",
   "swap file cache for Redis"). When something breaks, paste the exact error
   back and ask for the corrected complete file — and say "both languages", or
   you will get one of them.

## What an AI gets wrong unless you tell it

Assistants have read a lot of other social-wall APIs, and that muscle memory
is what produces code that looks right and returns nothing. Each line below is
already inside the three linked files — this is what the links are buying you.

| It will assume                            | Actually                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| Posts are at the top level of the JSON    | They are at `body.posts` — every response is enveloped                          |
| `?fields=id,comment,…` slims the response | There is no `fields` parameter; the full post object always comes back           |
| `after=<last post id>` pages forward      | `after` takes the opaque `paging.next_cursor`; an id is a 422                    |
| `media[0]` is the image                   | `media[0]` can be a video FILE; pick the first entry whose `type` is `"image"`   |
| Missing values are `""` or `0`            | They are `null` — including `network.name` and `author.name`                     |
| The default sort needs fixing             | It is already pinned-first, then newest by creation time                        |
| The page can fetch the API from JavaScript | It would succeed — and hand your token to every visitor. Only your server calls Tagembed, and the posts are in the HTML before it is sent |
| A separate stylesheet is fine             | The CSS lives inside `server.js`, inside `index.php` and inside `preview.html`; each file runs alone |
| The sample-data preview can just fetch the API | `preview.html` calls nothing — the sample posts are already markup inside it. Fetching there would mean a token in the browser |
| The preview may as well be `index.html`   | It is `preview.html`: an `index.html` next to `index.php` is served *instead* of it by most Apache and nginx setups |
| One language is enough                    | Every build ships both: the Node.js set and the single-file PHP                 |
| Posts can be created or hidden via API    | Read-only. Moderation happens in the dashboard                                  |
