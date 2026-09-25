# Social Widget - Node.js

Finished, tested code for every theme in the catalogue - `server.js` is one
file that reads the theme from `WIDGET_THEME` and skins itself from the
matching file in `themes/`. Standard library only (`http`, `fs`) - no
`package.json`, no `npm install`.

## Files

- `server.js` - the whole widget: settings, cache, the API call, and the
  page, served with Node's own built-in `http` module.
- `themes/<slug>.css`, `themes/<slug>.template.html`, `themes/<slug>.json` -
  one theme's look, card layout and metadata. Only the folder for the theme
  you picked is needed, but keep the whole `themes/` folder if you plan to
  switch later.
- `samples/sample-posts-social.json`, `samples/sample-posts-reviews.json` -
  the sample posts shown until `ACCESS_TOKEN` is set. Only the one matching
  your theme's type (social or review) is read.
- `.env.example` - copy to `.env` and fill in.
- `preview.html` - the same design as a static file with the sample posts
  baked in, calling nothing: double-click it to see the look before you have
  a token.

## Settings

Copy `.env.example` to `.env` next to `server.js`:

```
ACCESS_TOKEN=
API_BASE_URL=https://api.tagembed.com/api
WIDGET_THEME=modern-card
PORT=3000
```

- `ACCESS_TOKEN` - your Tagembed dashboard, the gallery's card, its
  three-dot menu, "Access Token". Empty shows the sample posts.
- `API_BASE_URL` - leave as the default unless told otherwise.
- `WIDGET_THEME` - one of the slugs below. An unknown slug falls back to
  `modern-card` and logs a line about it.

An environment variable (Docker, Vercel/Netlify, a host's dashboard) always
wins over `.env` if both are set.

| Slug | Theme | Type |
| --- | --- | --- |
| `classic-card` | Classic Card | social |
| `classic-photo` | Classic Photo | social |
| `collage` | Collage | social |
| `horizontal-columns` | Horizontal Columns | social |
| `horizontal-slider` | Horizontal Slider | social |
| `modern-card` | Modern Card | social |
| `reels` | Reels | social |
| `review-box` | Review Box | review |
| `review-carousel` | Review Carousel | review |
| `review-list` | Review List | review |
| `single-post` | Single Post | social |
| `slider` | Slider | social |
| `social-card` | Social Card | social |
| `square-photo` | Square Photo | social |
| `story-theme` | Story Theme | social |
| `vivid` | Vivid | social |
| `widget-theme` | Widget Theme | social |

## Changing the look

Add a `custom.css` file next to `server.js` with only the `--tbd-*`
variables you want to change (see the theme's own CSS for the full list,
under its `:root { ... }` block). It is appended after the theme's CSS, so
your values win, and `preview.html` needs the same block pasted into its
`<style>` to match.

## How to run it

Check Node is installed:

```bash
node -v   # must print v18 or higher
```

Install it from https://nodejs.org (LTS) if the check fails.

```bash
cd my-social-widget
node server.js
```

Open http://localhost:3000 (or the `PORT` you set). Stop the server with
Ctrl+C.

## How the cache works

Live posts are cached to `cache/posts.json` for 5 minutes (about 288 API
calls a day, whatever the traffic). A failed refresh keeps serving the old
copy - the widget only ever shows nothing if it has never loaded once.
Concurrent requests during a refresh share the one in-flight call instead of
each starting their own. If `cache/` cannot be created or written to (a
read-only host), the page serves a live call on every request instead of
failing, and this is logged.

## If it breaks

- **`Tagembed API error: 401`** - token missing or wrong, or the API is
  switched off for the account.
- **`422 Validation Failed`** - logged with the field name from
  `body.fields`.
- **Blank widget, no error** - the account has no approved posts, or the
  token points at a gallery with none.
- **Still shows sample posts** - `ACCESS_TOKEN` is empty or not being read;
  confirm `.env` is next to `server.js`, or that the host's environment
  variable is actually set.
