// Social Widget - Node.js starter (Node 18+, standard library only, nothing to install).
// Renders the Tagembed gallery's posts as one finished HTML page. The token stays
// on this server; the browser only ever receives HTML.
//
// Settings (.env or the host's environment): ACCESS_TOKEN, API_BASE_URL, WIDGET_THEME.
// Look: themes/<WIDGET_THEME>.css + themes/<WIDGET_THEME>.template.html + themes/<WIDGET_THEME>.json,
// plus custom.css (optional) for your own changes. Same rules as guides/prompts/library/build/common.md
// and cache.md - this file is the "server.md" build already written and tested.

const http = require('http');
const fs = require('fs');
const path = require('path');

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes: about 288 API calls a day, whatever the traffic

// ---------- settings ----------

let envFile = null;
function swEnv(key, fallback = '') {
  if (process.env[key]) return process.env[key];
  if (envFile === null) {
    envFile = {};
    const p = path.join(__dirname, '.env');
    if (fs.existsSync(p)) {
      for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#') || !t.includes('=')) continue;
        const i = t.indexOf('=');
        envFile[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return envFile[key] ?? fallback;
}

// ---------- theme ----------

function loadTheme() {
  let slug = swEnv('WIDGET_THEME', 'modern-card').toLowerCase().trim();
  if (!/^[a-z-]+$/.test(slug) || !fs.existsSync(path.join(__dirname, `themes/${slug}.json`))) {
    console.error(`[social-widget] Unknown WIDGET_THEME "${slug}" - using modern-card`);
    slug = 'modern-card';
  }
  const meta = JSON.parse(fs.readFileSync(path.join(__dirname, `themes/${slug}.json`), 'utf8'));
  let css = fs.readFileSync(path.join(__dirname, `themes/${slug}.css`), 'utf8');
  const template = fs.readFileSync(path.join(__dirname, `themes/${slug}.template.html`), 'utf8');
  const customPath = path.join(__dirname, 'custom.css');
  if (fs.existsSync(customPath)) {
    css += '\n  /* custom.css */\n' + fs.readFileSync(customPath, 'utf8');
  }
  // A theme with no {{author}} slot is photo-only (Collage, Slider, Reels, Single Post,
  // Horizontal Slider, Square Photo): a post with no image would be an empty card.
  meta.photo_only = !template.includes('{{author}}');
  return { meta, css, template };
}

function loadSamples(theme) {
  const file = theme.meta.type === 'review' ? 'sample-posts-reviews.json' : 'sample-posts-social.json';
  return JSON.parse(fs.readFileSync(path.join(__dirname, `samples/${file}`), 'utf8'));
}

// ---------- API + cache ----------

async function fetchPosts(base, token) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let res;
  try {
    res = await fetch(`${base}/v3/posts?limit=24`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (err) {
    throw new Error(`Tagembed API request failed: ${err.message}`);
  } finally {
    clearTimeout(timeout);
  }
  const json = await res.json().catch(() => null);
  // Check the HTTP status AND the envelope flag: status can be false on a 200.
  if (!res.ok || !json || json.status === false) {
    const detail = res.status === 422 ? JSON.stringify(json?.body?.fields ?? null) : json?.message ?? 'unexpected response';
    throw new Error(`Tagembed API ${res.status}: ${detail}`);
  }
  const body = json.body || {};
  return { posts: Array.isArray(body.posts) ? body.posts : [], paging: body.paging ?? null };
}

function readCache(file) {
  try {
    const c = JSON.parse(fs.readFileSync(file, 'utf8'));
    return c && c.data ? c : null;
  } catch {
    return null;
  }
}

let refreshing = null; // one refresh at a time; concurrent requests await the same promise

async function getPosts(theme) {
  const token = swEnv('ACCESS_TOKEN').trim();
  // No token yet: show the sample posts, touch neither the API nor the cache.
  if (!token) {
    return { posts: loadSamples(theme), paging: null, sample: true };
  }
  const base = swEnv('API_BASE_URL', 'https://api.tagembed.com/api').trim().replace(/\/+$/, '');
  const dir = path.join(__dirname, 'cache');
  const file = path.join(dir, 'posts.json');

  const cached = readCache(file);
  if (cached && Date.now() - cached.saved_at < CACHE_TTL_MS) {
    return cached.data;
  }
  if (refreshing) {
    return refreshing.then((data) => data ?? cached?.data ?? { posts: [], paging: null });
  }

  refreshing = (async () => {
    let data;
    try {
      data = await fetchPosts(base, token);
      try {
        fs.mkdirSync(dir, { recursive: true });
        const tmp = `${file}.${process.pid}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify({ saved_at: Date.now(), data }));
        fs.renameSync(tmp, file); // write a temp file and rename it in, so a reader never sees half a file
      } catch {
        console.error('[social-widget] Cache folder not writable, serving live');
      }
    } catch (err) {
      console.error(`[social-widget] ${err.message}`);
      // A failed refresh keeps serving the old copy; empty only if nothing ever loaded.
      data = cached ? cached.data : { posts: [], paging: null };
    }
    return data;
  })();

  try {
    return await refreshing;
  } finally {
    refreshing = null;
  }
}

// ---------- rendering (fills the theme's own {{slot}} template - same markup as preview.html) ----------

const NET_MARK = {
  instagram: 'IG', facebook: 'f', twitter: 'X', x: 'X', tiktok: '♪', youtube: '▶',
  linkedin: 'in', pinterest: 'P', google: 'G', yelp: 'y', tripadvisor: 'T', trustpilot: '★',
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}

/** Links: only http/https, never javascript: or data:. */
function safeLink(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : '#';
}

/** Media src: http/https (live API) or a data: image (the bundled sample posts). */
function safeMedia(url) {
  return typeof url === 'string' && /^(https?:\/\/|data:image\/)/i.test(url) ? url : '';
}

function firstChar(s) {
  return (s || '').trim().slice(0, 1).toUpperCase();
}

/** The FIRST media entry of type "image" - never media[0], which can be a video. */
function firstImage(media) {
  return (media || []).find((m) => m && m.type === 'image' && safeMedia(m.cdn_url) !== '') || null;
}

function mediaHtml(post, image) {
  if (!image) return '';
  const media = Array.isArray(post.media) ? post.media : [];
  const video = media.find((m) => m && m.type === 'video' && safeMedia(m.cdn_url) !== '');
  if (video) {
    return `<video controls muted playsinline preload="none" poster="${esc(image.cdn_url)}"><source src="${esc(video.cdn_url)}"></video>`;
  }
  return `<img src="${esc(image.cdn_url)}" alt="" loading="lazy">`;
}

/** Fill the theme's own {{slot}} template for one post - per common.md's "Per post" rules. */
function renderCard(template, post) {
  const author = post.author || {};
  const network = post.network || {};
  const source = post.source || {};
  const content = post.content || {};
  const media = Array.isArray(post.media) ? post.media : [];

  const name = author.name || author.handle || '';
  const netName = network.name || '';
  const netSlug = (network.slug || '').toLowerCase();
  const image = firstImage(media);

  const avatarUrl = safeMedia(author.avatar_url);
  const avatar = avatarUrl
    ? `<img class="tbd-avatar" src="${esc(avatarUrl)}" alt="" loading="lazy">`
    : `<span class="tbd-avatar">${esc(firstChar(name || netName))}</span>`;

  const ts = Date.parse(post.created_at || '');
  const date = Number.isFinite(ts) ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '';

  const rating = typeof post.rating === 'number' ? Math.round(post.rating) : 0;
  const stars = rating >= 1 && rating <= 5 ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';

  const slots = {
    '{{permalink}}': esc(safeLink(source.permalink)),
    '{{network_name}}': esc(netName),
    '{{network_slug}}': esc(netSlug),
    '{{network_mark}}': esc(NET_MARK[netSlug] || firstChar(netName)),
    '{{author}}': esc(name),
    '{{avatar}}': avatar,
    '{{created_at}}': esc(post.created_at || ''),
    '{{date}}': esc(date),
    '{{text}}': content.text ? esc(content.text) : '',
    '{{rating}}': String(rating),
    '{{stars}}': stars,
    '{{media}}': mediaHtml(post, image),
    '{{media_width}}': String(image?.width || 0),
    '{{media_height}}': String(image?.height || 0),
  };
  return template.replace(/\{\{[a-z_]+\}\}/g, (m) => slots[m] ?? '');
}

// ---------- page ----------

function renderPage(theme, data) {
  const meta = theme.meta;
  let posts = (data.posts || []).filter((p) => p && typeof p === 'object');
  if (meta.photo_only) {
    posts = posts.filter((p) => firstImage(Array.isArray(p.media) ? p.media : []) !== null);
  }
  const isSlider = meta.layout === 'slider';
  const cards = posts.map((p) => renderCard(theme.template, p)).join('\n');

  const fontTags = meta.font_url
    ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${esc(meta.font_url)}">`
    : '';
  const note = data.sample ? '  <p class="tbd-note">Sample posts - set ACCESS_TOKEN in .env to show your gallery.</p>\n' : '';
  const body = !posts.length
    ? '  <p class="tbd-empty">No posts to show yet.</p>\n'
    : isSlider
      ? `  <div class="tbd-slider">\n  <button class="tbd-arrow tbd-arrow--prev" type="button" data-dir="-1" aria-label="Previous">‹</button>\n  <div class="tbd-track">\n    ${cards}\n  </div>\n  <button class="tbd-arrow tbd-arrow--next" type="button" data-dir="1" aria-label="Next">›</button>\n  </div>\n`
      : `  <div class="tbd-track">\n    ${cards}\n  </div>\n`;
  const sliderScript = isSlider
    ? `<script>\n  // Arrows scroll the row by one view. No data is fetched.\n  document.addEventListener('click', function (e) {\n    var b = e.target.closest && e.target.closest('.tbd-arrow');\n    if (!b) return;\n    var t = b.parentNode.querySelector('.tbd-track');\n    t.scrollBy({ left: b.dataset.dir * t.clientWidth, behavior: 'smooth' });\n  });\n</script>\n`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Social Widget</title>
${fontTags}
<style>
${theme.css}
</style>
</head>
<body>
<section class="tbd-widget tbd-t-${esc(meta.slug)} tbd-l-${esc(meta.layout)}${meta.clamp ? ' tbd-clamp' : ''}">
  <h1 class="tbd-header">Social Widget</h1>
${note}${body}</section>
${sliderScript}</body>
</html>
`;
}

const server = http.createServer(async (req, res) => {
  try {
    const theme = loadTheme();
    let data;
    try {
      data = await getPosts(theme);
    } catch (err) {
      console.error(`[social-widget] ${err.message}`);
      data = { posts: [], paging: null };
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderPage(theme, data));
  } catch (err) {
    console.error(`[social-widget] ${err.stack || err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Social Widget: internal error - check the server log.');
  }
});

const PORT = Number(swEnv('PORT', '3000'));
server.listen(PORT, () => {
  console.log(`Social Widget running at http://localhost:${PORT}`);
});
