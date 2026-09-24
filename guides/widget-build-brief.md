# Build brief — one link an AI can follow

The complete brief for building a Tagembed social widget, in one fetchable file,
so a prompt can stay four lines. It binds together the two specs and adds the
few things neither of them says:

| Read | For |
| ---- | --- |
| [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) | the API: endpoints, envelope, field names, and the numbered **Integration rules** for generated code |
| [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md) | the looks: `--tbd-*` tokens, how a theme maps onto them, card treatment, REEL and MOSAIC layouts, states |
| [themes/README.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md) | the theme catalogue: 19 themes, each with a thumbnail, its layout and its values — the user picks one |
| this file | the delivery contract: what to hand over and how it is wired |

**Agents: fetch them RAW.** A summarising fetch drops the field names,
which are the one thing that cannot be guessed.

Nothing here overrides llms.txt. Where this file is silent, its Integration
rules decide.

---

## 0. Ask first — theme, then language

Two choices change what gets built, so they are asked **before any code**, one
question per reply:

1. **Theme.** Fetch the [theme catalogue](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md) raw
   and show its theme picker the way it says — the thumbnails page itself,
   rendered (an HTML artifact, or the page opened in their browser), **never a
   list of theme names** — and ask which one they want. Stop there.
2. **Language.** Once they pick, ask which language the server code should be
   in. Any server-side language is fine — PHP, Node.js, Python, Go, Java, C#,
   … — or a framework they name. Their answer starts the build — do not
   repeat the choices back or ask them to confirm.

Skip a question the prompt already answers. Never pick either one for them.
The build starts on the language answer, and it is written in exactly that
language — never swapped for another one.

## 1. What to build

**It is a Social Widget.** Use that name in the page title, the header, the
README and the code comments — never "social wall".

**Server-rendered, always.** The page arrives with the posts already in the
HTML. Nothing in the browser calls anything — not the Tagembed API, and not an
endpoint of their own:

```
     [ browser ]        complete HTML, posts already in it, no fetch
          ▲
          │  a whole page
          │
   [ their server ]     holds ACCESS_TOKEN, caches 5 min, renders the HTML
          │
          ▼
   GET {API_BASE_URL}/v3/posts   Authorization: Bearer …
```

No mount point, no widget script, no same-origin JSON endpoint, no `data-`
attributes. One request from the browser gets a finished page.

**Deliver the language they picked** (§0), as the real file(s) it runs —
plus `preview.html`. Never write a second language unless they ask for it.

**A plain language** (the usual case) — **one file**, with that language's own
extension:

| They said | File | They run |
| --------- | ---- | -------- |
| Python | `app.py` | `python app.py` |
| Node.js | `server.js` | `node server.js` |
| PHP | `index.php` | `php -S localhost:8080` |
| Go | `main.go` | `go run main.go` |
| any other | its own entry file | its own one-line run command |

That one file holds everything — the API call, the cache, the HTML and the
CSS — and uses **only the language's standard library** (Python `http.server`
+ `urllib`, Node.js 18+ `http` + the built-in `fetch`, Go `net/http`): nothing
to install, no dependency file. It reads a `.env` beside it on its own when
one exists (a few lines, no package), so running it is the one command in the
table. Only where the language has no built-in web server (Ruby 3, for one)
does it take the single smallest package, and the README says so.

**A framework they named** (Flask, Django, Express, Laravel, Next.js, Spring
Boot, Rails, …) — the files that framework needs to serve this page, in its
normal layout: entry point, route, view or template, config and its dependency
file, and nothing it does not need.

Either way it is **ready to run**: they run the README's command and the page
is up — no missing file, no placeholder, no "add your routes here". The code
writes its cache beside itself (`cache/posts.json`) and creates the directory
if it is missing. `README.md` (§6) comes **in the same reply as the code**,
never on its own.

**And one static file, whichever language they picked:**

| File | Holds |
| ---- | ----- |
| `preview.html` | the same page with the §4 sample posts already expanded into markup — the same CSS, the same layout, no server, no build step, no token, and no call of any kind. It opens from a double-click |

`preview.html` is how the design gets reviewed before a token exists, on a
machine with no server language installed, and inside a chat that can run
nothing. It must call **nothing**: no `fetch`, no API request, not even a
same-origin one — the posts are in the file already. Its only JavaScript is the picked theme's own slider-arrow `<script>`, when the theme has one, and it carries the §4 "preview data" note.

Name it `preview.html`, **never `index.html`**: an `index.html` sitting beside
the server's entry file (`index.php` above all) is served *instead of it* by
most Apache and nginx configurations and by static-file middleware, so the
first upload would quietly swap the live page for the sample one.

`preview.html` and the server file render the same layout from the same design
tokens, so they look identical in a browser and any restyle has to land in
both at once. The layout is the one the picked theme shows.

## 2. Configuration — the token is asked at the end, never hard-coded

| Value | Environment variable | Where the user gets it |
| ----- | -------------------- | ---------------------- |
| Token | `ACCESS_TOKEN` | their dashboard — the four steps below; an account key, or a `wt1_…` wall token |
| API base URL | `API_BASE_URL` (strip a trailing slash) | always `https://api.tagembed.com/api` — a constant; the variable exists only so another host can be pointed at |

Only the token is theirs to fetch: the base URL is a constant, so default to
it rather than asking as though they had to look it up.

When you ask for the token at the end, give the steps, not a vague "paste your
token":

