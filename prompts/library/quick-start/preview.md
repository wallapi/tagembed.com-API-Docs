# Prompt A, part 1 of 4 - preview.html

Links written BASE/<path> are files in this repo. BASE is the one my prompt gave; if it gave none, BASE is where you got this file: the URL up to and including the branch name, or the local repo folder.

Fetch all three RAW and follow them exactly - the brief is what to
build, llms.txt carries the exact data field names (unguessable, and
the brief does not repeat them), the design spec the looks:
BASE/guides/widget-build-brief.md
BASE/llms.txt
BASE/guides/widget-design-spec.md
Already fetched one of these for an earlier part? Do not fetch it again.

Deliver preview.html: the same page as a static file with the brief's
sample posts baked into the HTML, calling nothing, so I can
double-click it and see the design before I have a token. The CSS
lives inside it - no separate stylesheet - and index.php and server.js
reuse this markup and CSS. Name it preview.html, not index.html.
