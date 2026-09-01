# Posts Collection [GET]

Returns the approved posts for the authenticated account — pinned first, then
newest. `wall_id` is optional; omit it to read across every wall on the
account. Moderation-hidden and deleted posts are never returned.

## Resource URL

```
GET /v3/posts
```

## Parameters

All parameters are optional.

| Name             | Type    | Description                                                                                                                                                             |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wall_id`        | id list | Restrict to one or more walls, comma-separated. Prefixed (`wall_123`) or bare (`123`) ids both accepted.                                                                |
| `feed_ids`       | id list | Restrict to specific feeds (`feed_88,feed_90`).                                                                                                                         |
| `networks`       | csv     | Network slugs or numeric ids (`instagram,facebook`). See [GET /v3/networks](GET_networks.md) for the vocabulary. An unknown slug is a 422, never silently zero results. |
| `media_types`    | csv     | Any of `text`, `image`, `video`.                                                                                                                                        |
| `languages`      | csv     | ISO 639-1 codes (`en,de`).                                                                                                                                              |
| `sort`           | csv     | Comma-separated, `-` prefix for descending. Sortable: `created_at`, `modified_at`, `id`, `pinned`. Default: `-pinned,-created_at`.                                      |
| `limit`          | int     | Page size, default 50. Silently capped at your plan's per-call ceiling.                                                                                                 |
| `after`          | cursor  | Opaque cursor from the previous response's `paging.next_cursor`. Bound to the `sort` it was issued under — changing `sort` mid-pagination is a 422.                     |
| `pinned_only`    | flag    | Set to `1` for pinned posts only.                                                                                                                                       |
| `min_rating`     | int 0–5 | Reviews only — minimum star rating.                                                                                                                                     |
| `created_after`  | date    | ISO 8601 (`2026-01-01T00:00:00Z`) or unix seconds.                                                                                                                      |
| `created_before` | date    | Same formats.                                                                                                                                                           |
| `expand`         | csv     | Data that costs extra queries, OFF by default: `products` (UGC shopping tags), `album` (merge carousel siblings into `media`).                                          |

## Example requests

Call the API from your server only — the access token must never reach a browser.

**cURL**

```bash
curl -s 'https://staging-apis.tagembed.com/api/v3/posts?networks=instagram&media_types=image&sort=-created_at&limit=2' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**Node.js** (18+, native `fetch`)

```js
const BASE = 'https://staging-apis.tagembed.com/api';
const KEY = process.env.TAGEMBED_ACCESS_TOKEN;

const url = new URL(`${BASE}/v3/posts`);
url.search = new URLSearchParams({
  networks: 'instagram',
  media_types: 'image',
  sort: '-created_at',
  limit: '2',
});

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${KEY}` },
});
const { status, body } = await res.json();
if (!status) throw new Error(`API error ${res.status}`);
console.log(body.posts, body.paging);
```

**PHP** (cURL extension)

```php
<?php
$base = 'https://staging-apis.tagembed.com/api';
$key  = getenv('TAGEMBED_ACCESS_TOKEN');

$query = http_build_query([
    'networks'    => 'instagram',
    'media_types' => 'image',
    'sort'        => '-created_at',
    'limit'       => 2,
]);

$ch = curl_init("$base/v3/posts?$query");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $key"],
]);
$json = json_decode(curl_exec($ch), true);
curl_close($ch);

if (!($json['status'] ?? false)) {
    throw new RuntimeException('API error: ' . ($json['message'] ?? 'unknown'));
}
$posts  = $json['body']['posts'];
$paging = $json['body']['paging'];
```

## Example response

```json
{
  "status": true,
  "message": "Operation successful",
  "code": 200,
  "body": {
    "posts": [
      {
        "id": "post_4421",
        "object": "post",
        "wall_id": "wall_123",
        "feed_id": "feed_88",
        "album_id": null,
        "network": { "id": "network_2", "slug": "instagram", "name": "Instagram" },
        "media_type": "image",
        "language": "en",
        "pinned": false,
        "active": true,
        "created_at": "2026-08-30T09:12:44.000Z",
        "created_timestamp": 1787238764,
        "modified_at": null,
        "modified_timestamp": null,
        "content": { "title": null, "text": "Sunset at the summit #hiking" },
        "media": [
          {
            "type": "image",
            "url": "https://cloud.tagbox.com/media/abc.jpg",
            "cdn_url": "https://cloud.tagbox.com/media/abc.jpg",
            "width": 1080,
            "height": 1350
          }
        ],
        "author": {
          "name": "Alex Doe",
          "handle": "alexdoe",
          "avatar_url": "https://cloud.tagbox.com/avatars/alex.jpg",
          "profile_url": null,
          "external_id": "17841400000000000"
        },
        "source": {
          "external_post_id": "18000000000000000",
          "permalink": "https://www.instagram.com/p/XXXXXXXXXXX/"
        },
        "counts": { "likes": 240, "comments": 12 },
        "sentiment": "positive",
        "rating": null,
        "products": null
      }
    ],
    "paging": {
      "limit": 2,
      "has_more": true,
      "next_cursor": "eyJ2IjoxLCJzIjoiLWNyZWF0ZWRfYXQsLWlkIiwiayI6WzE3ODcyMzg3NjQsNDQyMV19"
    }
  }
}
```

## Post object notes

- `media_type` is `text` / `image` / `video` — never a bare numeric type code.
- Timestamps come as both ISO 8601 (`created_at`) and unix seconds
  (`created_timestamp`).
- Absent values are `null`, not `""` or `0` — "no rating" and "rated zero" are
  different facts.
- `album_id` groups carousel slides; every slide of one carousel shares it.
  Pass `expand=album` to have the API merge the siblings into `media` for you.
- `products` is `null` unless you pass `expand=products`; then it is an array
  of the UGC shopping tags on the post.

## Pagination

While `paging.has_more` is `true`, repeat the request with
`after=<paging.next_cursor>` and everything else unchanged. Treat the cursor
as an opaque blob — only ever send back what the previous response gave you.

**Node.js — walk every page**

```js
async function* allPosts(params = {}) {
  let after;
  do {
    const url = new URL(`${BASE}/v3/posts`);
    url.search = new URLSearchParams({ ...params, ...(after && { after }) });
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${KEY}` },
    });
    const { body } = await res.json();
    yield* body.posts;
    after = body.paging.has_more ? body.paging.next_cursor : null;
  } while (after);
}

for await (const post of allPosts({ limit: '100' })) {
  console.log(post.id, post.content.text);
}
```

**PHP — walk every page**

```php
<?php
function allPosts(string $base, string $key, array $params = []): array
{
    $posts = [];
    $after = null;
    do {
        if ($after !== null) {
            $params['after'] = $after;
        }
        $ch = curl_init("$base/v3/posts?" . http_build_query($params));
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => ["Authorization: Bearer $key"],
        ]);
        $json = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $posts  = array_merge($posts, $json['body']['posts']);
        $paging = $json['body']['paging'];
        $after  = $paging['has_more'] ? $paging['next_cursor'] : null;
    } while ($after !== null);

    return $posts;
}
```
