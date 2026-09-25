'use strict';
// Social Widget - Node.js starter (Express).
// Renders the Tagembed gallery's posts as one finished HTML page. The token stays
// on this server; the browser only ever receives HTML.
//
// Settings (.env): ACCESS_TOKEN, API_BASE_URL, WIDGET_THEME, PORT.
// Look: themes/<WIDGET_THEME>.css, plus custom.css (optional) for your own changes.

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const TOKEN = (process.env.ACCESS_TOKEN || '').trim();
const API_BASE_URL = (process.env.API_BASE_URL || 'https://api.tagembed.com/api').trim().replace(/\/+$/, '');
const CACHE_TTL_SECONDS = 300; // 5 minutes: about 288 API calls a day, whatever the traffic
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'posts.json');

// ---------- theme ----------

function loadTheme(wanted) {
  let slug = String(wanted || '').trim().toLowerCase();
  if (!/^[a-z-]+$/.test(slug) || !fs.existsSync(path.join(__dirname, 'themes', slug + '.json'))) {
    if (slug) console.warn(`[social-widget] Unknown WIDGET_THEME "${slug}" - using modern-card`);
    slug = 'modern-card';
  }
  const meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'themes', slug + '.json'), 'utf8'));
  let css = fs.readFileSync(path.join(__dirname, 'themes', slug + '.css'), 'utf8');
  const custom = path.join(__dirname, 'custom.css');
  if (fs.existsSync(custom)) css += '\n  /* custom.css */\n' + fs.readFileSync(custom, 'utf8');
  return { meta, css };
}

const theme = loadTheme(process.env.WIDGET_THEME);

function samplePosts() {
  const file = theme.meta.type === 'review' ? 'reviews.json' : 'social.json';
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'samples', file), 'utf8'));
}

// ---------- cache ----------

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    // Write a temp file and rename it in, so a reader never sees half a file.
    const tmp = `${CACHE_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ savedAt: Date.now(), data }));
    fs.renameSync(tmp, CACHE_FILE);
  } catch (err) {
    // Unwritable folder: keep serving live results instead of failing.
    console.warn('[social-widget] Cache folder not writable, serving live:', err.message);
  }
}

// ---------- API ----------

async function fetchPosts() {
  const res = await fetch(`${API_BASE_URL}/v3/posts?limit=24`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // not JSON - handled below
  }
  // Check the HTTP status AND the envelope flag: status can be false on a 200.
  if (!res.ok || !json || json.status === false) {
    const detail = res.status === 422 ? JSON.stringify(json && json.body && json.body.fields)
      : (json && json.message) || res.statusText;
    throw new Error(`Tagembed API ${res.status}: ${detail}`);
  }
  const body = json.body || {};
  return { posts: Array.isArray(body.posts) ? body.posts : [], paging: body.paging || null };
}

let refreshing = null; // one refresh at a time; other requests get the old copy

async function getPosts() {
  // No token yet: show the sample posts, touch neither the API nor the cache.
  if (!TOKEN) return { posts: samplePosts(), paging: null, sample: true };

  const cached = readCache();
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_SECONDS * 1000) return cached.data;

  if (!refreshing) {
    refreshing = fetchPosts()
      .then((data) => { writeCache(data); return data; })
      .catch((err) => {
        console.error('[social-widget]', err.message);
        // A failed refresh keeps serving the old copy; empty only if nothing ever loaded.
        return cached ? cached.data : { posts: [], paging: null };
      })
      .finally(() => { refreshing = null; });
  }
  return cached ? cached.data : refreshing;
}

// ---------- HTML (same markup as preview.html) ----------

const NET_MARK = {
  instagram: 'IG', facebook: 'f', twitter: 'X', x: 'X', tiktok: '♪', youtube: '▶', linkedin: 'in',
  pinterest: 'P', google: 'G', yelp: 'y', tripadvisor: 'T', trustpilot: '★',
};

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

// Only http(s) links and images - never javascript: or data: from the API.
function safeUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : '';
}

function shortDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// Photo-only themes skip posts without an image - they would be empty cards.
function visiblePosts(posts, parts) {
  if (parts.join() !== 'media') return posts;
  return posts.filter((p) => Array.isArray(p.media) && p.media.some((m) => m && m.type === 'image' && safeUrl(m.cdn_url)));
}

function renderCard(post, parts) {
  const author = post.author || {};
  const network = post.network || {};
  const name = author.name || author.handle || '';
  const netName = network.name || '';
  const media = Array.isArray(post.media) ? post.media : [];
  // The first media entry of type "image" - never media[0], which can be a video.
  const image = parts.includes('media') ? media.find((m) => m && m.type === 'image' && safeUrl(m.cdn_url)) : null;
  const blocks = {};

  if (image) {
    let style = image.width && image.height ? `--tbd-ar:${Number(image.width)} / ${Number(image.height)};` : '';
    if (typeof image.preview_data_uri === 'string' && image.preview_data_uri.startsWith('data:image/')) {
      style += `--tbd-ph:url(${image.preview_data_uri})`;
    }
    const play = media.some((m) => m && m.type === 'video') ? '<span class="tbd-play"></span>' : '';
    blocks.media = `<div class="tbd-media" data-network="${esc(netName)}"${style ? ` style="${esc(style)}"` : ''}>`
      + `<img src="${esc(image.cdn_url)}" alt="" loading="lazy">${play}</div>`;
  }

  const initial = esc(name.slice(0, 1).toUpperCase());
  const avatar = safeUrl(author.avatar_url)
    ? `<img class="tbd-avatar" src="${esc(author.avatar_url)}" alt="" loading="lazy" data-initial="${initial}">`
    : `<span class="tbd-avatar">${initial}</span>`;
  const slug = String(network.slug || '').toLowerCase();
  blocks.head = `<div class="tbd-head">${avatar}<div class="tbd-who">`
    + (name ? `<span class="tbd-author">${esc(name)}</span>` : '')
    + `<time class="tbd-date" datetime="${esc(post.created_at)}">${esc(shortDate(post.created_at))}</time></div>`
    + `<span class="tbd-net" data-net="${esc(slug)}" data-mark="${esc(NET_MARK[slug] || netName.slice(0, 1))}" title="${esc(netName)}"></span></div>`;

  const rating = Number(post.rating);
  if (rating >= 1 && rating <= 5) {
    const r = Math.round(rating);
    blocks.stars = `<div class="tbd-stars" aria-label="${r} out of 5">${'★'.repeat(r)}${'☆'.repeat(5 - r)}</div>`;
  }
  const text = post.content && post.content.text;
  if (text) blocks.text = `<p class="tbd-text">${esc(text)}</p>`;

  const inner = parts.filter((p) => blocks[p]).map((p) => blocks[p]).join('\n      ');
  const cls = image || !parts.includes('media') ? 'tbd-card' : 'tbd-card tbd-card--text';
  const href = safeUrl(post.source && post.source.permalink) || '#';
  return `    <a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">\n      ${inner}\n    </a>`;
}

