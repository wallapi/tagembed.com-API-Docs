# Prompt 4 - upgrade or change the cache: the change

My message names the cache backend and the TTL; where it does not,
use Redis and 5 minutes.

Change the caching layer to the one I named: Redis, Memcached, my
framework's cache, or stale-while-revalidate (serve the cached copy
instantly and refresh in the background). Same behaviour contract:
the TTL in one named constant, always serve the last good copy on API
failure, never render blank, and keep a file-cache fallback if the
new backend is down.
