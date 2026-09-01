# Access Token

Every request is authenticated with a token from your Tagembed dashboard. Two
kinds exist; the API accepts either one, the same way.

## Wall access token (recommended)

A **wall access token** (starts with `wt1_`) is scoped to **one wall**: every
request made with it reads that wall and nothing else. It is what you should
paste into a website config or hand to a contractor — it cannot touch the rest
of the account.

Get it from your wall's settings in the dashboard (API section). With a wall
token, the `wall_id` parameter can be omitted — the wall is implied — or must
name exactly that wall; anything else is a `422`.

The `wt1_` prefix is a version tag. A future token scheme would use a new
prefix, and previously issued tokens keep working.

## Account key

Your account's **user key** authorizes every wall on the account. Use it for
cross-wall reads and server-to-server integrations you fully control.

## How to send it

Preferred — the `Authorization` header:

```
GET /v3/posts
Authorization: Bearer YOUR_TOKEN
```

Also accepted, for parity with other social-wall APIs:

```
GET /v3/posts?access_token=YOUR_TOKEN
```

Prefer the header: a token in a URL lands in access logs, proxy logs and
`Referer` headers.

## Keep it server-side

Both token kinds are secrets. Never put one in browser JavaScript — anyone who
opens dev tools can read it. Call the API from your server (or a thin proxy
that holds the token), read the token from an environment variable, and never
hard-code it. Plan rules and the daily hit ceiling apply identically to both
token kinds, always at your account's current values.
