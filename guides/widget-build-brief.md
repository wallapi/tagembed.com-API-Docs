# Widget build brief — one link an AI can follow

The complete brief for building a Tagembed social wall, in one fetchable file,
so a prompt can stay four lines. It binds together the two specs and adds the
few things neither of them says:

| Read | For |
| ---- | --- |
| [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) | the API: endpoints, envelope, field names, and the numbered **Integration rules** for generated code |
| [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md) | the looks: `--tbd-*` tokens, dark theme, card treatment, REEL and WALL layouts, states |
| this file | the delivery contract: what to hand over and how it is wired |

**Agents: fetch all three RAW.** A summarising fetch drops the field names and
the token values, which are the two things that cannot be guessed.

Nothing here overrides llms.txt. Where this file is silent, its Integration
rules decide.

---

## 1. What to build

Two parts, always:

```
  <div id="tagembed-wall"></div>       the mount point, on any page of theirs
  <script src="/tagembed-widget.js">   the widget: self-contained, scoped styles
            │
            │  fetch('/api/tagembed/posts')     same-origin, no token
            ▼
     [ their server ]                  holds TAGEMBED_ACCESS_TOKEN + 5-min cache
            │
            ▼
     GET {TAGEMBED_API_BASE}/v3/posts   Authorization: Bearer …
```

1. **The endpoint** on their server: calls the API, caches, serves the posts as
   JSON to the widget. The only thing that ever holds the token. It accepts
   only the options you support (`limit`, later a cursor) — never pass
   arbitrary query parameters through to the Tagembed API.
2. **The widget**: a self-contained script that finds its mount element(s),
   fetches from that endpoint, and renders the feed. Plain JavaScript, no build
   step and no framework unless their stack already has one — it has to run
   from a plain `<script>` tag on a page you did not write.

Asked for a page or a section instead of a widget? Same wiring, rendered
server-side — llms.txt rule 1(b).

## 2. Configuration — never ask, never hard-code

| Value | Environment variable |
| ----- | -------------------- |
| API base URL | `TAGEMBED_API_BASE` (strip a trailing slash) |
| Token | `TAGEMBED_ACCESS_TOKEN` (account key, or a `wt1_…` wall token) |

Both come from the environment, so nothing needs asking: write the code in the
first reply and say where to set them afterwards. Ship an example env file with
empty values, never a real token. Where the token may live: server-side only.
A browser request would not be blocked — it would succeed and hand the token to
anyone who opens devtools.

## 3. How the widget mounts

- Mount point `<div id="tagembed-wall"></div>`. Render into every element with
  that id **or** a `data-tagembed-wall` attribute, so two widgets on one page
  both work.
- Per-instance options from `data-` attributes with sensible defaults, never
  from globals: `data-limit` (default 24), `data-layout`, `data-theme`
  (`light`/`dark`, overrides the OS preference), `data-mode` (e.g. `signage`).
  No inline configuration may be required to exist.
- Scope every style to the widget and keep custom properties on its own root —
  design spec §1.
- Hand over the exact HTML snippet that mounts it.

## 4. Data and caching

Follow llms.txt rules 5–12. In short: one call to
`GET {TAGEMBED_API_BASE}/v3/posts?limit=24`, default sort kept (pinned first,
then newest), payload at `body.posts` / `body.paging`, check the HTTP status
**and** the envelope `status` flag, 5-minute **shared** cache with a
single-flight refresh, last-good copy served on failure, `paging.next_cursor`
passed back as `after` for more pages, every printed value escaped.

Two numbers worth stating back to the user:

- one shared cache at a 5-minute TTL ≈ **288 API calls a day**, whatever the
  traffic. Say in one line what the TTL you implemented will cost them.
- a per-process cache multiplies that by the number of workers or instances,
  and an uncached "load more" scales it with clicks instead of with time.

## 5. States

Design spec §6: empty and error states render **inside** the container, never
blank and never a throw into the host page; a stale cached copy beats an error;
and ship the inline `SAMPLE_POSTS` preview fallback so the design can still be
reviewed inside a preview sandbox that blocks the fetch (llms.txt rule 12).

## 6. Hand-off

Deliverable first, commentary last — no opening plan of what you are about to
build.

1. Complete files with their exact paths, each part commented in a line or two.
2. The HTML snippet that mounts the widget.
3. Step-by-step: how to set the two environment variables and run it locally,
   written for someone who has never used a terminal, plus the URL to open.
4. One `curl` to verify the Tagembed API directly and one for their own
   endpoint, with what a good response looks like for each.
5. Any assumptions you made, listed at the end — not asked at the start.

If you cannot write files (a browser chat), output every file complete with its
filename, then that checklist.

## 7. Things this API does not have — do not add them

Already in llms.txt, and the four an assistant invents anyway:

- no `fields` parameter — every response carries the full post object;
- `after` is not a post id — it is the opaque `paging.next_cursor`, passed back
  verbatim;
- no `networks` and no `wall_id` parameter — filter by network with `feed_ids`;
- no write endpoints, no RSS feed, no `include_source` (each post already
  carries a `network` object). Moderation happens in the dashboard.
