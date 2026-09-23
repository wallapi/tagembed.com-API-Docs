# Social widget - rules every build part follows

This file is shared by the four part prompts (preview.html, index.php,
server.js, README.md). It carries no deliverable of its own.

Read both first - the field names and the looks are specified there:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md

What it is: a social widget - a page my own server renders, showing
the live posts from my Tagembed gallery. preview.html, index.php and
server.js render the SAME markup with the SAME CSS, so a later restyle
applies to all three. The CSS lives inside each file - no separate
stylesheet.

Name: it is a Social Widget. Use that name in the page title, the
header, the README and the code comments - never "social wall".

Looks: skin everything with ONE social theme picked at random from
themes-lite.json, which the design spec maps field by field, and tell
me which one:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes-lite.json Once picked, every later part uses that same theme. One
skin only - no dark mode, no toggle. Some theme colours are white on
near-white, so where one fails WCAG AA as text, fix it and say so.

Data: GET https://api.tagembed.com/api/v3/posts?limit=24, header Authorization:
Bearer <token>; token from ACCESS_TOKEN, base URL from API_BASE_URL,
neither in the code. Posts are at body.posts and paging at
body.paging, never the top level, and `status` can be false on an HTTP
200. No "fields" param exists. Leave `sort` alone. Page 2 =
body.paging.next_cursor sent back as `after` verbatim, never a post id.

Sample posts: fetch these RAW and bake in 8-12 of each, or invent 8-12
in the same shape - never skip it. In the server files an empty
ACCESS_TOKEN renders them instead of calling the API; a real one
switches to live by itself.
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/sample-posts-social.json
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/sample-posts-reviews.json

Per post: author.name falling back to author.handle (either can be
null - never print "null"), network.name, content.text, created_at,
source.permalink with rel="noopener noreferrer". The image is the
FIRST media entry of type "image" via cdn_url, NOT media[0], which can
be a video. rating 0-5 marks a review post and is null on social ones
- same card, plus stars. Other missing values are null, never "" or 0.

Non-negotiable: every call runs server-side and the token never
reaches the browser. Escape everything you print; allow only
http/https links.

Every file complete - no placeholders, no "rest stays the same", no
truncation - with brief comments through the code.
