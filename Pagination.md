# Pagination

The API paginates with a **keyset cursor**, not page numbers or offsets. Each
page of [GET /v3/posts](endpoints/GET_posts.md) returns:

```json
"paging": {
  "limit": 50,
  "has_more": true,
  "next_cursor": "eyJ2IjoxLCJzIjoiLXBpbm5lZCwtY3JlYXRlZF9hdCwtaWQiLCJrIjpbMCwxNzg3MjM4NzY0LDQ0MjFdfQ"
}
```

## The algorithm

1. Request the first page (no `after`).
2. While `paging.has_more` is `true`, repeat the **same request** adding
   `after=<paging.next_cursor>`.
3. Stop when `has_more` is `false`.

```
GET /v3/posts?limit=50
GET /v3/posts?limit=50&after=eyJ2IjoxLCJzIjoiLXBpbm5lZCwt...
GET /v3/posts?limit=50&after=eyJ2IjoxLCJzIjoiLXBpbm5lZCwt...
```

## Rules

- The cursor is an **opaque blob**. Only ever send back what the previous
  response gave you; never construct or modify one.
- The cursor is **bound to the `sort` it was minted under**. Changing `sort`
  mid-pagination answers `422` — restart from the first page instead.
- Cursors resume exactly where the previous page stopped, so posts arriving
  between two requests can never shift the window and show you the same post
  twice — the classic failure of offset pagination on a live feed.
