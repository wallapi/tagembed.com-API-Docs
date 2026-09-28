# Social Widget - Simple HTML

Shows the live posts from your Tagembed gallery, in the theme you picked. Until you add your token it shows sample posts, so you can run it right away.

## Files

| File | What it does |
|---|---|
| `index.html` | The page: loads the theme and posts from `posts.php` and draws the cards. No framework, no build step. |
| `posts.php` | The only server file and the only place the token lives: calls Tagembed with the cache, returns JSON. |
| `.htaccess` | Keeps `.env` and `cache/` private on Apache hosts. |
| `themes/` | All 19 themes (`.css` is the look, `.json` is how a card is laid out). |
| `samples/` | The sample posts shown while `ACCESS_TOKEN` is empty. |
| `.env.example` | The settings - copy it to `.env`. |

Keep `preview.html` (from the chat) next to it as the design reference - it opens by double-click and needs nothing.

## Run it

This runs on any PHP host (cPanel and the like). For a host without PHP, pick the Node.js stack instead.

**On a host:** upload the whole folder (with `.env`) to your site, for example into `public_html/social-widget/`, and open that address. On nginx, block `.env` and `cache/` in the server config - `.htaccess` only works on Apache.

**On your computer**

1. Install PHP 8 once: macOS `brew install php`, Windows https://windows.php.net/download, Ubuntu `sudo apt install php-cli php-curl`.
2. Open a terminal in this folder (macOS: right-click the folder, **New Terminal at Folder**; Windows: open the folder, type `cmd` in the address bar, press Enter).
3. Type `php -S localhost:8080` and press Enter, then open http://localhost:8080.

Double-clicking `index.html` does not work - it needs `posts.php` running. `preview.html` is the one that opens by double-click.

## Settings

Copy `.env.example` to a new file named `.env` in the same folder and fill it in:

| Setting | What to put |
|---|---|
| `ACCESS_TOKEN` | Your gallery's token: Tagembed dashboard, the gallery's card, three-dot menu, **Access Token**. Leave it empty to see the sample posts. |
| `API_BASE_URL` | Always `https://api.tagembed.com/api` - nothing to copy. |
| `WIDGET_THEME` | The theme, by file name in `themes/`: `classic-card`, `social-card`, `modern-card`, `classic-photo`, `square-photo`, `collage`, `vivid`, `horizontal-slider`, `horizontal-columns`, `slider`, `reels`, `story-theme`, `single-post`, `widget-theme`, `review-box`, `review-carousel`, `review-list`, `rating-badge`, `badge`. |

The token stays on the server. It never appears in the page, in View Source or in the browser.

## Changing the look

- Another theme: change `WIDGET_THEME` in `.env`, then nothing - PHP reads `.env` on every visit.
- Your own colours, font, columns: create `custom.css` next to `posts.php` with your changes. It is added after the theme, so it wins. For example:

  ```css
  :root { --tbd-bg: #fff8f0; --tbd-cols: 4; --tbd-radius: 16px; }
  ```

  The variables are listed at the top of your theme's file in `themes/`.

## How the cache works

Posts are saved in `cache/posts.json` for 5 minutes (`CACHE_TTL_SECONDS` in `posts.php`), so Tagembed is called about 288 times a day however many people visit. When the saved copy runs out, one request refreshes it and everyone else keeps getting the saved copy. If Tagembed cannot be reached, the last good copy keeps showing - a stale widget beats an empty one. If the `cache` folder cannot be written, the widget still works; it just calls Tagembed on every visit (the log says so).

## If it goes wrong

- **The "Sample posts" note stays on the page** - `ACCESS_TOKEN` is empty, or the file is not named exactly `.env`, or it is not in this folder. After editing it: nothing - PHP reads `.env` on every visit.
- **"No posts to show yet"** - the log says why: `Tagembed API 401: ...` means a wrong token or the daily limit; no error means the gallery has no approved posts yet.
- **Wrong look** - check the spelling of `WIDGET_THEME`. An unknown name falls back to `modern-card` and says so in the log.
