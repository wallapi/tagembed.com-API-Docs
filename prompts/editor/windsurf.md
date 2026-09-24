# Windsurf - build a Tagembed social widget

Use this when Windsurf works inside your project folder and can create files
itself. Setup is done once; after that a one-line request is enough because
the context file carries the rules on every turn.

## 1. Install Windsurf

Download from https://windsurf.com and install.

## 2. Create the project folder and drop in the two files

macOS / Linux:

```bash
mkdir my-social-widget && cd my-social-widget
curl -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
mkdir -p .windsurf/rules
curl -sSLo .windsurf/rules/tagembed.md https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md
```

Windows (PowerShell):

```powershell
mkdir my-social-widget; cd my-social-widget
curl.exe -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
New-Item -ItemType Directory -Force .windsurf/rules | Out-Null
curl.exe -sSLo .windsurf/rules/tagembed.md https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md
```

This gives you `llms.txt` (the API spec) and `.windsurf/rules/tagembed.md` (the project rules
Windsurf reads automatically - contents in
[../TAGEMBED_CONTEXT.md](../TAGEMBED_CONTEXT.md)).

## 3. Launch Windsurf in that folder

Open the folder with File > Open Folder (or `windsurf .` if you enabled
the shell command). Open **Cascade** with **Cmd+L** (macOS) / **Ctrl+L**
(Windows) and make sure it is in **Write** mode, not Chat.

Rules in `.windsurf/rules/` are applied to every Cascade request. Approve
the file writes and the `npm install` step when Cascade proposes them.

## 4. Paste this prompt

Two lines are enough: the rules file and llms.txt in the folder carry the
details, and the agent reads them on its own.

```
Build the Tagembed social widget described in .windsurf/rules/tagembed.md and llms.txt in this folder. First open the theme picker from the theme catalogue in my browser - the thumbnails page itself, not a list of names - and ask which theme I want; then ask which language I want the server code in (any: Python, PHP, Node.js, Go, ...). One question per reply, and start building on my second answer.
Build only in that language: the runnable server file(s) and their README.md in the same step, plus a preview.html - the same page as a static file with the sample posts baked into the HTML, calling nothing, so I can double-click it and see the design before I have a token. Then ask me for my token, and tell me how to run it as if I've never used a terminal.
```

Approve the file creations it proposes. When it finishes, its README has the run
command for your language; the common ones are below.

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

## 5. Next changes are one line each

With the context file in place you can keep going with short requests, e.g.
"make it a 3-column masonry grid", "add a network filter bar built from
GET /v3/networks", "add a Load more button using paging.next_cursor", "swap
the cache for Redis with a file fallback". Ready-made versions of these are in
[../../guides/prompts.md](../../guides/prompts.md).

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
  names; make sure llms.txt was attached or is in the folder, and paste the
  Post object section from it.

Spec: [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) · more prompts (filters, load-more, Redis, design):
[../../guides/prompts.md](../../guides/prompts.md)
