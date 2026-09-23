# Prompt 3d - auto-refresh for signage: the change

My message names the interval; where it does not, use 60 seconds.

Have the page refresh itself on that interval with
<meta http-equiv="refresh" content="60"> (60 replaced by my interval).
The server keeps its own 5-minute cache, so this adds no extra Tagembed
API calls - most of those refreshes are served from the cache file.
