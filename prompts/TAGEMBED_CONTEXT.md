# Tagembed social widget - project context

Data source: GET {API_BASE_URL}/v3/posts
API docs: https://github.com/wallapi/tagembed.com-API-Docs
API spec: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
(a local llms.txt copy is in this folder) - follow it exactly for endpoints,
field names and the response envelope ({ status, message, code, body }).

Two more files complete the brief - fetch them RAW when you can reach the
network, and say so in one line if you cannot:
- Build brief (what to build, wiring, what to hand over):
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md?v=2026-09-24c
- Theme catalogue (19 widget themes - thumbnail to pick, preview HTML to
  build from; ask the user which one before writing code):
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md?v=2026-09-24c
- Design spec (--tbd-* tokens, how a theme maps onto them, card
  treatment, layouts, states):
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md?v=2026-09-24c
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
- Render on the server. The posts are in the HTML before it leaves the
  server; nothing in the browser calls the API or any endpoint.
- Before any code, ask the user two things, one question per reply -
  unless they already said - and start building as soon as they answer,
  with no confirm step:
  1. Which theme. Show the catalogue's theme picker the way it says - the
     thumbnails page itself, rendered (an HTML artifact, or the page
     downloaded and opened in their browser) - never a list of theme names.
  2. Which language the server code should be in. Any server-side language
     is fine (Python, PHP, Node.js, Go, Java, C#, ...) or a framework they
     name. Write the server code in exactly that language - never swap it
     for another, and never add a second one unless they ask.
- A plain language is ONE ready-to-run file with its own extension (app.py,
  server.js, index.php, main.go, ...), standard library only, run with one
  command; a named framework gets the files it needs in its normal layout.
  Its README.md is written in the SAME step as the server code, never
  on its own, and covers that language only.
- Every build also ships a preview.html: the same page as a static file, with
  the sample posts baked into the HTML as finished markup. It calls nothing -
  no fetch, no API call, no token - so the design can be reviewed by
  double-clicking it, with nothing installed. Same CSS and markup as the server
  version, and a restyle applies to both. Never call it
  index.html: it would be served instead of the server's entry file
  (index.php above all).
- Theme and language are the only questions before code. Do not stop to ask
  for the token or base URL before writing code. Build with
  the defaults above, then ask the user for both values at the end.
