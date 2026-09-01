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
- Prefer `media[].cdn_url` for images.

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
      <?php $img = $post['media'][0]['cdn_url'] ?? null; ?>
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
  const image = post.media[0]?.cdn_url;
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

Paste this into any coding agent, together with the contents of
[llms.txt](../llms.txt) (the API reference the agent needs — also at
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt for agents that can browse). Switch the
language line to Node.js if you prefer.

```
I want to build a social wall - a single web page that displays a live
feed of social media posts aggregated by Tagembed. The complete API
specification is at https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt (fetch it; if you cannot browse, ask me to paste it); follow it exactly for endpoints,
field names and the response envelope.

The wall pulls its content from GET {BASE}/v3/posts using my access token.

Please build it with these requirements:

Tech and structure
- Language: PHP, delivered as a single self-contained index.php file.
- Read the access token from the TAGEMBED_ACCESS_TOKEN environment variable and
  the API base URL from TAGEMBED_API_BASE. Never hard-code either.

Fetching data
- Call GET /v3/posts with limit=24. The payload is inside the response
  envelope: body.posts and body.paging.
- The default sort is already display-ready (pinned posts first, then
  newest by creation time) - do not override it.

Caching and resilience
- Cache the API response for 5 minutes; only call the API again when
  the cache is older than that. This stays inside the rate guideline.
- If an API request fails, fall back to the last successfully cached
  response so the wall never renders blank. If there is no cache at
  all, degrade gracefully to an empty state.

Rendering
- For each post show: the author (author.name), the network
  (network.name), the first image or video poster (media[0].cdn_url -
  omit the element entirely when media is empty), the text
  (content.text, render as TEXT), and a link to the original post
  (source.permalink) when present.
- Escape all output to prevent XSS.
- Keep the markup simple and semantic; I will add my own CSS later.

Security
- The access token is private, so all API calls happen server-side, never
  in the browser.

When you are done, add short comments explaining each part and tell me
exactly how to set the environment variables and run the page locally.
```

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
- Prefer media[].cdn_url for images.
```

Optionally copy `llms.txt` into the project so the agent can read the spec
locally.

Three habits make this land well in any tool: give the agent the spec
(../llms.txt) instead of letting it guess field names, state the constraints
(5-minute cache, server-side key, env vars) because those are what separate a
demo from something shippable, and iterate in small steps.
