# Social widget - rules every build part follows

Links written BASE/<path> are files in this repo. BASE is the one the
prompt that sent you here gave; if none was given, BASE is
`https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main`.

This file is shared by the part prompts (preview.html, then the server
code in my language together with its README.md). It carries no
deliverable of its own.

Read both together, in parallel - the field names and the looks are specified there:
BASE/llms.txt
BASE/guides/widget-design-spec.md?v=2026-09-24c

What it is: a social widget - a page my own server renders, showing
the live posts from my Tagembed gallery. preview.html and the server
file render the SAME markup with the SAME CSS, so a later restyle
applies to both. The CSS lives inside each file - no separate
stylesheet.

Language: these rules cover every language - never say the guide
only supports some, and never look for a ready-made example in my
language: writing it from these rules is the job, not "building from
memory". Write the server code in the language (or
framework) I picked before the build started - any server-side one:
PHP, Node.js, Python, Ruby, Go, Java, C#, Laravel, Django, or whatever I name - as
the real files it runs. A plain language means ONE file with its own
extension (app.py, server.js, index.php, main.go), standard library
only, run with one command and nothing to install. Never switch it to another language
and never add a second one unless I ask. If I have not picked yet, ask
me before writing code. The README comes in the same reply as the
server code, never on its own.

Name: it is a Social Widget. Use that name in the page title, the
header, the README and the code comments - never "social wall".

Looks: skin everything with the ONE theme I picked from the theme
catalogue:
BASE/guides/themes/README.md?v=2026-09-25a
That theme's preview file is the TEMPLATE - fetch it RAW:
BASE/guides/previews/<theme>.html
(the "Preview" line under the theme in the catalogue). If it will not
open, say so in one line and stop - do not rebuild the theme from
memory, and do not approximate it from the design spec's Values table
or the thumbnail either; the preview file's own <style> is the only
source for the design, never a paraphrase of it. Its
<style> comes first, then at the top of <body> its build note,
<template id="tbd-card-template"> and arrow <script>; the sample cards
with their base64 images come last and are never copied. Copy the whole
file as it is - the <style> block with every :root value, rule and
class, the <section>, and its arrow <script> if it has one - and only
inject the posts: replace the sample cards between <!-- tbd:cards -->
and <!-- /tbd:cards --> with one card per post, made from the file's
<template id="tbd-card-template"> with every {{slot}} filled as the
catalogue's "Filling the card" table says. Then delete the template
element and its note. Do not restyle it from the thumbnail, the design
spec or your own taste, and never copy its sample posts, names or
image URLs - the posts come only from the sample posts JSON below (or
the live API). If I have not
picked a theme yet, show me the catalogue's theme picker the way it
says - the thumbnails page rendered, never a list of names - and ask;
never pick one for me. Every part uses that same theme. One
skin only - no dark mode, no toggle. Some theme colours are white on
near-white, so where one is too faint to read as text, fix it and
say so - judged from the values, no contrast script.

Data: GET https://api.tagembed.com/api/v3/posts?limit=24, header Authorization:
Bearer <token>; token from ACCESS_TOKEN, base URL from API_BASE_URL,
neither in the code. Posts are at body.posts and paging at
body.paging, never the top level, and `status` can be false on an HTTP
200. No "fields" param exists. Leave `sort` alone. Page 2 =
body.paging.next_cursor sent back as `after` verbatim, never a post id.

Sample posts: fetch ONLY the file that matches the theme I picked,
RAW, and bake in every post in it - never skip it, never add posts
from the other file:
- a social theme (1-14 in the catalogue):
BASE/guides/sample-posts-social.json
- a review theme (15-17: Review Box, Review Carousel, Review List):
BASE/guides/sample-posts-reviews.json
Copy every image and video URL character for character: never retype,
shorten or invent one. If you cannot reach it, write 8-12 posts in
the same shape with no media rather than a made-up URL (for a review
theme, each with a rating). In the server file an empty ACCESS_TOKEN
renders them instead of calling the API; a real one switches to live
by itself.

Per post: author.name falling back to author.handle (either can be
null - never print "null"), network.name, content.text, created_at,
source.permalink with rel="noopener noreferrer". The image is the
FIRST media entry of type "image" via cdn_url, NOT media[0], which can
be a video. rating 0-5 marks a review post and is null on social ones
- same card, plus stars. Other missing values are null, never "" or 0.

Media: a video post renders <video controls muted playsinline
preload="none"> with the video entry's cdn_url as its source and the
post's first image as its poster - never autoplay, no JavaScript for it.
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

No narration: do not write a plan, a recap or "here is what I will
build" before a part, and nothing about a file after it - what it
contains, whether it is safe, whether it has scripts. The reply is the
files themselves, then step 3's one line naming the next part.

Every file complete - no placeholders, no "rest stays the same", no
truncation - with brief comments through the code.
