# The Post Object

Every post, from every network, arrives in this one shape. Responses always
carry the full object — there is no `fields` parameter to slim it down.

```json
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
```

## Field notes

| Field | Notes |
|---|---|
| `id`, `wall_id`, `feed_id`, `album_id` | Prefixed string ids (`post_4421`); `null` where absent |
| `network` | `{ id, slug, name }` — the slug is what `?networks=` accepts, see [GET /v3/networks](endpoints/GET_networks.md) |
| `media_type` | `text`, `image` or `video` — never a bare numeric type code |
| `language` | ISO 639-1 code, or `null` |
| `pinned` | Pinned posts sort first by default |
| `created_at` / `created_timestamp` | The same instant as ISO 8601 and as unix seconds — pick whichever your stack prefers |
| `content.text` | Plain text: tags stripped, entities decoded. Render it as text, not HTML |
| `media[]` | `cdn_url` is the cached copy — prefer it for display; `width`/`height` are `null` when unknown |
| `author` | Some networks populate only `name` or only `handle`; each falls back to the other so a byline is never blank |
| `source.permalink` | Link to the original post on its network, when the network provides one |
| `sentiment` | Read from moderation analysis, or `null` |
| `rating` | Reviews only (0–5), `null` elsewhere — "no rating" and "rated zero" are different facts |
| `products` | `null` unless requested with `expand=products`; then an array of UGC shopping tags |

Absent values are `null`, never `""` or `0`.

## Carousels

Every slide of a carousel is its own post sharing the same `album_id` — group
them client-side for free, or pass `expand=album` and the API merges all
sibling media into the parent post's `media` array (costs an extra query).

## Products (`expand=products`)

Each entry:

```json
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
```
