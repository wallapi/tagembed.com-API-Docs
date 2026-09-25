# claude.ai - build a Tagembed social widget

Use this when you are chatting with claude.ai in the browser. It cannot touch
your computer, so the prompt below makes it hand you complete files plus a
setup checklist, one step at a time - theme, then language, then the build in
two short replies instead of one long one.

## 1. Start the chat

Open https://claude.ai and start a **new chat**, then paste the prompt from
step 2 and send.

Claude usually puts each file in an **Artifact** panel on the right with a
**Download** button. It shows the theme picker first (as that artifact) and
asks which theme, then which language; if it asks anything else before the
code, reply "build it with the defaults in the prompt".

## 2. Paste this prompt

Two lines. The whole build - both questions, every step, the file
delivery format - lives in one linked file, `steps.md`, so the prompt itself
stays short:

```
Help me build a social widget from my Tagembed gallery, using Tagembed's public build guide as the plan (it says where to pause for my answers). Give every file complete, each starting with "### FILE: <name>".
Guide: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/steps.md
```

## 3. Save the files it gives you

For every `### FILE:` block: click the copy button on the code block, open a
plain-text editor (macOS: TextEdit with Format > Make Plain Text; Windows:
Notepad; or VS Code), paste, and save with the exact filename shown into a
new folder called `my-social-widget`. Do not let the editor add `.txt`.

### Run it

The `README.md` the AI hands over **together with the server code** has the
exact check and run commands for the language you picked. The common ones:

| Language | Check it is installed | Run it (in `my-social-widget`) | Open |
| -------- | --------------------- | ------------------------------ | ---- |
| Python   | `python3 --version` (Windows: `py --version`) | `python3 app.py` | the URL it prints |
| Node.js  | `node -v` (v18 or higher) | `node server.js` | the URL it prints |
| PHP      | `php -v` (8.x) | `php -S localhost:8080` | http://localhost:8080 |
| Go       | `go version` | `go run main.go` | the URL it prints |

Any other language or a framework you named: the README gives its own check,
install (only if a framework needs one) and run command.

Put your token in a `.env` file beside the server file - the code reads it on
its own:

```
ACCESS_TOKEN=wt1_your_token_here
API_BASE_URL=https://api.tagembed.com/api
```

Stop the server with Ctrl+C.

Verify the API side independently of the page:

```bash
curl -s -H "Authorization: Bearer wt1_your_token_here" "https://api.tagembed.com/api/v3/posts?limit=1"
```

You should see `"status":true` and one post inside `body.posts`. A 401 means
the token is wrong or the API is disabled for the account; the message says
which.

## If it goes wrong

- **The AI asked anything besides the theme and the language before writing
  code** - reply: "Build it now with the defaults in the prompt, and ask me
  for the credentials at the end."
- **It showed a list of theme names instead of the pictures** - reply: "Show
  me the theme picker page itself, rendered, as the theme catalogue says."
- **It wrote the server code in a different language than you asked** - reply:
  "Rewrite the server code in <your language>, with its README."
- **`Tagembed API error: 401`** - token missing or wrong in the environment
  variable, or the API is switched off for the account.
- **`422 Validation Failed`** - a query parameter is wrong; the response's
  `body.fields` names it. Paste it back to the AI.
- **Blank widget, no error** - the account has no approved posts, or the wall
  token points at a widget with none. Test with the curl command above.
- **Fields look wrong** (`undefined`, empty author) - the AI guessed field
  names instead of fetching llms.txt; reply "fetch llms.txt RAW and use its
  field names" and paste the Post object section from it if it still cannot.

Spec: [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) · more prompts (filters, load-more, Redis, design):
[../../guides/prompts.md](../../guides/prompts.md)
