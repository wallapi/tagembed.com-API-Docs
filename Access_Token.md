# Access Token

Every request is authenticated with a token from your Tagembed dashboard. Two
kinds exist; the API accepts either one, the same way.

## Widget access token (recommended)

A **widget access token** (starts with `wt1_`) is scoped to **one widget**: every
request made with it reads that widget and nothing else. It is what you should
paste into a website config or hand to a contractor — it cannot touch the rest
of the account.

1. Log in to your Tagembed dashboard.
2. Open the gallery you want the posts from, or create one.
3. On that gallery's card, click the **⋮** (three dots) menu.
4. Click **Access Token** and copy the value.

**"Access Token" appears in that menu when your account has API access.** If
it is not there, API access is not enabled on the account yet and no token can
be issued.

Every request made with it is pinned to that gallery automatically — there is
no widget parameter to pass, and no way to widen the scope.

The `wt1_` prefix is a version tag. A future token scheme would use a new
prefix, and previously issued tokens keep working.

## Account key

Your account's **user key** authorizes every widget on the account. Use it for
cross-widget reads and server-to-server integrations you fully control.

## How to send it

Preferred — the `Authorization` header:

```
GET /v3/posts
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Also accepted, for parity with other social-widget APIs:

```
GET /v3/posts?access_token=YOUR_ACCESS_TOKEN
```

Prefer the header: a token in a URL lands in access logs, proxy logs and
`Referer` headers.

## Keep it server-side

Both token kinds are secrets. Never put one in browser JavaScript — anyone who
opens dev tools can read it. Call the API from your server (or a thin proxy
that holds the token), read the token from an environment variable, and never
hard-code it. Plan rules and the daily hit ceiling apply identically to both
token kinds, always at your account's current values.
