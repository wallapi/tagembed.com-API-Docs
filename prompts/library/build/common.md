# Social widget - rules every build part follows

This file is shared by the part prompts (preview.html, the server file
for my stack - index.php or server.js - and README.md). It carries no
deliverable of its own.

Read both first - the field names and the looks are specified there:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md

What it is: a social widget - a page my own server renders, showing
the live posts from my Tagembed gallery. preview.html and the server
file render the SAME markup with the SAME CSS, so a later restyle
applies to both. The CSS lives inside each file - no separate
stylesheet.

Stack: build ONLY the stack I picked before the build started - PHP
(index.php) or Node.js (server.js + package.json). Never write the
other one unless I ask for both. If I have not picked yet, ask me
before writing code.

Name: it is a Social Widget. Use that name in the page title, the
header, the README and the code comments - never "social wall".

Looks: skin everything with the ONE theme I picked from the theme
catalogue. Fetch that theme's preview HTML RAW (the
"Preview" line under it in the catalogue) and build from it: copy its
CSS and card markup, leave out its <script>, and never copy its
sample posts, names or image URLs - the posts come only from the
sample posts JSON below (or the live API). The thumbnail is only for picking - never
build from it. The design spec maps the tokens (section 2, Themes):
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
If I have not picked a theme yet, show me the catalogue's list and
ask - never pick one for me. Every part uses that same theme. One
skin only - no dark mode, no toggle. Some theme colours are white on
near-white, so where one is too faint to read as text, fix it and
say so - judged from the values, no contrast script.

Data: GET https://api.tagembed.com/api/v3/posts?limit=24, header Authorization:
Bearer <token>; token from ACCESS_TOKEN, base URL from API_BASE_URL,
neither in the code. Posts are at body.posts and paging at
body.paging, never the top level, and `status` can be false on an HTTP
200. No "fields" param exists. Leave `sort` alone. Page 2 =
body.paging.next_cursor sent back as `after` verbatim, never a post id.

Sample posts: fetch these RAW and bake in every post in them - never skip it.
Copy every image and video URL character for character: never retype,
shorten or invent one. If you cannot reach them, write 8-12 posts in
the same shape with no media rather than a made-up URL. In the server file an empty
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

Media: a video post renders <video controls muted playsinline
preload="none"> with the video entry's cdn_url as its source and the
post's first image as its poster - never autoplay, no JavaScript.
Every image and video sits in a box with its own background - the
header gradient with the network name centred on it - and the <img>
alt text is transparent. Claude's artifact view and ChatGPT canvas
block outside photos and video, so there the card still shows a
coloured tile instead of a broken icon; in a browser the real media
loads over it.

Non-negotiable: every call runs server-side and the token never
reaches the browser. Escape everything you print; allow only
http/https links.

No tests: do not write or run tests, audits or checks - no
accessibility or contrast scripts, no auth or 401 flow tests, no curl
calls, no test files. Pick AA-safe colours from the values and note
any change in a comment. I run and check the build myself.

Every file complete - no placeholders, no "rest stays the same", no
truncation - with brief comments through the code.