1. Log in to your Tagembed dashboard.
2. Open the gallery you want the posts from, or create one.
3. On that gallery's card, click the **⋮** (three dots) menu.
4. Click **Access Token** and copy the value.

If "Access Token" is not in that menu, say so plainly and stop there — do not
speculate about why, and do not tell them to buy or upgrade anything. Theme
and language are the only questions asked up front (§0). The token is not one of
them: the code reads it from the environment, so it is complete without it —
ask for it at the end of the README reply and offer to write it into a `.env`.
Never hard-code either value. Ship an example
env file with empty values, never a real token. The token is read on the
server and printed nowhere: it must not appear in the rendered HTML, in a
comment, or in a data attribute.

## 3. Data and caching

Follow llms.txt rules 5–12. In short: one call to
`GET {API_BASE_URL}/v3/posts?limit=24`, default sort kept (pinned first,
then newest), payload at `body.posts` / `body.paging`, check the HTTP status
**and** the envelope `status` flag, a 5-minute cache on disk, the last-good
copy served on failure, every printed value escaped.

- Cache to a JSON file, read it when it is younger than 5 minutes, otherwise
  refresh. Every language does this the same way, so the README describes it
  the same whichever one was picked.
- One cache at a 5-minute TTL ≈ **288 API calls a day**, whatever the traffic.
  Say in one line what the TTL you implemented will cost them.
- If they run several workers or instances (PHP-FPM, a Node cluster,
  gunicorn workers), each keeps its own file
  cache unless they point it at shared storage — say so rather than silently
  multiplying their daily count.
- More than one page of posts: `paging.next_cursor` goes back as `after` on a
  normal server-side request — a link or a form, never a browser fetch. Keep
  the same `sort` across pages or the cursor 422s.

## 4. States

Design spec §6: an empty result and a failed request both render as real
markup inside the page — never a blank body and never a stack trace. A stale
cached copy beats an error. Ship the inline `SAMPLE_POSTS` preview fallback so
the design can still be reviewed before a token exists (llms.txt rule 12).

The same posts are what `preview.html` renders. Take them from the one file
that matches the picked theme — [sample-posts-social.json](sample-posts-social.json)
for a social theme, [sample-posts-reviews.json](sample-posts-reviews.json) for a
review theme (Review Box, Review Carousel, Review List, Rating Badge, Badge),
never both — fetched raw — use every post in it — and copy every media URL
character for character: never retype, shorten or invent one. If you cannot
reach it, write 8–12 posts in the same shape with no media rather than a
made-up URL; for a review theme every one carries a `rating`, or the widget
never shows its star rating. Video posts
and the media placeholder follow the design spec §3. The whole build is skinned from the theme picked in §0,
from the [theme catalogue](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md). The picked theme's preview file
(`guides/previews/<theme>.html`) is the **template**: copy the whole file as it
is and inject the posts — replace the sample cards between its
`<!-- tbd:cards -->` marks with one card per post from its
`<template id="tbd-card-template">`, each `{{slot}}` filled as the catalogue's
"Filling the card" says. `preview.html` fills it from these sample posts, the
server code from `body.posts` on every request; the thumbnail is only for the
question. How those values map onto the design tokens is in the design spec,
under **Themes** in section 2. One theme is the entire skin: no light/dark
mode, no toggle.

## 5. Styling

The CSS lives inside the deliverable — inside the server file (`app.py`,
`server.js`, `index.php`, …) or the framework's template, and inside
`preview.html` — not in a separate stylesheet. It is the picked theme's
preview `<style>` block (`guides/previews/<theme>.html`), copied as it is, and
the markup is that file's own, with the posts injected (§4). The same CSS in `preview.html` and the server file, so
the preview is worth trusting. The page is theirs, so it
may own `:root` and `<body>` freely. Tokens, layouts, themes and contrast
rules: the design spec.

## 6. Hand-off

Deliverable first, commentary last — no opening plan of what you are about to
build.

1. **Every file, complete, with its exact path** — `preview.html` and the
   server file(s) in the picked language — one part per reply when the prompt
   splits the build into parts.
2. **`README.md`, in the same reply as the server code** — never a reply of
   its own. It is a deliverable and not a summary. It covers the picked
   language only and contains: what this is and which theme it wears; the
   file list; how to set
   `API_BASE_URL` and `ACCESS_TOKEN`; how to check the language is installed
   and the one command that runs it (written for someone who has never used a
   terminal) and the URL to open; that
   `preview.html` needs none of that — it is opened by double-clicking it, and
   it is a design preview, not the page to deploy; how the cache
   works and how to change the TTL; how to change the layout and the colours;
   one `curl` that checks the Tagembed API directly with what a good response
   looks like; and a short "if it goes wrong" list — 401, empty page, stale
   posts.
3. Ask for the token, offering to write it into `.env`.
4. Any assumptions you made, listed at the end — theme and language are the only
   things asked at the start.
5. **No tests.** Do not write or run tests, audits or checks — no
   accessibility or contrast scripts, no auth or 401 flow tests, no curl
   calls, no test files. The `curl` in the README is for the user to run.

If you cannot write files (a browser chat), output every file complete with its
filename, then that same README.

## 7. Things this API does not have — do not add them

Already in llms.txt, and the four an assistant invents anyway:

- no `fields` parameter — every response carries the full post object;
- `after` is not a post id — it is the opaque `paging.next_cursor`, passed back
  verbatim;
- no `networks` and no `wall_id` parameter — filter by network with `feed_ids`;
- no write endpoints, no RSS feed, no `include_source` (each post already
  carries a `network` object). Moderation happens in the dashboard.
