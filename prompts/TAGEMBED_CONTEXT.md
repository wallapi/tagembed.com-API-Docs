# Tagembed social wall - project context

Data source: GET {TAGEMBED_API_BASE}/v3/posts
API docs: https://github.com/wallapi/tagembed.com-API-Docs
API spec: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
(a local llms.txt copy is in this folder) - follow it exactly for endpoints,
field names and the response envelope ({ status, message, code, body }).

Rules for all code in this project:

- Read the credential from the TAGEMBED_ACCESS_TOKEN env var (an account
  access token or a wt1_ wall token, both work) and the base URL from
  TAGEMBED_API_BASE (default https://staging-apis.tagembed.com/api). Never
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
- Never stop to ask for the token or base URL before writing code. Build with
  the defaults above and tell the user where to set the two env vars at the
  end.
