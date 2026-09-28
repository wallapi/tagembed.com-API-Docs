# Prompt library

Links written BASE/<path> are files in this repo. BASE is the one my prompt gave; if it gave none, BASE is where you got this file: the URL up to and including the branch name, or the local repo folder.

Each prompt in [../../guides/prompts.md](../../guides/prompts.md) is one short
block you paste once. It links one file per deliverable from this folder, and
the AI fetches each raw URL and follows it. A follow-up's `change.md` says what
changes; its part files say how that lands in each file.

| Folder | Prompt | Parts, in order |
| ------ | ------ | --------------- |
| [build/](build/) | Prompt 1 — the guided build | `steps.md` (theme → `preview.md` → stack: `php.md` / `nodejs.md` / `react.md` / `html.md` → `readme-file.md`); shared: `common.md`, `cache.md` |
| [quick-start/](quick-start/) | Prompt A — the brief-driven build | `preview.md`, `php.md`, `nodejs.md`, `readme-file.md` |
| [integrate/](integrate/) | Prompt 2 — into an existing site | `section.md`, `preview.md`, `summary.md` |
| [restyle/](restyle/) | Prompt 3a — restyle | `change.md`; `preview.md`, `php.md`, `nodejs.md` |
| [network-filter/](network-filter/) | Prompt 3b — network filter bar | `change.md`; `php.md`, `nodejs.md`, `preview.md` |
| [pagination/](pagination/) | Prompt 3c — "Next page" link | `change.md`; `php.md`, `nodejs.md` |
| [auto-refresh/](auto-refresh/) | Prompt 3d — auto-refresh | `change.md`; `php.md`, `nodejs.md` |
| [carousel-products/](carousel-products/) | Prompt 3e — carousels, shopping tags | `change.md`; `php.md`, `nodejs.md` |
| [cache-upgrade/](cache-upgrade/) | Prompt 4 — change the cache | `change.md`; `php.md`, `nodejs.md`, `readme-file.md` |
| [browser-preamble.md](browser-preamble.md) | Prompt 0 — browser-AI preamble | — |

Raw URL of each: `BASE/prompts/library/<folder>/<file>`, where BASE is
`https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/<branch>`.

No file here hardcodes a branch. Every link is written `BASE/<path>`, and BASE
is set once, in the first line of the pasted prompt. To test a branch, change
`main` in that one line (for example to `feat/check-code`) and every file the
AI fetches after that comes from the same branch.

To test uncommitted changes, set BASE to your local copy instead: the repo
folder path for an editor agent (Claude Code, Cursor...), or
`python3 -m http.server 8000` in the repo root plus
`BASE = http://localhost:8000`.
