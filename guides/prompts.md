# Prompt Library — build your social widget with any AI

Copy-paste prompts for building a **server-rendered social widget** with the
Tagembed Developer API (v3). Start with
[Prompt 1](#prompt-1--the-main-prompt-start-here), paste it, answer its two
questions (which theme — shown as the thumbnail pictures — then which language
you want the server code in), and set the token it asks you for
at the end — that is the whole workflow.

**The prompts live in files, not in this page.** Every prompt below is one
short block: your choices, plus one raw URL per deliverable, all in
[prompts/library/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library).
The AI fetches those files, and they link the files below, so it has
the full contract without you pasting sixty lines.
They are raw URLs on purpose — a `github.com/…/blob` link returns an
HTML page, the raw one returns the file:

| File | What it carries | Raw URL to paste |
| ---- | --------------- | ---------------- |
| Build brief | what to build, the file manifest, the delivery checklist — and it links the other two | [widget-build-brief.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md) |
| API spec | endpoints, envelope, field names, integration rules | [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) |
| Theme catalogue | the 17 widget themes — a thumbnail to pick from and an HTML preview to build from; the AI shows you the thumbnails first, as pictures | [themes/README.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md) |
| Design spec | `--tbd-*` tokens, how a theme maps onto them, card treatment, widget and reel layouts, page shell | [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md) |

All of them live in the public docs repo
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

**You pick the look and the language first.** Before any code, the AI shows
you the theme picker from the [theme catalogue](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md) —
the 17 widget themes as **thumbnail pictures**, rendered as a page (an HTML
artifact in a chat, or the page opened in your browser by an editor agent),
never a list of names — and asks which one you want. Then it asks **which
language you want the server code in** — any server-side language: Python,
PHP, Node.js, Go, Java, C#, … or a framework you name (Flask, Django,
Express, Laravel, …). As soon as you answer, it starts to build — no confirm
step — in exactly that language:

| You say | You get | You run |
| ------- | ------- | ------- |
| Python | `app.py` — **one file**: the API call, the cache, the HTML and the CSS | `python app.py` |
| Node.js | `server.js` — one file, same contents | `node server.js` |
| PHP | `index.php` — one file, same contents | `php -S localhost:8080` |
| Go | `main.go` — one file, same contents | `go run main.go` |
| any other language | its own one entry file | its own one command |
| a framework | the files that framework needs, in its normal layout | its own run command |

A plain language uses only its standard library, so there is nothing to
install; the file reads a `.env` beside it on its own. And **`README.md` for
that language comes in the same reply as the server code** — how to check the
language is installed, the one command that runs it, where the token goes.

**And one file every build gets: `preview.html`.** The same widget, the same
CSS, with the sample posts written straight into the HTML — no server, no
token, no API call anywhere in it. Double-click it and the design is on screen,
which is how you review the look before you have a token, on a laptop with no
server language installed, or in a chat window that cannot run one. Because
it and the server file render the same markup from the same tokens, a restyle
has to land in both or they drift apart. Its skin is the theme you picked: its
preview HTML is copied for the layout, every colour, the font, the radius and
the spacing (the thumbnail is only for picking). That is the whole skin — no light/dark switch anywhere in the
build. How the values map onto the tokens is in [the design spec](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md),
under **Themes** in section 2, and the build names the theme it used.

It is `preview.html` and not `index.html` on purpose: an `index.html` sitting
next to the server's entry file (`index.php` above all) is served *instead* of it by most Apache and nginx
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
the _end_, once the code is already written — the only questions before the
code are the theme and the language, and the token is not needed for either. The code reads both from
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

One prompt, pasted once, and one link: [steps.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/steps.md).
It walks you through four short steps, one reply each — **theme** (the
thumbnail picker, never a list of names), **preview** (the finished
`preview.html` for that theme, nothing to fill in), **customise** (optional -
colours, font, columns... as a `custom.css`), then **stack**: PHP, Node.js,
React or Simple HTML hand you a link to a finished, already-tested
`social-widget-<stack>.zip` from [templates/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/templates) — no
code written, no waiting — while naming anything else (Laravel, Django,
Next.js, Python, Go, ...) ports that same finished code into your stack, fast,
using the closest bundle as the reference. Either way you get a runnable
build plus its `README.md` in the same reply.

```
Build me a social widget from my Tagembed gallery.
Fetch this RAW and follow it exactly - it lists every step and when
to stop and wait for my answer. Start with step 1 now:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/steps.md
If you cannot open a link, say so in one line - do not build from memory.
```

## Prompt A — the short alternative (AI that can browse)

Same questions first, same result, driven by the build brief instead of
`common.md`: its parts in [quick-start/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library/quick-start) point at the build brief, which names
what to build and links the API and design specs. Prompt 1 is the safer
default — its `common.md` carries the facts itself, so nothing breaks when a
later fetch silently fails.

