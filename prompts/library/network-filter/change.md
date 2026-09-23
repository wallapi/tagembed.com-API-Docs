# Prompt 3b - network filter bar: the change

Add a network filter bar above the widget - server-side links that
reload the page with a query parameter, not a browser fetch. There is
no networks parameter: a feed is one network's source on the gallery,
so filter with ?feed_ids= using the selected network's feed ids. Each
post carries feed_id and network.name, so build the bar from the posts
you already fetched.
