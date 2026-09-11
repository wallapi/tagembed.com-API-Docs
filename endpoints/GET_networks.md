# Networks Collection [GET]

Returns the network vocabulary used across the API — the values that can
appear as `network.slug` on a post. The list is derived from the live networks
table, so it can never disagree with what the posts endpoint returns.

This is a reference list, **not a filter**. There is no `?networks=`
parameter: to show one network's posts, pass that network's feed ids to
`?feed_ids=` on [GET /v3/posts](GET_posts.md).

## Resource URL

```
GET /v3/networks
```

## Parameters

None.

## Example requests

**cURL**

```bash
curl -s 'https://api.tagembed.com/api/v3/networks' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**Node.js** (18+, native `fetch`)

```js
const res = await fetch(`${BASE}/v3/networks`, {
  headers: { Authorization: `Bearer ${KEY}` },
});
const { body } = await res.json();
console.log(body.networks); // ['facebook', 'instagram', ...]
```

**PHP** (cURL extension)

```php
<?php
$ch = curl_init("$base/v3/networks");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $key"],
]);
$json = json_decode(curl_exec($ch), true);
curl_close($ch);

$networks = $json['body']['networks'];
```

## Example response

```json
{
  "status": true,
  "message": "Operation successful",
  "code": 200,
  "body": {
    "networks": [
      "facebook",
      "instagram",
      "instagram_business",
      "linkedin",
      "pinterest",
      "tiktok",
      "twitter",
      "youtube"
    ]
  }
}
```

Each entry is also addressable by its numeric id, which is what a post's
`network.id` carries (`network_2`).