```
Build me a social widget from my Tagembed gallery (from the build brief).
First ask me two things, ONE question per reply, and write no code
until I answer both:
Q1 - theme: fetch this RAW and show me its theme picker the way it
says - the thumbnails page itself, rendered (an HTML artifact, or the
page opened in my browser), never a list of theme names - and ask
which one I want:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
Q2 - language: once I pick, ask which language I want the server code
in - any server-side language (PHP, Node.js, Python, Go, ...) or a
framework I name - and build in exactly that one.
As soon as I answer Q2, start the build - do not repeat my choices or
ask me to confirm. The build comes in 2 parts. Deliver ONE part per
reply: fetch only that part's link RAW, follow it exactly and write
its files complete - then stop, and end the reply with one line naming
the next part. Do not fetch or write a later part until I reply "next".
1. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/quick-start/preview.md
2. the runnable server files in my language, with their README.md in the same reply
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/quick-start/server.md
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
   for Prompt 1, `build/steps.md`, then the picked theme's preview from
   `guides/previews/`, and for PHP/Node.js/React/Simple HTML the matching
   `templates/dist/social-widget-<stack>.txt` plus that theme's
   `templates/themes/<slug>.css` and `.json` (any other stack: paste the
   closest one of those as the reference and name your stack).
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
will scan the project and adapt; in a browser AI, tell it your language or
framework. The parts
are in [integrate/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library/integrate).

```
Render a Tagembed social widget INTO my existing website.
My stack: [plain PHP | Python/Django | Express | describe yours]. Cache in
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
minimal | editorial with a serif headline]. It comes in 2 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its files complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". The server part is for whatever
language my server code is in - keep it in that language.
1. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/restyle/preview.md
2. the server code
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/restyle/server.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Add a network filter bar above the widget. It comes in 2 parts, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its files complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". The server part is for whatever
language my server code is in - keep it in that language.
1. the server code
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/network-filter/server.md
2. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/network-filter/preview.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Add a "Next page" link under the widget. It comes in 1 part, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its files complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". The server part is for whatever
language my server code is in - keep it in that language.
1. the server code
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/pagination/server.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Auto-refresh the page every [60] seconds for signage. It comes in 1 part, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its files complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". The server part is for whatever
language my server code is in - keep it in that language.
1. the server code
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/auto-refresh/server.md
If you cannot open a link, say so in one line - do not build from memory.
```

```
Show carousels and shopping tags. It comes in 1 part, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its files complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". The server part is for whatever
language my server code is in - keep it in that language.
1. the server code
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/carousel-products/server.md
If you cannot open a link, say so in one line - do not build from memory.
```

---

## Prompt 4 — Upgrade or change the cache

The parts are in [cache-upgrade/](https://github.com/wallapi/tagembed.com-API-Docs/tree/main/prompts/library/cache-upgrade); the bracket choices
travel in the prompt.

```
Change the caching layer to [Redis | Memcached | my framework's cache |
stale-while-revalidate], TTL [5] minutes. It comes in 1 part, listed below.
Deliver ONE part per reply: fetch only that part's link RAW, follow
it exactly and write its files complete - then stop, and end the
reply with one line naming the next part. Do not fetch or write a
later part until I reply "next". The server part is for whatever
language my server code is in - keep it in that language.
1. the server code, with its updated README.md in the same reply
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/cache-upgrade/server.md
If you cannot open a link, say so in one line - do not build from memory.
```

---

## What these prompts do and do not produce

Worth knowing before you paste one, so you can add the missing line yourself.

**You get, after two questions (theme, then the server language):** the
server code in the language you picked, ready to run, a `preview.html` that
renders the sample posts with no server and no token, the server-side fetch, the
5-minute file cache, the stale-on-failure fallback, an empty state, escaped
output, the token kept out of the rendered HTML, a README for your language
(delivered with the server code),
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
PHP-FPM workers, Node instances or gunicorn workers) and uncached pagination (scales with clicks,
not with time). If you host the same gallery on several sites, each one counts
separately against the daily ceiling.

**You DO get a styled page, on brand.** The full token set (palette, type
scale, radius, elevation, focus ring, card treatment, responsive rule), how a
theme maps onto it, AA-checked contrast and the page shell live in the
[design spec](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md),
so the first render already looks like ours instead of an unstyled list. The
layout is decided too: in **Prompt 1** it is the theme you pick — its
preview HTML is what you get. **Prompt 2** builds a MOSAIC, because a full-width
section has the width for one; it is a bracket you can swap. Iterate on the look with
[Prompt 3](#prompt-3--design-the-widget-iterate-on-looks); it reuses the same
tokens, so restyling never drifts off-brand.

Video posts play without asking: a `<video>` with controls and the post's
photo as its poster. A chat's own preview pane (Claude's artifact view,
ChatGPT canvas) blocks outside photos and video, so there each one shows as a
coloured tile with the network name; open `preview.html` in a browser for the
real media.

Also only-if-you-ask: carousels
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
3. **Choices first, token last.** The theme and the language change what gets
   built, so the prompts ask for those before any code — one short question
   per reply, and the build starts on the last answer — no confirm step. The token changes nothing in the code
   (it is read from the environment), so it is asked last: code first, then
   "what is your token?". Keep that ordering if you rewrite a prompt.
4. **Iterate in small steps**: one prompt = one change ("make it masonry",
   "swap file cache for Redis"). When something breaks, paste the exact error
   back and ask for the corrected complete file — in your language.

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
| A separate stylesheet is fine             | The CSS lives inside the server file (`app.py`, `server.js`, `index.php`, …) and inside `preview.html`; each file runs alone |
| It can pick the theme and the language    | It asks you first: which theme (showing the thumbnail picker, not a list of names), then which language — and builds in exactly that one |
| The sample-data preview can just fetch the API | `preview.html` calls nothing — the sample posts are already markup inside it. Fetching there would mean a token in the browser |
| The preview may as well be `index.html`   | It is `preview.html`: an `index.html` next to the server entry file (`index.php` above all) is served *instead* of it by most Apache and nginx setups |
| Posts can be created or hidden via API    | Read-only. Moderation happens in the dashboard                                  |
