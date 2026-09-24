# Prompts by tool - build a Tagembed social widget

One document per AI tool. Each contains the setup for that tool, one
prompt that first shows you the theme picker and then asks which language you
want the server code in - any language - the run commands for the common
ones, and a troubleshooting list. Open the file for the tool you use and follow it top to
bottom.

## Which document?

**Browser chat** (the AI cannot touch your computer; it hands you complete
files and you save them yourself):

| Tool      | Document                                     |
| --------- | -------------------------------------------- |
| ChatGPT   | [browser/chatgpt.md](browser/chatgpt.md)     |
| Gemini    | [browser/gemini.md](browser/gemini.md)       |
| claude.ai | [browser/claude-ai.md](browser/claude-ai.md) |

**Coding agent in an editor or terminal** (the AI creates the files in your
project folder itself; a context file carries the rules):

| Tool                     | Document                                                          | Context file it reads              |
| ------------------------ | ----------------------------------------------------------------- | ---------------------------------- |
| Claude Code              | [editor/claude-code.md](editor/claude-code.md)                    | `CLAUDE.md`                        |
| Cursor                   | [editor/cursor.md](editor/cursor.md)                              | `.cursor/rules/tagembed.mdc`        |
| OpenAI Codex CLI         | [editor/codex.md](editor/codex.md)                                | `AGENTS.md`                        |
| GitHub Copilot (VS Code) | [editor/copilot.md](editor/copilot.md)                            | `.github/copilot-instructions.md`  |
| Gemini CLI / Antigravity | [editor/gemini-cli-antigravity.md](editor/gemini-cli-antigravity.md) | `GEMINI.md`                     |
| Windsurf                 | [editor/windsurf.md](editor/windsurf.md)                          | `.windsurf/rules/tagembed.md`       |

Every document has one prompt, whatever language you want: the AI asks you
which one, then writes the server code in exactly that language with its
`README.md` in the same step. The context file contents are in
[TAGEMBED_CONTEXT.md](TAGEMBED_CONTEXT.md); the setup commands in each document
download it to the right path for that tool.

## Why the prompts are written this way

- **They ask two things first, and nothing else.** The theme (shown as the
  thumbnail picture page, never a list of names) and the server language
  change what gets built, so they come before the code, one per reply.
  Anything else waits.
- **The token comes last.** Some models
  (Gemini in particular) take "ask me for my token before you start"
  literally: they stop, ask, and print a plan; the code only comes after
  you answer. So the prompts move the question to the end instead of dropping
  it: the AI writes code that reads `API_BASE_URL` and `ACCESS_TOKEN`, and
  then asks you for both values and offers to write them into your `.env`.
  You are asked either way — just after the code exists, not before.
- **They are short on purpose.** Four or five lines for a browser AI, two for
  an editor agent. Every rule (envelope, default sort, cache, escaping, token
  server-side) is in llms.txt, and a fresh agent given only the repo link
  fetched the README, llms.txt and the endpoint pages on its own and built
  the widget correctly. A long prompt just repeats the spec.
- **Browser prompts add one line** asking for complete files with `### FILE:`
  headers and a setup checklist, because you will be saving the files by
  hand.
- **Both always attach [llms.txt](../llms.txt).** Field names like
  `content.text` and `media[].cdn_url` are not guessable.

Follow-up prompts (filters, load more, auto-refresh, Redis, design) work in
every tool and are in [../guides/prompts.md](../guides/prompts.md).
