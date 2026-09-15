# Build brief — one link an AI can follow

The complete brief for building a Tagembed social widget, in one fetchable file,
so a prompt can stay four lines. It binds together the two specs and adds the
few things neither of them says:

| Read | For |
| ---- | --- |
| [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) | the API: endpoints, envelope, field names, and the numbered **Integration rules** for generated code |
| [widget-design-spec.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md) | the looks: `--tbd-*` tokens, dark theme, card treatment, REEL and WALL layouts, states |
| this file | the delivery contract: what to hand over and how it is wired |

**Agents: fetch all three RAW.** A summarising fetch drops the field names,
which are the one thing that cannot be guessed.

Nothing here overrides llms.txt. Where this file is silent, its Integration
rules decide.

---

## 1. What to build

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

**Deliver BOTH languages, every time.** Not one or the other, and never a
choice put back to the user:

**Node.js**

| File | Holds |
| ---- | ----- |
| `server.js` | everything: the API call, the cache, the HTML and the CSS |
| `package.json` | Express, and a `start` script |
| `cache/posts.json` | the cache file — ship it empty or gitignored, and make the code create it if it is missing |
| `README.md` | the documentation, covering **both** languages (§6) |

**PHP**

| File | Holds |
| ---- | ----- |
| `index.php` | **one file, everything in it** — the API call, the cache, the HTML and the CSS. Nothing to install, nothing to require |

The PHP file writes its cache beside itself (`cache/posts.json`) and creates
the directory if it is missing. Both languages render the same layout from the
same design tokens, so the two outputs look identical in a browser.

## 2. Configuration — ask at the end, never hard-code

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
speculate about why, and do not tell them to buy or upgrade anything. Write the code first — it reads them
from the environment, so it is complete without them — then ask for both at
the end of that same reply and offer to write them into a `.env`. Never open
with the question and wait, and never hard-code either value. Ship an example
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
  refresh. Both languages do this the same way, so the README can describe it
  once.
- One cache at a 5-minute TTL ≈ **288 API calls a day**, whatever the traffic.
  Say in one line what the TTL you implemented will cost them.
- If they run several PHP workers or Node instances, each keeps its own file
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

## 5. Styling

The CSS lives inside the deliverable — inside `server.js` for Node, inside
`index.php` for PHP — not in a separate stylesheet. The page is theirs, so it
may own `:root` and `<body>` freely. Tokens, layouts, dark theme and contrast
rules: the design spec.

## 6. Hand-off

Deliverable first, commentary last — no opening plan of what you are about to
build.

1. **Every file, complete, with its exact path** — the Node.js set and the PHP
   file, both, in the same reply. No "the PHP version is similar".
2. **`README.md`**, which is a deliverable and not a summary. It covers both
   languages and contains: what this is; the file list for each; how to set
   `API_BASE_URL` and `ACCESS_TOKEN`; how to run each one locally (written for
   someone who has never used a terminal) and the URL to open; how the cache
   works and how to change the TTL; how to change the layout and the colours;
   one `curl` that checks the Tagembed API directly with what a good response
   looks like; and a short "if it goes wrong" list — 401, empty page, stale
   posts.
3. Ask for the base URL and the token, offering to write them into `.env`.
4. Any assumptions you made, listed at the end — not asked at the start.

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
