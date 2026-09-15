# Claude Code - build a Tagembed social widget

Use this when Claude Code works inside your project folder and can create files
itself. Setup is done once; after that a one-line request is enough because
the context file carries the rules on every turn.

## 1. Install Claude Code

Needs Node.js 18+ (https://nodejs.org). Then, in a terminal:

```bash
npm install -g @anthropic-ai/claude-code
```

Docs: https://docs.anthropic.com/en/docs/claude-code

## 2. Create the project folder and drop in the two files

macOS / Linux:

```bash
mkdir my-social-wall && cd my-social-wall
curl -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
curl -sSLo CLAUDE.md https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md
```

Windows (PowerShell):

```powershell
mkdir my-social-wall; cd my-social-wall
curl.exe -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
curl.exe -sSLo CLAUDE.md https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md
```

This gives you `llms.txt` (the API spec) and `CLAUDE.md` (the project rules
Claude Code reads automatically - contents in
[../TAGEMBED_CONTEXT.md](../TAGEMBED_CONTEXT.md)).

## 3. Launch Claude Code in that folder

```bash
claude
```

The first run asks you to log in with your Anthropic account. You are then
in a chat inside the terminal; type the prompt and press Enter.

Claude Code reads `CLAUDE.md` automatically at the start of every session.
When it wants to create or edit a file it shows a diff and asks - answer
**Yes** (or choose "Yes, and don't ask again for this session").

## 4. Paste this prompt

Two lines are enough: the rules file and llms.txt in the folder carry the
details, and the agent reads them on its own.

```
Build the Tagembed social widget described in CLAUDE.md and llms.txt in this folder. Give me BOTH languages: a single self-contained index.php (PHP 8, nothing to install) AND the Node.js set (server.js, package.json, cache file), plus one README.md covering both.
Create the files first, then ask me for my base URL and token, and tell me how to run it as if I've never used a terminal.
```

Approve the file creations it proposes. When it finishes it prints the run
commands; they match the ones below.

### Run it (PHP)

Check the runtime once:

```bash
php -v    # must print PHP 8.x
```

Install PHP if the check fails: macOS `brew install php`, Windows https://windows.php.net/download, Ubuntu `sudo apt install php-cli php-curl`.

macOS / Linux (Terminal):

```bash
cd my-social-wall
export ACCESS_TOKEN="wt1_your_token_here"
export API_BASE_URL="https://api.tagembed.com/api"
php -S localhost:8080
```

Windows (PowerShell):

```powershell
cd my-social-wall
$env:ACCESS_TOKEN="wt1_your_token_here"
$env:API_BASE_URL="https://api.tagembed.com/api"
php -S localhost:8080
```

Open http://localhost:8080 in your browser. Stop the server with Ctrl+C.

Verify the API side independently of the page:

```bash
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$API_BASE_URL/v3/posts?limit=1"
```

You should see `"status":true` and one post inside `body.posts`. A 401 means
the token is wrong or the API is disabled for the account; the message says
which.

### Run it (Node.js)

Check the runtime once:

```bash
node -v   # must print v18 or higher
```

Install Node.js from https://nodejs.org (LTS) if the check fails.

macOS / Linux (Terminal):

```bash
cd my-social-wall
npm install
export ACCESS_TOKEN="wt1_your_token_here"
export API_BASE_URL="https://api.tagembed.com/api"
node server.js
```

Windows (PowerShell):

```powershell
cd my-social-wall
npm install
$env:ACCESS_TOKEN="wt1_your_token_here"
$env:API_BASE_URL="https://api.tagembed.com/api"
node server.js
```

Open http://localhost:3000 in your browser. Stop the server with Ctrl+C.

Verify the API side independently of the page:

```bash
curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "$API_BASE_URL/v3/posts?limit=1"
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

- **The AI asked questions instead of writing code** - your prompt (or a
  follow-up) asked before writing anything. Reply: "Build it now with the
  defaults in the prompt, and ask me for the credentials at the end."
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
