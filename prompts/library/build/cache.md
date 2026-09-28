# Social widget - the cache (index.php and server.js follow this)

Cache: a local JSON file, 5 minutes in one named constant, keyed per
request - about 288 calls a day at any traffic, however many visitors.
- Create the cache folder on first run.
- Write a temp file and rename it in, so a reader never sees half a
  file.
- A failed refresh keeps serving the old copy - a stale widget beats
  an empty one.
- Empty state only if nothing ever loaded.
- An unwritable folder serves live instead of failing, and the README
  says so.
- An empty ACCESS_TOKEN renders the sample posts and touches neither
  the API nor the cache.
