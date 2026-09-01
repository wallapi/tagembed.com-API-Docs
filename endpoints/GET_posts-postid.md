# Single Post [GET]

Returns one post by id. The same post object and the same `expand` handling as
[GET /v3/posts](GET_posts.md).

## Resource URL

```
GET /v3/posts/:postid
```

`:postid` is the post's id, prefixed (`post_4421`) or bare (`4421`).

## Parameters

| Name     | Type | Description                                                        |
| -------- | ---- | ------------------------------------------------------------------ |
| `expand` | csv  | Optional. `products` and/or `album`, exactly as on the list route. |

## Example requests

**cURL**

```bash
curl -s 'https://staging-apis.tagembed.com/api/v3/posts/post_4421?expand=products' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**Node.js** (18+, native `fetch`)

```js
const res = await fetch(`${BASE}/v3/posts/post_4421?expand=products`, {
  headers: { Authorization: `Bearer ${KEY}` },
});
if (res.status === 404) throw new Error('post not found');
const { body } = await res.json();
console.log(body.post);
```

**PHP** (cURL extension)

```php
<?php
$ch = curl_init("$base/v3/posts/post_4421?expand=products");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer $key"],
]);
$json = json_decode(curl_exec($ch), true);
$code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($code === 404) {
    throw new RuntimeException('post not found');
}
$post = $json['body']['post'];
```

## Example response

```json
{
  "status": true,
  "message": "Operation successful",
  "code": 200,
  "body": {
    "post": {
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
      "products": [
        {
          "id": "product_31",
          "external_id": "SKU-1001",
          "sku": "SKU-1001",
          "title": "Trail Backpack 30L",
          "url": "https://shop.example.com/p/trail-backpack",
          "image_url": "https://shop.example.com/i/backpack.jpg",
          "price": "89.00",
          "discount": null,
          "currency": "USD",
          "currency_symbol": "$",
          "in_stock": true,
          "position": 0
        }
      ]
    }
  }
}
```

## Errors

| HTTP code | When                                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 404       | No post with that id exists on your account — a post that is hidden, deleted, or belongs to someone else answers the same way |
| 422       | `:postid` is not a post id (wrong prefix, not a number)                                                                       |
