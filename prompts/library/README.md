# Prompt library

Each prompt in [../../guides/prompts.md](../../guides/prompts.md) is one short
block you paste once. It links one file per deliverable from this folder, and
the AI fetches each raw URL and follows it. A follow-up's `change.md` says what
changes; its part files say how that lands in each file. Every `server.md`
works for whatever language the server code is in. The themes the
build prompts offer are in [../../guides/themes/](../../guides/themes/).

| Folder | Prompt | Parts, in order |
| ------ | ------ | --------------- |
| [build/](build/) | Prompt 1 — the main build | the prompt links only `steps.md`: theme (the rendered thumbnails page) → preview (already-built `preview.html`, no fetch but its own) → optional customise (`custom.css`) → stack. PHP/Node.js/React/Simple HTML hand over an already-built, already-tested zip from [../../templates/](../../templates/); anything else ports that same code, fast, using the closest bundle as reference - no `common.md`/`cache.md`/`server.md` fetch either way |
| [quick-start/](quick-start/) | Prompt A — the brief-driven build | asks theme, then language, then builds at once; `preview.md`, then `server.md` (server code + README together) |
| [integrate/](integrate/) | Prompt 2 — into an existing site | `section.md`, `preview.md`, `summary.md` |
| [restyle/](restyle/) | Prompt 3a — restyle | `change.md`; `preview.md`, `server.md` |
| [network-filter/](network-filter/) | Prompt 3b — network filter bar | `change.md`; `server.md`, `preview.md` |
| [pagination/](pagination/) | Prompt 3c — "Next page" link | `change.md`; `server.md` |
| [auto-refresh/](auto-refresh/) | Prompt 3d — auto-refresh | `change.md`; `server.md` |
| [carousel-products/](carousel-products/) | Prompt 3e — carousels, shopping tags | `change.md`; `server.md` |
| [cache-upgrade/](cache-upgrade/) | Prompt 4 — change the cache | `change.md`; `server.md` (server code + README together) |
| [browser-preamble.md](browser-preamble.md) | Prompt 0 — browser-AI preamble | — |

Raw URL of each: `https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/<folder>/<file>`
