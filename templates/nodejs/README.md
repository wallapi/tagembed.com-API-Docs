# Social Widget - Node.js

Shows the live posts from your Tagembed gallery, in the theme you picked. Until you add your token it shows sample posts, so you can run it right away.

## Files

| File | What it does |
|---|---|
| `server.js` | The whole widget: settings, Tagembed call, cache, HTML. |
| `package.json` | Two packages: `express` and `dotenv`. |
| `themes/` | All 19 themes (`.css` is the look, `.json` is how a card is laid out). |
| `samples/` | The sample posts shown while `ACCESS_TOKEN` is empty. |
| `.env.example` | The settings - copy it to `.env`. |

Keep `preview.html` (from the chat) next to it as the design reference - it opens by double-click and needs nothing.

## Run it

1. Install Node.js 18 or newer once from https://nodejs.org (the LTS button).
2. Open a terminal in this folder (macOS: right-click the folder, **New Terminal at Folder**; Windows: open the folder, type `cmd` in the address bar, press Enter).
3. Type `npm install` and press Enter (first time only).
4. Type `npm start` and press Enter.
5. Open http://localhost:3000 in your browser. Stop it with Ctrl+C.

**On a host** (Render, Railway, a VPS, Docker...): run `npm install` then `npm start`, and set `ACCESS_TOKEN`, `API_BASE_URL` and `WIDGET_THEME` in the host's environment settings instead of `.env`. Serverless hosts (Vercel, Netlify functions) do not keep files, so the cache resets between runs - it still works, it just calls Tagembed more often.

## Settings

Copy `.env.example` to a new file named `.env` in the same folder and fill it in:

| Setting | What to put |
|---|---|
| `ACCESS_TOKEN` | Your gallery's token: Tagembed dashboard, the gallery's card, three-dot menu, **Access Token**. Leave it empty to see the sample posts. |
| `API_BASE_URL` | Always `https://api.tagembed.com/api` - nothing to copy. |
| `WIDGET_THEME` | The theme, by file name in `themes/`: `classic-card`, `social-card`, `modern-card`, `classic-photo`, `square-photo`, `collage`, `vivid`, `horizontal-slider`, `horizontal-columns`, `slider`, `reels`, `story-theme`, `single-post`, `widget-theme`, `review-box`, `review-carousel`, `review-list`, `rating-badge`, `badge`. |
| `PORT` | The port to listen on (default `3000`). |

The token stays on the server. It never appears in the page, in View Source or in the browser.

## Changing the look

- Another theme: change `WIDGET_THEME` in `.env`, then restart the server: Ctrl+C, then `npm start`.
- Your own colours, font, columns: create `custom.css` next to `server.js` with your changes. It is added after the theme, so it wins. For example:

  ```css
  :root { --tbd-bg: #fff8f0; --tbd-cols: 4; --tbd-radius: 16px; }
  ```

  The variables are listed at the top of your theme's file in `themes/`.

## How the cache works

Posts are saved in `cache/posts.json` for 5 minutes (`CACHE_TTL_SECONDS` in `server.js`), so Tagembed is called about 288 times a day however many people visit. When the saved copy runs out, one request refreshes it and everyone else keeps getting the saved copy. If Tagembed cannot be reached, the last good copy keeps showing - a stale widget beats an empty one. If the `cache` folder cannot be written, the widget still works; it just calls Tagembed on every visit (the log says so).

## If it goes wrong

- **The "Sample posts" note stays on the page** - `ACCESS_TOKEN` is empty, or the file is not named exactly `.env`, or it is not in this folder. After editing it: restart the server: Ctrl+C, then `npm start`.
- **"No posts to show yet"** - the log says why: `Tagembed API 401: ...` means a wrong token or the daily limit; no error means the gallery has no approved posts yet.
- **Wrong look** - check the spelling of `WIDGET_THEME`. An unknown name falls back to `modern-card` and says so in the log.
