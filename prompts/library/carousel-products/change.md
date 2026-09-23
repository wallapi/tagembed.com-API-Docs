# Prompt 3e - carousels and shopping tags: the change

Show carousels properly: request expand=album so the parent post's
`media` array holds every slide, and render them as a row of
thumbnails inside the card. Without it each slide is a separate post
sharing the same album_id. Also add expand=products and show the
shopping tags under the post when `products` is not empty - each has
title, price, currency_symbol, url, image_url and in_stock. Both
expansions cost extra queries, so request them only where I actually
render them. The sample posts carry no albums, so preview.html stays
as it is.
