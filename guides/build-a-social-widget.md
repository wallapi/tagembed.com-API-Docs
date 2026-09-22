# Build a Social Widget with the Tagembed Developer API (v3)

One page that shows how to fetch, cache and display your widget's posts with
working **PHP** and **Node.js** code — plus a prompt and per-tool context
files so an AI coding agent (Claude Code, Cursor, Codex, ChatGPT, Copilot,
Gemini/Antigravity) can build the whole thing from a single line.

The pattern is always the same:

1. **Fetch** `GET /v3/posts` server-side with your access token.
2. **Cache** the response for 5 minutes — stay well inside the rate guideline.
3. **Display** from the cache; if a request fails, serve the last good copy
   instead of a blank screen.

Endpoint reference: [GET /v3/posts](../endpoints/GET_posts.md) · full API rules:
[README](../README.md) · LLM-ready spec: [llms.txt](../llms.txt) · more prompts
(integrate into an existing site, design variants, cache options, browser-AI
mode): [the prompt library](prompts.md)

Rules that matter more than the rest:

- The access token is a server-side secret — **never call the API from the
  browser**. Read the key from an env var (`ACCESS_TOKEN`).
- The payload is inside the envelope: `body.posts` and `body.paging`.
- The default sort is already display-ready (pinned first, then newest) — you
  don't need a sort fix. Pass `sort=-created_at` only if you don't want
  pinned posts floated to the top.
- Escape all output — `content.text` is plain text, render it as text — and
  allow only `http(s)` URLs in `href` and `src`; escaping alone does not stop
  a `javascript:` URL.
- For the image, take the FIRST `media[]` entry whose `type` is `"image"` and
  use its `cdn_url`. A `"video"` entry is a video file, not a poster image.
- Absent values are `null`, never `""` — including `author.name`, whose
  documented fallback is `author.handle`.

## PHP

Save as `index.php`, set `ACCESS_TOKEN` (and `API_BASE_URL`), run
`php -S localhost:8080`. File cache, 5-minute TTL, stale fallback.

```php
<?php
// --- Configuration ---
$base      = rtrim(getenv('API_BASE_URL') ?: 'https://api.tagembed.com/api', '/');
$accessToken   = getenv('ACCESS_TOKEN');
$cacheFile = __DIR__ . '/tagembed-cache.json';
$cacheTtl  = 300; // 5 minutes, in seconds

// --- Fetch posts from the Tagembed v3 API ---
function fetchPosts(string $base, string $accessToken): ?array
{
    $url = "$base/v3/posts?" . http_build_query(['limit' => 24]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $accessToken"],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($raw === false || $code !== 200) {
        return null;
    }
    $json = json_decode($raw, true);
    // Payload lives inside the platform envelope: { status, code, body }
    return ($json['status'] ?? false) ? ($json['body']['posts'] ?? null) : null;
}

// --- Return cached posts, refreshing when stale ---
function getPosts(string $base, string $accessToken, string $cacheFile, int $cacheTtl): array
{
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTtl) {
        return json_decode(file_get_contents($cacheFile), true) ?? []; // still fresh
    }

    $posts = fetchPosts($base, $accessToken);
    if ($posts !== null) {
        file_put_contents($cacheFile, json_encode($posts));
        return $posts;
    }

    // Request failed: fall back to a stale cache if we have one
    if (file_exists($cacheFile)) {
        return json_decode(file_get_contents($cacheFile), true) ?? [];
    }
    return [];
}

$posts = getPosts($base, $accessToken, $cacheFile, $cacheTtl);
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Our Social Widget</title></head>
<body>
  <h1>What people are saying</h1>
  <div class="widget">
  <?php foreach ($posts as $post): ?>
    <article>
      <?php // name can be null - the handle is the documented fallback
            $author = $post['author']['name'] ?? $post['author']['handle'] ?? 'Unknown'; ?>
      <p><strong><?= htmlspecialchars($author) ?></strong>
        <small><?= htmlspecialchars($post['network']['name'] ?? '') ?></small></p>
      <?php // a "video" entry is a video FILE, not a poster - take the first image
            $images = array_filter($post['media'] ?? [], fn($m) => ($m['type'] ?? '') === 'image');
            $img = $images ? reset($images)['cdn_url'] : null; ?>
      <?php if ($img): ?>
        <img src="<?= htmlspecialchars($img) ?>" alt="" width="300">
      <?php endif; ?>
      <p><?= nl2br(htmlspecialchars($post['content']['text'] ?? '')) ?></p>
      <?php // escape is not enough for an href - allow only http(s)
            $link = $post['source']['permalink'] ?? '';
            $link = preg_match('#^https?://#i', $link) ? $link : null; ?>
      <?php if ($link): ?>
        <p><a href="<?= htmlspecialchars($link) ?>">View original post</a></p>
      <?php endif; ?>
    </article>
  <?php endforeach; ?>
  </div>
</body>
</html>
```

