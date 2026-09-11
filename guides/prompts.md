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

**The brief lives in three files, not in the prompt** — link them (raw URLs, so
the AI gets the file and not a GitHub HTML page) or attach them:

| File | What it carries |
| ---- | --------------- |
| [widget-build-brief.md](widget-build-brief.md) | what to build, wiring, delivery checklist — and it links the other two |
| [llms.txt](../llms.txt) | the API: endpoints, envelope, field names, integration rules |
| [widget-design-spec.md](widget-design-spec.md) | the looks: `--tbd-*` tokens, dark theme, card treatment, reel and wall layouts |

Without them the AI guesses, and it guesses from other social-wall APIs:
field names like `content.text` and `media[].cdn_url` are not derivable.

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

Four lines. The brief is one link: [widget-build-brief.md](widget-build-brief.md)
says what to build and links the API spec and the
[design spec](widget-design-spec.md) itself, so the AI fetches all three and
nothing has to be retyped into the prompt.

```
Build me a social wall: one web page that shows the live posts from my
Tagembed wall.
The brief is here - fetch it RAW, follow it exactly, and fetch the two
specs it links (the API spec and the design spec) as well:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
Use [Node.js 18+ with Express: server.js and package.json | PHP 8: one
self-contained index.php | whatever fits my project]. Don't ask me for
the base URL or the token - they're in TAGEMBED_API_BASE and
TAGEMBED_ACCESS_TOKEN. Write the code now, then tell me how to run it
as if I've never used a terminal.
```

Want an embeddable widget instead of a standalone page? Say "a WIDGET I can
drop into any page of my site" in the first line — the brief and llms.txt
rule 1 cover both, and they differ only in what gets rendered, never in where
the token lives.

Browser AI (ChatGPT, Gemini, claude.ai)? Add the
[Prompt 0 line](#prompt-0--browser-ai-line).

Cannot fetch URLs at all? Attach [llms.txt](../llms.txt) and
[widget-design-spec.md](widget-design-spec.md) with the first message instead;
the prompt stays the same minus the link.

## Prompt 2 — Integrate into my existing website

For dropping the wall INTO a site that already exists. In an editor agent it
will scan the project and adapt; in a browser AI, tell it your stack.

```
Integrate a Tagembed social wall into my EXISTING website. Do not build
a standalone app - adjust to my project's structure, conventions and
templating.

Fetch these RAW and follow them exactly - together they are the whole
brief:
1. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
2. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
3. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md

My stack: [WordPress | Laravel | Next.js | Express | plain PHP |
describe yours]. If you are running inside my repository, inspect it
and follow its existing patterns. Cache in [file | Redis | in-memory |
my framework's cache]. Layout: the WALL in design spec section 5 - the
section has real width on my site. Mount point named [wall] in my
stack's idiom: [a WordPress shortcode | a React component | a
Blade/Twig partial | a <div> + <script> snippet], usable more than
once on the same page.

No client-side calls to the Tagembed API: the token stays server-side,
and anything rendering in the browser reads from a small same-origin
endpoint serving the cached data. Fit into my existing build/deploy;
do not introduce new frameworks. Don't ask me for the base URL or the
token - they're in TAGEMBED_API_BASE and TAGEMBED_ACCESS_TOKEN. Tell me
which files you added or changed and what I must configure.
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

1. **Link the spec, don't retype it**: the raw URLs above are the prompt's
   payload. If the tool cannot browse, attach `llms.txt` and the design spec
   in the first message instead (in-editor: keep them in the repo). Field
   names like `content.text` / `media[].cdn_url` are not guessable.
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