// Rating Badge / Badge: the average of every rated post, its stars and the count.
function renderBadge(posts) {
  const rated = posts.filter((p) => typeof p.rating === 'number' && p.rating >= 1 && p.rating <= 5);
  const nets = [];
  rated.forEach((p) => {
    const n = p.network || {};
    if (n.slug && !nets.some((x) => x.slug === n.slug)) nets.push({ slug: n.slug, name: n.name || '' });
  });
  const avg = rated.length ? rated.reduce((sum, p) => sum + p.rating, 0) / rated.length : 0;
  const title = nets.length === 1 ? `${nets[0].name} Reviews` : 'Customer Reviews';
  const full = Math.floor(avg + 0.5);
  const marks = nets.map((n) => `<span class="tbd-net" data-net="${esc(n.slug)}" data-mark="${esc(NET_MARK[n.slug] || n.name.slice(0, 1))}" `
    + `title="${esc(n.name)}"></span>`).join('');
  return '  <div class="tbd-badge">\n'
    + `    <div class="tbd-badge-nets">${marks}</div>\n`
    + `    <div class="tbd-badge-title">${esc(title)}</div>\n`
    + `    <div class="tbd-badge-score"><span class="tbd-badge-avg">${avg.toFixed(1)}</span>`
    + `<span class="tbd-stars" aria-label="${avg.toFixed(1)} out of 5">${'★'.repeat(full)}${'☆'.repeat(5 - full)}</span></div>\n`
    + `    <div class="tbd-badge-count">Based on ${rated.length} review${rated.length === 1 ? '' : 's'}</div>\n`
    + '  </div>';
}

function renderPage(data) {
  const { meta, css } = theme;
  const posts = visiblePosts(data.posts || [], meta.parts);
  const cards = posts.map((p) => renderCard(p, meta.parts)).join('\n');
  let track = posts.length ? `  <div class="tbd-track">\n${cards}\n  </div>` : '  <p class="tbd-empty">No posts to show yet.</p>';
  if (meta.layout === 'badge' && posts.length) track = renderBadge(posts);
  const slider = meta.layout === 'slider' && posts.length;
  const body = slider
    ? `  <div class="tbd-slider">\n  <button class="tbd-arrow tbd-arrow--prev" type="button" data-dir="-1" aria-label="Previous">‹</button>\n${track}\n`
      + '  <button class="tbd-arrow tbd-arrow--next" type="button" data-dir="1" aria-label="Next">›</button>\n  </div>'
    : track;
  const script = slider
    ? `\n<script>\n  // Arrows scroll the row by one view.\n  document.querySelectorAll('.tbd-arrow').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.parentNode.querySelector('.tbd-track');
      t.scrollBy({ left: b.dataset.dir * t.clientWidth, behavior: 'smooth' });
    });\n  });\n</script>`
    : '';
  const font = meta.font_url
    ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${esc(meta.font_url)}">\n`
    : '';
  const note = data.sample ? '  <p class="tbd-note">Sample posts - set ACCESS_TOKEN in .env to show your gallery.</p>\n' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Social Widget</title>
${font}<style>
${css}</style>
</head>
<body>
<section class="tbd-widget tbd-t-${meta.slug} tbd-l-${meta.layout}${meta.clamp ? ' tbd-clamp' : ''}">
  <h1 class="tbd-header">Social Widget</h1>
${note}${body}
</section>${script}
</body>
</html>
`;
}

// ---------- server ----------

const app = express();

app.get('/', async (req, res) => {
  try {
    res.type('html').send(renderPage(await getPosts()));
  } catch (err) {
    console.error('[social-widget]', err);
    res.type('html').send(renderPage({ posts: [] }));
  }
});

app.listen(PORT, () => {
  console.log(`Social Widget (${theme.meta.name}) on http://localhost:${PORT}`
    + (TOKEN ? '' : ' - showing sample posts until ACCESS_TOKEN is set'));
});