## Node.js

Node 18+ (built-in `fetch`). `npm install express`, save as `server.js`, run
`node server.js`. In-memory cache, 5-minute TTL, stale fallback.

```js
// server.js  -  run with: node server.js
const express = require('express');
const app = express();
const PORT = 3000;

const BASE = (process.env.API_BASE_URL || 'https://api.tagembed.com/api').replace(/\/$/, '');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes, in milliseconds

// In-memory: fine for one process. Several workers or instances each keep
// their own copy, so use a file or Redis there - see the brief's cache rules.
let cache = { posts: [], fetchedAt: 0, filled: false };

async function fetchPosts() {
  const url = `${BASE}/v3/posts?` + new URLSearchParams({ limit: '24' });

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error('Tagembed API error: ' + res.status);
  const json = await res.json();
  // Payload lives inside the platform envelope: { status, code, body }
  if (!json.status) throw new Error('Tagembed API error: ' + json.message);
  return json.body.posts || [];
}

async function getPosts() {
  const now = Date.now();
  if (cache.filled && now - cache.fetchedAt < CACHE_TTL) {
    return cache.posts; // still fresh - an empty widget counts as a result
  }
  try {
    const posts = await fetchPosts();
    cache = { posts, fetchedAt: now, filled: true };
    return posts;
  } catch (err) {
    console.error(err);
    return cache.posts; // fall back to the last good result
  }
}

function escapeHtml(str = '') {
  return str.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

// Escaping is not enough for an href: allow only http(s).
function safeUrl(url) {
  return /^https?:\/\//i.test(url || '') ? url : null;
}

function renderPost(post) {
  // A "video" entry is a video FILE, not a poster image - only an image
  // entry belongs in an <img>.
  const image = post.media?.find((m) => m.type === 'image')?.cdn_url;
  const permalink = safeUrl(post.source?.permalink);
  return `
    <article>
      <p><strong>${escapeHtml(post.author?.name || post.author?.handle || 'Unknown')}</strong>
        <small>${escapeHtml(post.network?.name || '')}</small></p>
      ${image ? `<img src="${escapeHtml(image)}" alt="" width="300">` : ''}
      <p>${escapeHtml(post.content?.text || '')}</p>
      ${permalink ? `<p><a href="${escapeHtml(permalink)}">View original post</a></p>` : ''}
    </article>`;
}

app.get('/', async (req, res) => {
  const posts = await getPosts();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="utf-8"><title>Our Social Widget</title></head>
    <body>
      <h1>What people are saying</h1>
      <div class="widget">${posts.map(renderPost).join('')}</div>
    </body>
    </html>`);
});

