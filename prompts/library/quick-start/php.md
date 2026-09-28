# Prompt A, part 2 of 4 - index.php

Links written BASE/<path> are files in this repo. BASE is the one my prompt gave; if it gave none, BASE is where you got this file: the URL up to and including the branch name, or the local repo folder.

Fetch all three RAW and follow them exactly - the brief is what to
build, llms.txt carries the exact data field names (unguessable, and
the brief does not repeat them), the design spec the looks:
BASE/guides/widget-build-brief.md
BASE/llms.txt
BASE/guides/widget-design-spec.md
Already fetched one of these for an earlier part? Do not fetch it again.

Deliver a single self-contained index.php - API call, cache (brief
section 3), HTML and CSS inside it, no separate stylesheet. Same CSS
and markup as preview.html from part 1. Read the base URL and token
from the API_BASE_URL and ACCESS_TOKEN settings - never hard-code
them.
