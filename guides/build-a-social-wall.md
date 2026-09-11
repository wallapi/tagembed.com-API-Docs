# Build a Social Wall with the Tagembed Developer API (v3)

One page that shows how to fetch, cache and display your wall's posts with
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
  browser**. Read the key from an env var (`TAGEMBED_ACCESS_TOKEN`).
- The payload is inside the envelope: `body.posts` and `body.paging`.
- The default sort is already display-ready (pinned first, then newest) — you
  don't need a sort fix. Pass `sort=-created_at` only if you don't want
  pinned posts floated to the top.
- Escape all output — `content.text` is plain text, render it as text.
- For the image, take the FIRST `media[]` entry whose `type` is `"image"` and
  use its `cdn_url`. A `"video"` entry is a video file, not a poster image.

## PHP

Save as `index.php`, set `TAGEMBED_ACCESS_TOKEN` (and `TAGEMBED_API_BASE`), run
`php -S localhost:8080`. File cache, 5-minute TTL, stale fallback.

```php
<?php
// --- Configuration ---
$base      = rtrim(getenv('TAGEMBED_API_BASE') ?: 'https://staging-apis.tagembed.com/api', '/');
$accessToken   = getenv('TAGEMBED_ACCESS_TOKEN');
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
        return json_decode(file_get_contents($cacheFile), true); // still fresh
    }

    $posts = fetchPosts($base, $accessToken);
    if ($posts !== null) {
        file_put_contents($cacheFile, json_encode($posts));
        return $posts;
    }

    // Request failed: fall back to a stale cache if we have one
    if (file_exists($cacheFile)) {
        return json_decode(file_get_contents($cacheFile), true);
    }
    return [];
}

$posts = getPosts($base, $accessToken, $cacheFile, $cacheTtl);
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Our Social Wall</title></head>
<body>
  <h1>What people are saying</h1>
  <div class="wall">
  <?php foreach ($posts as $post): ?>
    <article>
      <p><strong><?= htmlspecialchars($post['author']['name'] ?? 'Unknown') ?></strong>
        <small><?= htmlspecialchars($post['network']['name'] ?? '') ?></small></p>
      <?php // a "video" entry is a video FILE, not a poster - take the first image
            $images = array_filter($post['media'] ?? [], fn($m) => ($m['type'] ?? '') === 'image');
            $img = $images ? reset($images)['cdn_url'] : null; ?>
      <?php if ($img): ?>
        <img src="<?= htmlspecialchars($img) ?>" alt="" width="300">
      <?php endif; ?>
      <p><?= nl2br(htmlspecialchars($post['content']['text'] ?? '')) ?></p>
      <?php if (!empty($post['source']['permalink'])): ?>
        <p><a href="<?= htmlspecialchars($post['source']['permalink']) ?>">View original post</a></p>
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

const BASE = (process.env.TAGEMBED_API_BASE || 'https://staging-apis.tagembed.com/api').replace(/\/$/, '');
const ACCESS_TOKEN = process.env.TAGEMBED_ACCESS_TOKEN;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes, in milliseconds

let cache = { posts: [], fetchedAt: 0 };

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
  if (now - cache.fetchedAt < CACHE_TTL && cache.posts.length) {
    return cache.posts; // still fresh
  }
  try {
    const posts = await fetchPosts();
    cache = { posts, fetchedAt: now };
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

function renderPost(post) {
  // A "video" entry is a video FILE, not a poster image - only an image
  // entry belongs in an <img>.
  const image = post.media?.find((m) => m.type === 'image')?.cdn_url;
  const permalink = post.source?.permalink;
  return `
    <article>
      <p><strong>${escapeHtml(post.author?.name || 'Unknown')}</strong>
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
    <head><meta charset="utf-8"><title>Our Social Wall</title></head>
    <body>
      <h1>What people are saying</h1>
      <div class="wall">${posts.map(renderPost).join('')}</div>
    </body>
    </html>`);
});

app.listen(PORT, () => console.log(`Social wall running on http://localhost:${PORT}`));
```

## The universal AI-agent prompt

Four lines, any agent. Everything else — endpoints, field names, the
envelope, the caching and security rules, and "code first, questions last" —
is in [llms.txt](../llms.txt), which the prompt points the agent at. Switch
the third line to PHP if you prefer.

```
Build me a social wall: one web page that shows the live posts from my Tagembed wall.
API docs: https://github.com/wallapi/tagembed.com-API-Docs - read llms.txt there and follow its "Integration rules for generated code".
Use Node.js 18+ with Express: server.js and package.json. Token comes from the TAGEMBED_ACCESS_TOKEN env var, so don't ask me for it.
Give me the complete code first, then tell me how to run it as if I've never used a terminal.
```

PHP: `Use PHP 8: one self-contained index.php, nothing to install.`

Browser AI (no filesystem access)? Add a fifth line:

```
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
```

What a fresh agent does with this: it opens the repo README, fetches llms.txt,
reads the GET /posts and Post object pages, and writes a server that checks
the HTTP status and the envelope, keeps the default sort, caches with a stale
fallback and never lets the token reach the browser. The spec carries the
rules, so the prompt does not have to.

## Per-tool context files

Drop the block for your tool into the project, and after that a one-line
request ("build the social wall", "add a masonry grid", "swap the file cache
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
# Tagembed social wall - project context

Data source: GET {TAGEMBED_API_BASE}/v3/posts
API docs: https://github.com/wallapi/tagembed.com-API-Docs
API spec: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
(a local llms.txt copy may also be in this folder) - follow it exactly for endpoints,
field names and the response envelope ({ status, message, code, body }).

Rules for all code in this project:

- Read the access token from the TAGEMBED_ACCESS_TOKEN env var and the base URL
  from TAGEMBED_API_BASE. Never hard-code either.
- All Tagembed API calls run server-side; the access token must never reach
  the browser.
- The payload is inside the envelope: body.posts / body.paging.
- Do not override the default sort (pinned first, then newest).
- Paginate with paging.next_cursor passed back as `after`; never
  construct a cursor by hand.
- Cache API responses for 5 minutes; serve the last good cache if a
  request fails.
- Render content.text as text and escape all output to prevent XSS.
- For the image, take the first media[] entry whose type is "image" and use
  its cdn_url; a "video" entry is a video file, not a poster image.
```

Optionally copy `llms.txt` into the project so the agent can read the spec
locally.

Step-by-step per tool (install, setup commands for the context file, a PHP
and a Node.js prompt, run commands): [../prompts/README.md](../prompts/README.md).

Three habits make this land well in any tool: give the agent the spec
(../llms.txt) instead of letting it guess field names, state the constraints
(5-minute cache, server-side key, env vars) because those are what separate a
demo from something shippable, and iterate in small steps.
