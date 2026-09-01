# Networks Collection [GET]

Returns the network slug vocabulary that [GET /v3/posts](GET_posts.md)'s
`?networks=` parameter accepts. The list is derived from the live networks
table, so it can never disagree with what the posts endpoint resolves.

## Resource URL

```
GET /v3/networks
```

## Parameters

None.

## Example requests

**cURL**

```bash
curl -s 'https://staging-apis.tagembed.com/api/v3/networks' \
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

`?networks=` also accepts the numeric network id anywhere a slug is accepted.
An unknown slug in `?networks=` is answered with a 422 naming the slug — never
with silently empty results.
