'use strict';
// Social Widget - React starter: the small Express server behind the React app.
// It holds the token and calls Tagembed; React only ever calls /api/posts here,
// so the token never reaches the browser.
//
// Settings (.env): ACCESS_TOKEN, API_BASE_URL, WIDGET_THEME, PORT (default 3001).
// Look: themes/<WIDGET_THEME>.css, plus custom.css (optional) for your own changes.

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3001;
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

// ---------- server ----------

const app = express();

// Posts for the React component, plus how the theme lays out a card.
app.get('/api/posts', async (req, res) => {
  let data;
  try {
    data = await getPosts();
  } catch (err) {
    console.error('[social-widget]', err);
    data = { posts: [], paging: null };
  }
  res.json({ posts: data.posts || [], paging: data.paging || null, sample: !!data.sample, theme: theme.meta });
});

// The theme CSS (and custom.css), with its Google Font.
app.get('/api/theme.css', (req, res) => {
  const font = theme.meta.font_url ? `@import url("${theme.meta.font_url}");\n` : '';
  res.type('css').send(font + theme.css);
});

// Production: serve the built app from dist/ (run "npm run build" first).
const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Social Widget API (${theme.meta.name}) on http://localhost:${PORT}`
    + (TOKEN ? '' : ' - sample posts until ACCESS_TOKEN is set'));
});
