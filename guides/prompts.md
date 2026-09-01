# Prompt Library — build your embed with any AI

Copy-paste prompts for designing and integrating a social wall with the
Tagembed Developer API (v3). Pick one, fill in the `[BRACKETED]` choices, and
paste it into your AI — every prompt works in both modes:

- **In-editor agent** (Claude Code, Cursor, Codex, Copilot, Antigravity): the
  agent creates and edits files in your project directly. Put the
  [context file](build-a-social-wall.md#per-tool-context-files) and a copy of
  [llms.txt](../llms.txt) in the project first; then these prompts can be short.
- **Browser AI** (ChatGPT, Gemini, claude.ai — no filesystem access): start
  with [Prompt 0](#prompt-0--browser-ai-preamble) so the AI outputs every file
  complete and ready to save, plus a setup checklist telling you where each
  file goes and what to configure.

Always attach or paste the contents of [llms.txt](../llms.txt) with the first
message — it is the API spec (endpoints, field names, envelope, pagination);
without it the AI will guess.

---

## Prompt 0 — Browser-AI preamble

Prepend this when you are NOT in a code editor (ChatGPT/Gemini/claude.ai web).
It makes the AI hand you finished files and exact setup steps instead of
fragments.

```
You cannot access my filesystem, so work in "deliverable mode":

1. Output every file COMPLETE and ready to save - no placeholders, no
   "rest stays the same", no truncation. Start each file with a header
   line naming its exact path, e.g. `### FILE: public/wall/index.php`.
2. After the files, give me a SETUP CHECKLIST with exact steps:
   - where to place each file in my project,
   - which environment variables to set (TAGEMBED_ACCESS_TOKEN,
     TAGEMBED_API_BASE), and where to set them on my hosting
     (.env file, cPanel, Vercel/Netlify dashboard, Docker, etc. -
     ask me which one I use if it matters),
   - any install commands (composer/npm) and how to run it locally,
   - how to verify it works (a curl test and what I should see).
3. If a file is downloadable in this chat, also offer it as a download.
4. When I report an error, reply with the corrected COMPLETE file(s),
   not a diff.

The full API specification is pasted below as llms.txt (also at
   https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) - follow it
exactly for endpoints, field names and the response envelope.
```

---

## Prompt 1 — Standalone wall page

A self-contained page (the [guide](build-a-social-wall.md) shows finished
examples of exactly this).

```
Build me a social wall - a single web page showing the live feed from
the Tagembed v3 API (spec attached as llms.txt, also at
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt).

Choices:
- Language: [PHP | Node.js + Express | Python + Flask]
- Cache: [file cache | in-memory | Redis] with a
  [5]-minute TTL, and ALWAYS fall back to the last good cached copy
  when an API request fails - the wall must never render blank.
- Layout: [masonry grid | uniform card grid | vertical feed]
- Posts per load: [24]

Fixed requirements (not choices):
- Read TAGEMBED_ACCESS_TOKEN and TAGEMBED_API_BASE from environment
  variables; never hard-code them. All API calls run server-side.
- The payload is inside the envelope: body.posts / body.paging.
- Keep the API's default sort (pinned first, then newest).
- For each post render: author.name, network.name, media[0].cdn_url
  (omit the element when media is empty), content.text (as TEXT,
  escaped), and source.permalink as "View original" when present.
- Escape all output (XSS). Semantic markup, minimal CSS I can extend.

When done, tell me exactly how to set the env vars and run it locally.
```

## Prompt 2 — Integrate into my existing website

For dropping the wall INTO a site that already exists. In an editor agent it
will scan the project and adapt; in a browser AI, answer its questions about
your stack first.

```
Integrate a Tagembed social wall into my EXISTING website (API spec
attached as llms.txt). Do not build a standalone app - adjust to my
project's structure, conventions and templating.

My stack: [WordPress | Laravel | Next.js | Express | plain PHP |
describe yours]. If you are running inside my repository, inspect it
and follow its existing patterns; otherwise ask me what you need to
know before writing code.

Deliver:
1. A server-side data layer: fetch GET /v3/posts with my key from
   TAGEMBED_ACCESS_TOKEN, cache for [5] minutes in
   [file | Redis | in-memory | my framework's cache], serve the last
   good copy on failure.
2. A reusable partial/component that renders the feed, matching my
   site's markup conventions, with all output escaped.
3. A route/shortcode/component named [wall] where I can mount it:
   [/community page | a section on the homepage | a WordPress
   shortcode | a React component].
4. NO client-side calls to the Tagembed API - the key never reaches
   the browser. If the frontend needs JSON (e.g. for a "load more"
   button), add a small same-origin proxy endpoint that serves the
   cached data and never exposes the key.

Fit into my existing build/deploy; do not introduce new frameworks.
Tell me which files you added or changed and what I must configure.
```

## Prompt 3 — Design the embed (iterate on looks)

Follow-up prompts after Prompt 1 or 2 — send them one at a time, iterate
small.

```
Restyle the wall as a [masonry grid | 3-column card grid | full-screen
signage view | horizontal carousel] with [rounded cards + soft
shadows | flat minimal | dark theme matching my site]. Keep the data
layer and caching untouched - CSS/markup changes only.
```

```
Add a network filter bar above the feed. Build the list from
GET /v3/networks (server-side, cached with the same TTL), and filter
with the ?networks= parameter. Selecting a network must go through my
server route/proxy - never call the Tagembed API from the browser.
```

```
Add a "Load more" button. Use body.paging.next_cursor passed back as
`after` through my server proxy. Never construct a cursor by hand;
stop when has_more is false.
```

```
Auto-refresh for signage: reload the feed from MY server every
[60] seconds without flicker (swap content in place). The server keeps
its own [5]-minute cache, so this adds no extra Tagembed API calls.
```

```
Show carousels properly: request expand=album and render media[] as a
slider inside the card. Add expand=products and show shopping tags
[title, price, link] under the post when present.
```

## Prompt 4 — Upgrade or change the cache

```
Change the caching layer to [Redis | Memcached | my framework's cache |
stale-while-revalidate: serve the cached copy instantly and refresh in
the background]. Keep the same behavior contract: [5]-minute TTL,
always serve the last good copy on API failure, never render blank.
Show me exactly what to install and which env vars to add
(e.g. REDIS_URL), and keep a file-cache fallback if Redis is down.
```

---

## Getting good results — three habits

1. **Give the spec, don't let it guess**: attach `llms.txt` in the first
   message (in-editor: keep it in the repo). Field names like
   `content.text` / `media[0].cdn_url` are not guessable.
2. **State the constraints** — they are what separate a demo from shippable:
   key server-side in an env var, 5-minute cache with stale fallback,
   escaped output, cursor pagination via `next_cursor`.
3. **Iterate in small steps**: one prompt = one change ("make it masonry",
   "swap file cache for Redis"). When something breaks, paste the exact error
   back and ask for the corrected complete file.
