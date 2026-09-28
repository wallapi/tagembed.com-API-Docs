# Prompt A, part 3 of 4 - server.js + package.json

Links written BASE/<path> are files in this repo. BASE is the one my prompt gave; if it gave none, BASE is where you got this file: the URL up to and including the branch name, or the local repo folder.

Fetch all three RAW and follow them exactly - the brief is what to
build, llms.txt carries the exact data field names (unguessable, and
the brief does not repeat them), the design spec the looks:
BASE/guides/widget-build-brief.md
BASE/llms.txt
BASE/guides/widget-design-spec.md
Already fetched one of these for an earlier part? Do not fetch it again.

Deliver the Node.js set: server.js and package.json - API call, cache
(brief section 3), HTML and CSS inside server.js, no separate
stylesheet. Same CSS and markup as preview.html and index.php from
parts 1-2. Read the base URL and token from the API_BASE_URL and
ACCESS_TOKEN settings - never hard-code them.
