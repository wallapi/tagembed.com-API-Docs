# Prompt library

Each prompt in [../../guides/prompts.md](../../guides/prompts.md) is one short
block you paste once. It links one file per deliverable from this folder, and
the AI fetches each raw URL and follows it. A follow-up's `change.md` says what
changes; its part files say how that lands in each file. The themes the
build prompts offer are in [../../guides/themes/](../../guides/themes/).

| Folder | Prompt | Parts, in order |
| ------ | ------ | --------------- |
| [build/](build/) | Prompt 1 — the main build | the prompt links only `steps.md`, which asks theme, then stack, then builds at once: `preview.md`, `php.md` **or** `nodejs.md`, `readme-file.md`; shared: `common.md`, `cache.md` |
| [quick-start/](quick-start/) | Prompt A — the brief-driven build | asks theme, then stack, then builds at once; `preview.md`, `php.md` **or** `nodejs.md`, `readme-file.md` |
| [integrate/](integrate/) | Prompt 2 — into an existing site | `section.md`, `preview.md`, `summary.md` |
| [restyle/](restyle/) | Prompt 3a — restyle | `change.md`; `preview.md`, `php.md`, `nodejs.md` |
| [network-filter/](network-filter/) | Prompt 3b — network filter bar | `change.md`; `php.md`, `nodejs.md`, `preview.md` |
| [pagination/](pagination/) | Prompt 3c — "Next page" link | `change.md`; `php.md`, `nodejs.md` |
| [auto-refresh/](auto-refresh/) | Prompt 3d — auto-refresh | `change.md`; `php.md`, `nodejs.md` |
| [carousel-products/](carousel-products/) | Prompt 3e — carousels, shopping tags | `change.md`; `php.md`, `nodejs.md` |
| [cache-upgrade/](cache-upgrade/) | Prompt 4 — change the cache | `change.md`; `php.md`, `nodejs.md`, `readme-file.md` |
| [browser-preamble.md](browser-preamble.md) | Prompt 0 — browser-AI preamble | — |

Raw URL of each: `https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/<folder>/<file>`