app.listen(PORT, () => console.log(`Social widget running on http://localhost:${PORT}`));
```

## The universal AI-agent prompt

Four lines, for any coding agent that can open a URL. The brief is one file
and it links the other two (the API spec and the design spec), so nothing has
to be retyped into the prompt:

```
Build me a social widget - a live feed of the posts Tagembed aggregates
for me. The brief is here: fetch it RAW, follow it exactly, and fetch
the two specs it links as well:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
Use [PHP 8: one self-contained index.php | Node.js 18+ with Express:
server.js and package.json]. Add a preview.html alongside it: the
same page as a static file with the brief's sample posts baked into
the HTML, calling nothing, so I can double-click it and see the
design before I have a token - same CSS and markup as the server
version. Don't ask me for the base URL or the
token up front - read them from the API_BASE_URL and ACCESS_TOKEN
environment variables. Write the code now, add short comments, ask me
for both values at the end, then tell me how to set those two
variables and run it locally.
```

Browser AI (no filesystem access)? Add a fifth line:

```
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
```

Agent cannot browse at all? Attach the contents of [llms.txt](../llms.txt) with the first
message instead - it carries the endpoints, the field names, the envelope and
the numbered integration rules - and keep the rest of the prompt as it is.

## Per-tool context files

Drop the block for your tool into the project, and after that a one-line
request ("build the social widget", "add a masonry grid", "swap the file cache
for Redis") is enough — the context file carries the rules every time.

The rules are identical everywhere; only the filename changes:

| Tool                        | File                                                              |
| --------------------------- | ----------------------------------------------------------------- |
| Claude Code                 | `CLAUDE.md` (project root)                                        |
| OpenAI Codex / Grok Build   | `AGENTS.md` (project root)                                        |
| Google Antigravity / Gemini | `GEMINI.md` (project root)                                        |
| Cursor                      | `.cursor/rules/tagembed.mdc` (add `alwaysApply: true` frontmatter) |
| GitHub Copilot              | `.github/copilot-instructions.md`                                 |
| Windsurf                    | `.windsurf/rules/tagembed.md`                                      |
| Cline                       | `.clinerules`                                                     |
| Aider                       | `CONVENTIONS.md` (pass with `aider --read CONVENTIONS.md`)        |
| ChatGPT (browser)           | paste into Custom Instructions / the top of the chat              |

```markdown
# Tagembed social widget - project context

Data source: GET {API_BASE_URL}/v3/posts
API docs: https://github.com/wallapi/tagembed.com-API-Docs
API spec: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
(a local llms.txt copy is in this folder) - follow it exactly for endpoints,
field names and the response envelope ({ status, message, code, body }).

Two more files complete the brief - fetch them RAW when you can reach the
network, and say so in one line if you cannot:
- Build brief (what to build, wiring, what to hand over):
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
- Design spec (--tbd-* tokens, dark theme, card treatment, layouts, states):
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
  Without it, at least use the brand colours --tbd-indigo #283da8,
  --tbd-blue #4462e8, --tbd-blue-ink #3350d6, --tbd-blue-lite #8ea2fb,
  --tbd-brand #526ff9 on `:root`, with a dark theme.

Rules for all code in this project:

- Read the credential from the ACCESS_TOKEN env var (an account
  access token or a wt1_ wall token, both work) and the base URL from
  API_BASE_URL (default https://api.tagembed.com/api). Never
  hard-code either.
- All Tagembed API calls run server-side; the token must never reach the
  browser.
- The payload is inside the envelope: body.posts / body.paging. Check the
  HTTP status AND the envelope's `status` flag; on 422 log body.fields.
- Do not override the default sort (pinned first, then newest).
- Paginate with paging.next_cursor passed back as `after`; never construct a
  cursor by hand.
- Cache API responses for 5 minutes; serve the last good cache if a request
  fails, never render blank.
- Render content.text as text and escape all output to prevent XSS.
- Prefer media[].cdn_url for images.
- Ship a preview.html beside the server files: the same page as a
  static file with the sample posts baked in as markup, calling
  nothing and holding no token, so the design can be reviewed by
  double-clicking it. Never name it index.html - it would be served
  instead of index.php. A restyle applies to all three files.
- Never stop to ask for the token or base URL before writing code. Build with
  the defaults above and tell the user where to set the two env vars at the
  end.
```

Optionally copy `llms.txt` into the project so the agent can read the spec
locally.

Step-by-step per tool (install, setup commands for the context file, a PHP
and a Node.js prompt, run commands): [../prompts/README.md](../prompts/README.md).

Three habits make this land well in any tool: give the agent the spec
(../llms.txt) instead of letting it guess field names, state the constraints
(5-minute cache, server-side key, env vars) because those are what separate a
demo from something shippable, and iterate in small steps.
