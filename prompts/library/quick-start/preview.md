# Prompt A, part 1 of 2 - preview.html

Fetch all three RAW and follow them exactly - the brief is what to
build, llms.txt carries the exact data field names (unguessable, and
the brief does not repeat them), the design spec the looks:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md?v=2026-09-24c
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md?v=2026-09-24c
Already fetched one of these for an earlier part? Do not fetch it again.

Deliver preview.html: the same page as a static file with the brief's
sample posts baked into the HTML, calling nothing, so I can
double-click it and see the design before I have a token. It IS the
preview file of the theme I picked (guides/previews/<theme>.html),
copied as it is, with the posts injected through its card template -
the theme catalogue's "How a theme becomes the build" and "Filling the
card" say how - and name the theme in one line. The CSS lives inside it - no separate
stylesheet - and the server code in my language reuses this markup
and CSS. Name it preview.html, not index.html.
