# Tagembed Developer API Documentation

The Tagembed Developer API (v3) gives you programmatic, **read-only** access to
the approved posts on your account's walls — every connected network, one
uniform JSON shape. Aggregate once, render anywhere: your website, an event
screen, digital signage.

Building with an AI coding agent (Claude, ChatGPT, Gemini, Cursor, Copilot)?
Point it at **[llms.txt](llms.txt)** — a single machine-readable spec of the
whole API — and see the [prompt library](guides/prompts.md) and the
[build-a-social-wall guide](guides/build-a-social-wall.md).

## General

- **Version:** v3
- **Base URL:** `https://staging-apis.tagembed.com/api`
- **Format:** JSON only, over HTTPS
- **Access:** read-only — there are no create/update/delete endpoints.
  Creating, moderating, hiding and pinning posts happens in your dashboard,
  not through this API.

All requests require a valid access token — see
**[Access_Token.md](Access_Token.md)**. Tokens are server-side secrets: never
call the API from a browser.

## Rate limit

Calling the API 1–2 times per second is fine. Cache responses for about five
minutes instead of fetching per page view. Your plan's daily API hit ceiling
applies across all API versions together; when exhausted, requests answer
`401` with an explanatory message.

## Response envelope

Every response wraps the payload in the same envelope; the endpoint's data is
in `body`:

```json
{
  "status": true,
  "message": "Operation successful",
  "code": 200,
  "body": { "...": "endpoint payload" }
}
```

Responses always carry the **full post object** (see
[Post_Object.md](Post_Object.md)) — there is no `fields` parameter.

## Errors

| HTTP code | Meaning |
|---|---|
| 401 | Missing/invalid token, API disabled on the plan, or daily hit limit exceeded — the message says which |
| 404 | The requested post does not exist on your account |
| 422 | Invalid parameters — **every** bad parameter is listed at once |

A `422` names each problem as a field entry, so a request with four mistakes
is one round trip to fix, not four:

```json
{
  "status": false,
  "message": "Validation Failed",
  "code": 422,
  "body": {
    "fields": [
      { "field": "limit", "code": "isInt", "detail": "limit must be a whole number" },
      { "field": "sort", "code": "isSortSpec", "detail": "`random` is not sortable — expected any of: created_at, modified_at, id, pinned" }
    ]
  }
}
```

## Ids

Ids are prefixed strings — `post_4421`, `wall_123`, `feed_88` — so a stray id
in a log says what it is. Parameters accept the prefixed or the bare numeric
form; responses always emit the prefixed form. A mismatched prefix (`wall_9`
where a post id belongs) is a `422`, not a wrong lookup.

## Pagination

Keyset (cursor) pagination — see **[Pagination.md](Pagination.md)**. Send each
response's `paging.next_cursor` back as `after`; never construct a cursor by
hand.

## Endpoints

### Posts

- **[GET /v3/posts](endpoints/GET_posts.md)** — list approved posts, filtered
  and paginated
- **[GET /v3/posts/:postid](endpoints/GET_posts-postid.md)** — fetch a single
  post

### Networks

- **[GET /v3/networks](endpoints/GET_networks.md)** — the network slugs
  accepted by `?networks=`

## Guides

- **[Build a social wall](guides/build-a-social-wall.md)** — fetch → cache →
  display, with complete PHP and Node.js implementations
- **[Prompt library](guides/prompts.md)** — copy-paste prompts for building
  and integrating with any AI coding agent
- **[llms.txt](llms.txt)** — the whole API as one file, written for LLMs
