# Prompt Library — build your social widget with any AI

Copy-paste prompts for building a **server-rendered social widget** with the
Tagembed Developer API (v3). Start with
[Prompt 1](#prompt-1--the-main-prompt-start-here), paste it, set the token it
asks you for at the end — that is the whole workflow.

**The prompts live in files, not in this page.** Every prompt below is one
short block: your choices, plus one raw URL per deliverable, all in
[prompts/library/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library).
The AI fetches those files, and they link the three specs below, so it has
the full contract without you pasting sixty lines.
They are raw URLs on purpose — a `github.com/…/blob` link returns an
HTML page, the raw one returns the file:

| File | What it carries | Raw URL to paste |
| ---- | --------------- | ---------------- |
| Build brief | what to build, the file manifest, the delivery checklist — and it links the other two | [widget-build-brief.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md) |
| API spec | endpoints, envelope, field names, integration rules | [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) |
| Design spec | `--tbd-*` tokens, the shipped themes in themes-lite.json, card treatment, widget and reel layouts, page shell | [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md) |

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
| `README.md` — documents **both** languages | covered by the same README |

**And one file both of them share: `preview.html`.** The same widget, the same
CSS, with the sample posts written straight into the HTML — no server, no
token, no API call anywhere in it. Double-click it and the design is on screen,
which is how you review the look before you have a token, on a laptop with no
PHP and no Node installed, or in a chat window that cannot run either. Because
all three render the same markup from the same tokens, a restyle has to land in
all three or they drift apart. Its skin comes from
[themes-lite.json](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes-lite.json) — the 23 shipped widget themes as data. One theme
supplies every colour, the font, the radius, the spacing, the column count and
the author/date toggles, and that is the whole skin: no light/dark switch
anywhere in the build. The field-by-field mapping is in [the design spec](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md),
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

One prompt, pasted once — then type **next** after each reply. The AI writes
one file per reply, so every reply stays short and fast instead of one long
reply that runs out of room or times out. The full brief is split per
deliverable into four files in [build/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library/build) — `preview.md`, `php.md`, `nodejs.md` and
`readme-file.md` — and the prompt just links them. Each part fetches the shared
rules ([common.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/common.md) — data, field names, looks,
security), and the two server parts also fetch the cache contract
([cache.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/cache.md)). Those two carry the facts that cannot be
guessed, so the build still works when the AI then fails to open the specs
they link.

```
Build me a social widget from my Tagembed gallery. It comes in 4 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/preview.md
2. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/php.md
3. server.js + package.json
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/nodejs.md
4. README.md
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/readme-file.md
If you cannot open a link, say so in one line - do not build from memory.
```

## Prompt A — the short alternative (AI that can browse)

Same result, driven by the build brief instead of `common.md`: its four parts
in [quick-start/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library/quick-start) point at the build brief, which names
what to build and links the API and design specs. Prompt 1 is the safer
default — its `common.md` carries the facts itself, so nothing breaks when a
later fetch silently fails.

```
Build me a social widget from my Tagembed gallery (from the build brief). It comes in 4 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/quick-start/preview.md
2. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/quick-start/php.md
3. server.js + package.json
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/quick-start/nodejs.md
4. README.md
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/quick-start/readme-file.md
If you cannot open a link, say so in one line - do not build from memory.
```

---

## Prompt 0 — Browser-AI preamble

Prepend this when you are NOT in a code editor (ChatGPT/Gemini/claude.ai
web), in the same message as the build prompt
([browser-preamble.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/browser-preamble.md)). It makes the AI hand you finished files and exact setup steps instead of
fragments.

```
Before the build prompt below: I am in a browser chat.
Fetch this RAW and follow it exactly:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/browser-preamble.md
If you cannot open it, say so in one line - do not build from memory.
```

---

## When the AI cannot browse

Some tools cannot fetch a URL at all (a locked-down enterprise chat, an offline
model, an editor with web access switched off). Then the links carry nothing —
so paste the files instead of the prompt's link list:

1. Open the prompt's file from
   [prompts/library/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library)
   and paste the text of every file the prompt links instead of the prompt —
   for Prompt 1, `build/common.md`, `build/cache.md`, then its four parts.
2. Attach or paste [llms.txt](../llms.txt) and
   [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md)
   in the first message, then the prompt.
3. In-editor agents: drop both files in the repo once (see the
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
will scan the project and adapt; in a browser AI, tell it your stack. The parts
are in [integrate/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library/integrate).

```
Render a Tagembed social widget INTO my existing website.
My stack: [plain PHP | Express | describe yours]. Cache in
[file | Redis | my framework's cache]. Layout: [MOSAIC | reel rail |
uniform grid | vertical feed]. It comes in 3 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. the widget section in my site
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/integrate/section.md
2. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/integrate/preview.md
3. what changed and how to check it
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/integrate/summary.md
If you cannot open a link, say so in one line - do not build from memory.
```

---

## Prompt 3 — Design the widget (iterate on looks)

Follow-up prompts after Prompt 1 or 2 — send them one at a time, iterate
small. Fill in the brackets, and type **next** after each reply: like every
prompt here, they deliver one file per reply. Each prompt's parts are in its own folder in
[prompts/library/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library): a `change.md` with what changes, fetched by each
part, and one part per file it touches. The layouts these reference (widget,
reel, grid) are specified in the
[design spec](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md).

```
Restyle the widget as a [MOSAIC | REEL rail | 3-column card grid |
full-screen signage view] with [rounded cards + soft shadows | flat
minimal | editorial with a serif headline]. It comes in 3 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/restyle/preview.md
2. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/restyle/php.md
3. server.js
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/restyle/nodejs.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Add a network filter bar above the widget. It comes in 3 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/network-filter/php.md
2. server.js
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/network-filter/nodejs.md
3. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/network-filter/preview.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Add a "Next page" link under the widget. It comes in 2 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/pagination/php.md
2. server.js
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/pagination/nodejs.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Auto-refresh the page every [60] seconds for signage. It comes in 2 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/auto-refresh/php.md
2. server.js
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/auto-refresh/nodejs.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Show carousels and shopping tags. It comes in 2 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/carousel-products/php.md
2. server.js
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/carousel-products/nodejs.md
If you cannot open a link, say so in one line - do not build from memory.
```

---

## Prompt 4 — Upgrade or change the cache

The parts are in [cache-upgrade/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library/cache-upgrade); the bracket choices
travel in the prompt.

```
Change the caching layer to [Redis | Memcached | my framework's cache |
stale-while-revalidate], TTL [5] minutes. It comes in 3 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its file complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". Start with part 1 now.
1. index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/cache-upgrade/php.md
2. server.js + package.json
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/cache-upgrade/nodejs.md
3. README.md
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/cache-upgrade/readme-file.md
If you cannot open a link, say so in one line - do not build from memory.
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
not fetch a link builds from memory, and memory means another social-widget API.
That is exactly why Prompt 1's shared `common.md` and `cache.md` spell the
facts out themselves — the unguessable parts arrive with each part's own fetch. The link-based prompts tell the AI to say so in one line
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
layout is decided too: **Prompt 1** and **Prompt 2** both build a MOSAIC,
because a page and a full-width section each have the width for one. It is a
bracket you can swap. Iterate on the look with
[Prompt 3](#prompt-3--design-the-widget-iterate-on-looks); it reuses the same
tokens, so restyling never drifts off-brand.

Also only-if-you-ask: video playback (`<video>` for video media), carousels
(`expand=album`), shopping tags (`expand=products`), filters, a network bar,
auto-refresh, i18n, and accessibility beyond the contrast and focus rules the
tokens already carry.

## Getting good results — four habits

1. **Link the spec, don't retype it.** The raw URLs are the prompt's
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

Assistants have read a lot of other social-widget APIs, and that muscle memory
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
| One language is enough                    | Every build ships both: the Node.js set and the single-file PHP                 |
| The sample-data preview can just fetch the API | `preview.html` calls nothing — the sample posts are already markup inside it. Fetching there would mean a token in the browser |
| The preview may as well be `index.html`   | It is `preview.html`: an `index.html` next to `index.php` is served *instead* of it by most Apache and nginx setups |
| Posts can be created or hidden via API    | Read-only. Moderation happens in the dashboard                                  |
