# OpenAI Codex CLI - build a Tagembed social wall

Use this when OpenAI Codex CLI works inside your project folder and can create files
itself. Setup is done once; after that a one-line request is enough because
the context file carries the rules on every turn.

## 1. Install OpenAI Codex CLI

Needs Node.js 18+ (https://nodejs.org). Then:

```bash
npm install -g @openai/codex
```

Docs: https://github.com/openai/codex

## 2. Create the project folder and drop in the two files

macOS / Linux:

```bash
mkdir my-social-wall && cd my-social-wall
curl -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
curl -sSLo AGENTS.md https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md
```

Windows (PowerShell):

```powershell
mkdir my-social-wall; cd my-social-wall
curl.exe -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
curl.exe -sSLo AGENTS.md https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md
```

This gives you `llms.txt` (the API spec) and `AGENTS.md` (the project rules
OpenAI Codex CLI reads automatically - contents in
[../TAGEMBED_CONTEXT.md](../TAGEMBED_CONTEXT.md)).

## 3. Launch OpenAI Codex CLI in that folder

```bash
codex
```

Log in with your ChatGPT account on first run. Type the prompt at the `>`
prompt and press Enter.

Codex reads `AGENTS.md` from the project root on every run. If it asks for
permission before writing files, approve; you can also start it with
`codex --full-auto` to skip per-file approval inside this folder.

## 4. Paste ONE of these prompts

Two lines are enough: the rules file and llms.txt in the folder carry the
details, and the agent reads them on its own.

### PHP

```
Build the Tagembed social wall described in AGENTS.md and llms.txt in this folder. Use PHP 8: one self-contained index.php, nothing to install.
Don't ask me anything; create the files, then tell me how to run it as if I've never used a terminal.
```

### Node.js

```
Build the Tagembed social wall described in AGENTS.md and llms.txt in this folder. Use Node.js 18+ with Express: server.js and package.json.
Don't ask me anything; create the files, then tell me how to run it as if I've never used a terminal.
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
export TAGEMBED_ACCESS_TOKEN="wt1_your_token_here"
export TAGEMBED_API_BASE="https://staging-apis.tagembed.com/api"
php -S localhost:8080
```

Windows (PowerShell):

```powershell
cd my-social-wall
$env:TAGEMBED_ACCESS_TOKEN="wt1_your_token_here"
$env:TAGEMBED_API_BASE="https://staging-apis.tagembed.com/api"
php -S localhost:8080
```

Open http://localhost:8080 in your browser. Stop the server with Ctrl+C.

Verify the API side independently of the page:

```bash
curl -s -H "Authorization: Bearer $TAGEMBED_ACCESS_TOKEN" "$TAGEMBED_API_BASE/v3/posts?limit=1"
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
export TAGEMBED_ACCESS_TOKEN="wt1_your_token_here"
export TAGEMBED_API_BASE="https://staging-apis.tagembed.com/api"
node server.js
```

Windows (PowerShell):

```powershell
cd my-social-wall
npm install
$env:TAGEMBED_ACCESS_TOKEN="wt1_your_token_here"
$env:TAGEMBED_API_BASE="https://staging-apis.tagembed.com/api"
node server.js
```

Open http://localhost:3000 in your browser. Stop the server with Ctrl+C.

Verify the API side independently of the page:

```bash
curl -s -H "Authorization: Bearer $TAGEMBED_ACCESS_TOKEN" "$TAGEMBED_API_BASE/v3/posts?limit=1"
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
  follow-up) contained "ask me first" or similar. Reply: "Do not ask, build
  it now with the defaults in the prompt."
- **`Tagembed API error: 401`** - token missing or wrong in the environment
  variable, or the API is switched off for the account.
- **`422 Validation Failed`** - a query parameter is wrong; the response's
  `body.fields` names it. Paste it back to the AI.
- **Blank wall, no error** - the account has no approved posts, or the wall
  token points at a wall with none. Test with the curl command above.
- **Fields look wrong** (`undefined`, empty author) - the AI guessed field
  names; make sure llms.txt was attached or is in the folder, and paste the
  Post object section from it.

Spec: [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) · more prompts (filters, load-more, Redis, design):
[../../guides/prompts.md](../../guides/prompts.md)
