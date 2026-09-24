# Build a Social Widget with the Tagembed Developer API (v3)

One page that shows how to fetch, cache and display your widget's posts with
working **PHP**, **Node.js** and **Python** code — the same pattern works in any
server-side language, and the AI prompts below build it in whichever one you
name — plus a prompt and per-tool context
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

## Python

Python 3.8+, standard library only — nothing to install. Save as `app.py`, set
`ACCESS_TOKEN` (and `API_BASE_URL`), run `python3 app.py` and open
http://localhost:8000. File cache, 5-minute TTL, atomic write, stale fallback.

```python
# app.py - one file: fetch, cache, render.  Run: python3 app.py
# Python 3.8+, standard library only - nothing to install.
import html, json, os, re, tempfile, time, urllib.parse, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

CACHE_TTL = 300                                         # 5 minutes
PORT = 8000

BASE = (os.environ.get('API_BASE_URL') or 'https://api.tagembed.com/api').rstrip('/')
TOKEN = os.environ.get('ACCESS_TOKEN', '')
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cache')
CACHE_FILE = os.path.join(CACHE_DIR, 'posts.json')

def fetch_posts():
    url = f"{BASE}/v3/posts?" + urllib.parse.urlencode({'limit': 24})
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {TOKEN}'})
    try:
        with urllib.request.urlopen(req, timeout=10) as res:   # raises on 4xx/5xx
            data = json.load(res)
    except (OSError, ValueError) as err:
        print('Tagembed API error:', err)
        return None
    # the payload sits inside the envelope: { status, code, body }
    if not data.get('status'):
        return None
    return (data.get('body') or {}).get('posts') or []

def read_cache():
    try:
        with open(CACHE_FILE, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return None

def get_posts():
    try:
        fresh = time.time() - os.path.getmtime(CACHE_FILE) < CACHE_TTL
    except OSError:
        fresh = False
    cached = read_cache() if fresh else None
    if cached is not None:
        return cached
    posts = fetch_posts()
    if posts is not None:
        try:
            os.makedirs(CACHE_DIR, exist_ok=True)           # first run
            fd, tmp = tempfile.mkstemp(dir=CACHE_DIR)       # write then rename, so
            with os.fdopen(fd, 'w', encoding='utf-8') as f:
                json.dump(posts, f)
            os.replace(tmp, CACHE_FILE)                     # nobody reads half a file
        except OSError:
            pass                                            # read-only folder: serve live
        return posts
    # refresh failed: the last good copy beats an empty page, at any age
    return read_cache() or []

def e(v):
    return html.escape('' if v is None else str(v), quote=True)

def safe_url(u):                                        # escaping alone is not enough
    return u if isinstance(u, str) and re.match(r'https?://', u, re.I) else None

def first_image(p):                                     # media[0] can be a video FILE
    for m in p.get('media') or []:
        if m.get('type') == 'image':
            return safe_url(m.get('cdn_url'))
    return None

def render_post(p):
    author = p.get('author') or {}
    name = author.get('name') or author.get('handle') or 'Unknown'
    network = (p.get('network') or {}).get('name')
    text = e((p.get('content') or {}).get('text')).replace('\n', '<br>')
    img, url = first_image(p), safe_url((p.get('source') or {}).get('permalink'))
    return ''.join([
        '<article>',
        f'<img src="{e(img)}" alt="" loading="lazy" width="300">' if img else '',
        f'<p><strong>{e(name)}</strong> <small>{e(network)}</small></p>',
        f'<p>{text}</p>',
        f'<a href="{e(url)}" rel="noopener noreferrer">View post</a>' if url else '',
        '</article>',
    ])

PAGE = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>What people are saying</title></head>
<body>
<h1>What people are saying</h1>
%s
</body>
</html>'''

class Widget(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.split('?')[0] != '/':
            self.send_error(404)
            return
        posts = ''.join(render_post(p) for p in get_posts())
        body = (PAGE % (posts or '<p>No posts to show yet.</p>')).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    print(f'Social widget running on http://localhost:{PORT}')
    ThreadingHTTPServer(('', PORT), Widget).serve_forever()
```

Any other language follows the same three steps. Ask the AI for it with the
prompt below — it writes the server code in the language you name, with its
README in the same reply.

## The universal AI-agent prompt

Four lines, for any coding agent that can open a URL. The brief is one file
and it links the other two (the API spec and the design spec), so nothing has
to be retyped into the prompt:

```
Build me a social widget - a live feed of the posts Tagembed aggregates
for me. The brief is here: fetch it RAW, follow it exactly, and fetch
the two specs it links as well:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
Before any code, show me the theme picker from the theme catalogue -
the thumbnails page itself, rendered, not a list of names - and ask
which theme I want; then ask which language I want the server code in
(any: Python, PHP, Node.js, Go, ... or a framework I name), one
question per reply. Build only in that language: the runnable server
file(s) with their README.md in the same reply, and a preview.html
alongside it: the
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
- Theme catalogue (19 widget themes - thumbnail to pick, preview HTML to
  build from; ask the user which one before writing code):
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
- Design spec (--tbd-* tokens, how a theme maps onto them, card
  treatment, layouts, states):
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
  Without it, at least use the brand colours --tbd-indigo #283da8,
  --tbd-blue #4462e8, --tbd-blue-ink #3350d6, --tbd-blue-lite #8ea2fb,
  --tbd-brand #526ff9 on `:root`. One skin - no dark mode and no
  theme toggle.

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
- Ship a preview.html beside the server file: the same page as a
  static file with the sample posts baked in as markup, calling
  nothing and holding no token, so the design can be reviewed by
  double-clicking it. Never name it index.html - it would be served
  instead of the server's entry file (index.php above all). A restyle
  applies to both.
- Before any code, ask the user two things, one question per reply -
  unless they already said - and start building as soon as they answer,
  with no confirm step: (1) which theme - show the catalogue's theme
  picker, the thumbnails page itself rendered, never a list of names;
  (2) which language the server code should be in - any server-side
  language or a framework they name. Write it in exactly that language,
  never another, and deliver its README.md in the same step as the
  server code.
- Never stop to ask for the token or base URL before writing code. Build with
  the defaults above and tell the user where to set the two env vars at the
  end.
```

Optionally copy `llms.txt` into the project so the agent can read the spec
locally.

Step-by-step per tool (install, setup commands for the context file, the
prompt, run commands for the common languages): [../prompts/README.md](../prompts/README.md).

Three habits make this land well in any tool: give the agent the spec
(../llms.txt) instead of letting it guess field names, state the constraints
(5-minute cache, server-side key, env vars) because those are what separate a
demo from something shippable, and iterate in small steps.
