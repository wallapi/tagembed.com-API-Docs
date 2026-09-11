# Prompt Library — build your embed with any AI

Copy-paste prompts for designing and integrating a social wall with the
Tagembed Developer API (v3). Pick one, fill in the `[BRACKETED]` choices, and
paste it into your AI — every prompt works in both modes:

- **In-editor agent** (Claude Code, Cursor, Codex, Copilot, Antigravity): the
  agent creates and edits files in your project directly. Put the
  [context file](build-a-social-wall.md#per-tool-context-files) and a copy of
  [llms.txt](../llms.txt) in the project first; then these prompts can be short.
- **Browser AI** (ChatGPT, Gemini, claude.ai — no filesystem access): add
  the [Prompt 0 line](#prompt-0--browser-ai-line) so the AI outputs every file
  complete and ready to save, plus a setup checklist.

Want a tool-specific walkthrough instead (install, where the context file
goes, PHP and Node.js prompts, run commands)? Use the per-tool documents in
[../prompts/README.md](../prompts/README.md).

Always attach or paste the contents of [llms.txt](../llms.txt) with the first
message — it is the API spec (endpoints, field names, envelope, pagination);
without it the AI will guess.

---

## Prompt 0 — Browser-AI line

Browser tools (ChatGPT, Gemini, claude.ai) cannot create files for you. Add
this one line to any prompt and they hand you complete files with a header
naming where each goes, plus a setup checklist:

```
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
```

---

## Prompt 1 — Standalone wall page

Four lines. The rules (server-side token, envelope, default sort, 5-minute
cache with stale fallback, escaping, code before questions) live in llms.txt,
and the agent reads them there. Tested on a fresh agent: it fetched the repo
README, then llms.txt, then the endpoint and Post object pages, and produced
a correct wall without a single question.

```
Build me a social wall: one web page that shows the live posts from my Tagembed wall.
API docs: https://github.com/wallapi/tagembed.com-API-Docs - read llms.txt there and follow its "Integration rules for generated code".
Use Node.js 18+ with Express: server.js and package.json. Token comes from the TAGEMBED_ACCESS_TOKEN env var, so don't ask me for it.
Give me the complete code first, then tell me how to run it as if I've never used a terminal.
```

PHP instead: swap the third line for
`Use PHP 8: one self-contained index.php, nothing to install.`

Browser AI (ChatGPT, Gemini, claude.ai)? Add a fifth line:

```
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
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
Add a network filter bar above the feed. There is no networks
parameter: a feed is one network's source on the wall, so filter with
?feed_ids= using the feed ids of the selected network. Each post
carries feed_id and network.name, so build the bar from the posts you
already have. Selecting a filter must go through my server
route/proxy - never call the Tagembed API from the browser.
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
   `content.text` / `media[].cdn_url` are not guessable.
2. **State the constraints** — they are what separate a demo from shippable:
   key server-side in an env var, 5-minute cache with stale fallback,
   escaped output, cursor pagination via `next_cursor`.
3. **Never write "ask me first"**: a browser AI that is told to ask before
   starting will end its turn with questions and a plan, and the code only
   arrives after you answer (Gemini does this literally). The base URL is in
   `llms.txt` and the token comes from `TAGEMBED_ACCESS_TOKEN`, so nothing needs
   asking. If you want the AI to confirm something, say "build it now with
   sensible defaults and list your assumptions at the end".
4. **Iterate in small steps**: one prompt = one change ("make it masonry",
   "swap file cache for Redis"). When something breaks, paste the exact error
   back and ask for the corrected complete file.
