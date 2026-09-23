# Prompt 3c - "Next page" link: the change

Add a "Next page" link under the widget: pass body.paging.next_cursor
back as `after` in the page's own query string, and hide the link when
body.paging.has_more is false. The cursor is sealed - pass it back
exactly as given, never construct or parse one, never send a post id
as `after`. Keep the same `sort` on every page; changing it
mid-pagination invalidates the cursor and returns 422.
Cache each page under its own key (the cursor is part of the key) with
the same TTL as the first page - otherwise every visitor paging
through is a fresh API call and my daily hit count scales with traffic
instead of with time. preview.html has no second page, so it stays as
it is.
