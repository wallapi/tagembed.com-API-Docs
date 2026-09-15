# Cursor - build a Tagembed social widget

Use this when Cursor works inside your project folder and can create files
itself. Setup is done once; after that a one-line request is enough because
the context file carries the rules on every turn.

## 1. Install Cursor

Download from https://cursor.com and install. Optional: enable the
`cursor` terminal command from the Command Palette
(**Shell Command: Install 'cursor' command**).

## 2. Create the project folder and drop in the two files

macOS / Linux:

```bash
mkdir my-social-wall && cd my-social-wall
curl -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
mkdir -p .cursor/rules
printf -- '---\ndescription: Tagembed social widget rules\nalwaysApply: true\n---\n' > .cursor/rules/tagembed.mdc
curl -sSL https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md >> .cursor/rules/tagembed.mdc
```

Windows (PowerShell):

```powershell
mkdir my-social-wall; cd my-social-wall
curl.exe -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
New-Item -ItemType Directory -Force .cursor/rules | Out-Null
"---`ndescription: Tagembed social widget rules`nalwaysApply: true`n---" | Set-Content .cursor/rules/tagembed.mdc
(Invoke-WebRequest https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/TAGEMBED_CONTEXT.md).Content | Add-Content .cursor/rules/tagembed.mdc
```

This gives you `llms.txt` (the API spec) and `.cursor/rules/tagembed.mdc` (the project rules
Cursor reads automatically - contents in
[../TAGEMBED_CONTEXT.md](../TAGEMBED_CONTEXT.md)).

## 3. Launch Cursor in that folder

```bash
cursor .
```

(or File > Open Folder > `my-social-wall`). Open the AI pane with
**Cmd+I** (macOS) / **Ctrl+I** (Windows) and make sure the mode selector
says **Agent**, not Ask.

The `.mdc` rule file has `alwaysApply: true` in its frontmatter, so Cursor
attaches it to every request. You can check it under Settings > Rules.

## 4. Paste this prompt

Two lines are enough: the rules file and llms.txt in the folder carry the
details, and the agent reads them on its own.

```
Build the Tagembed social widget described in .cursor/rules/tagembed.mdc and llms.txt in this folder. Give me BOTH languages: a single self-contained index.php (PHP 8, nothing to install) AND the Node.js set (server.js, package.json, cache file), plus one README.md covering both.
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
