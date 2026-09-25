# Prompt 2, part 1 of 3 - the widget section in my site

Fetch these three RAW and follow them exactly - together they are the
whole brief, so do not borrow conventions from other social-widget APIs:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
Already fetched one of these for an earlier part? Do not fetch it again.

My message names my stack, cache and layout; where it does not,
inspect my repository, or assume plain PHP, a file cache and the MOSAIC.

Render a Tagembed social widget INTO my EXISTING website - a section
inside pages I already have, matching my project's structure and
templating. Still server-side: the posts are in the HTML before it
leaves my server, and the browser calls nothing. Inside my
repository, inspect it and follow its patterns; otherwise assume a
conventional layout. Fit my existing build and deploy, no new
frameworks. A file cache follows this contract:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/cache.md

Two changes from the brief's defaults, since this is a section and not
a page of its own: use the layout I named (the MOSAIC from design
spec section 5, the reel rail in section 4 - fetch
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/design/reel-layout.md only for that one - a uniform grid or
a vertical feed), and scope every style to this section, never
site-wide - the surrounding page has its own CSS.

Read the base URL and token from API_BASE_URL and ACCESS_TOKEN, and do
not open with questions and wait - write the code in this reply.
