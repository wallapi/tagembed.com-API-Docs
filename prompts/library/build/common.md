# Social widget - rules every stack follows

Links written BASE/<path> are files in this repo. BASE is the one my prompt gave; if it gave none, BASE is where you got this file: the URL up to and including the branch name, or the local repo folder.

Shared by the stack steps (php.md, nodejs.md, react.md, html.md) and
the README step. It carries no deliverable of its own.

Everything the build needs is on this page - do NOT fetch llms.txt,
the design spec or any other guide. The looks are already fixed by
preview.html.

What it is: a social widget - a page my own server renders, showing
the live posts from my Tagembed gallery. Every stack renders the SAME
markup with the SAME CSS as the final preview.html from this chat
(including every change I asked for), so a later restyle applies
everywhere. Do not re-pick or change the theme.

Name: it is a Social Widget. Use that name in the page title, the
header, the README and the code comments - never "social wall".

Settings: two environment variables, never values in the code -
ACCESS_TOKEN (the gallery's access token) and API_BASE_URL
(https://api.tagembed.com/api; strip a trailing slash). Ship a
.env.example with both keys, ACCESS_TOKEN left empty. Loading .env:
- PHP: getenv() first, else a tiny .env reader inside the same file.
  No Composer, no vendor/ folder, no composer.json.
- Node: the dotenv package, loaded at the top of server.js.

Data: GET {API_BASE_URL}/v3/posts?limit=24, header Authorization:
Bearer <ACCESS_TOKEN>. Posts are at body.posts and paging at
body.paging, never the top level, and `status` can be false on an HTTP
200. No "fields" param exists. Leave `sort` alone. Page 2 =
body.paging.next_cursor sent back as `after` verbatim, never a post id.

Errors: check both the HTTP status and body.status. On 401 log the
envelope `message` (bad token or daily limit reached); on 422 log
body.fields. Either way the visitor sees the last cached posts, or a
friendly empty state - never a crash or a blank page. When the cache
expires under traffic, only one request refreshes; the rest serve the
old copy.

Sample posts: reuse the ones baked into preview.html. An empty
ACCESS_TOKEN renders them instead of calling the API; a real one
switches to live by itself.

Per post: author.name falling back to author.handle (either can be
null - never print "null"), network.name, content.text, created_at,
source.permalink with rel="noopener noreferrer". The image is the
FIRST media entry of type "image" via cdn_url, NOT media[0], which can
be a video. rating 0-5 marks a review post and is null on social ones
- same card, plus stars. Other missing values are null, never "" or 0.

Non-negotiable: every call runs server-side and the token never
reaches the browser. Escape everything you print; allow only
http/https links.

Tests are out of scope: the build ships without test files or test
scripts (no accessibility or contrast scripts, no auth or 401 flow
tests), and there is no need to call the API with curl yourself. Keep preview.html's colours as they are. I run
and check the build myself.

Every file complete - no placeholders, no "rest stays the same", no
truncation - with brief comments through the code.

Files: deliver ONLY the files the stack step lists, at exactly those
paths, plus .env.example and README.md - nothing else. No zip, no
package-lock.json, no separate sample-posts file (the sample posts
live inside the server file; for Simple HTML, only in index.html). Do not run npm install, a build, a
server or any other command - just write the files.

## Cache (index.php, server.js, posts.php)

A local JSON file, 5 minutes in one named constant, keyed per request -
about 288 calls a day at any traffic, however many visitors.
- Create the cache folder on first run.
- Write a temp file and rename it in, so a reader never sees half a
  file.
- A failed refresh keeps serving the old copy - a stale widget beats
  an empty one. Empty state only if nothing ever loaded.
- An unwritable folder serves live instead of failing, and the README
  says so.
- An empty ACCESS_TOKEN renders the sample posts and touches neither
  the API nor the cache.

## README.md and suggestions (same reply as the stack files)

Deliver README.md for the stack I chose only (plus preview.html):
- the files, which theme the build uses, and the changes I asked for;
- the two settings, ACCESS_TOKEN and API_BASE_URL (always
  https://api.tagembed.com/api), and where to set them (.env, cPanel,
  Vercel/Netlify, Docker - only the ones that fit this stack);
- how to run it, written for someone who has never used a terminal -
  and that preview.html just opens by double-click;
- how the cache works, including what happens when the cache folder
  is not writable;
- a short list of what to check when it breaks.

Then a short "What you can add next" list - 4 to 6 one-line ideas that
fit this build, each one a sentence I could send back as my next
request. Pick from: a network filter bar, a "Load more" / next-page
link, auto-refresh, a carousel or slider layout, shopping tags on
posts, a lightbox for images and videos, dropping the widget into a
section of my existing site, Redis or another cache.

End the reply by asking for my access token - my Tagembed dashboard,
the gallery's card, its three-dot menu, "Access Token" - and offer to
put it in a .env for me.
