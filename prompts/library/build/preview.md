# Prompt 1, part 1 of 2 - preview.html

Every link in this file is a complete URL - fetch it exactly as
written, character for character.

Fetch this RAW first and follow it - the shared rules for every part:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/common.md?v=2026-09-25b
Already fetched one of these for an earlier part? Do not fetch it again.

Deliver preview.html: the widget page as a static file with the
sample posts baked in as markup. It calls NOTHING - no fetch, no
token, no API - so I can double-click it and see the design before I
have a token. It IS the preview file of the theme I picked, copied
as it is, with the sample posts injected through its card template
(per common.md) - name the theme in one line. This page and its card
template are what the server code in my language reuses next. Name it
preview.html, not index.html: an index.html next to the server's entry
file (index.php, a static folder) gets served instead of it.
