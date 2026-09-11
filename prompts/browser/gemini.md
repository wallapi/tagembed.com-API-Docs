# Gemini - build a Tagembed social wall

Use this when you are chatting with Gemini in the browser. It cannot touch
your computer, so the prompts below make it hand you complete files plus a
setup checklist, and forbid it from asking questions before the code.

## 1. Get the spec file

Download [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) to your computer
(right-click the link, "Save link as...", keep the name `llms.txt`), or in a
terminal:

```bash
curl -sSLo llms.txt https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt
```

## 2. Start the chat and attach the spec

1. Open https://gemini.google.com and start a **new chat**.
2. Click the **+** button in the message box, choose **Upload files**, and
   pick `llms.txt`.
3. Paste the prompt from step 3 and send.

Gemini follows instructions very literally. If you write "ask me for my
token before you start", it will stop, ask, and write a plan instead of code -
the code only arrives after you answer. The prompts below therefore say
"do not ask" explicitly. Gemini also does not always open raw GitHub URLs, so
always attach the file. If it offers to open the result in **Canvas**, that is
fine - the file content is the same.

## 3. Paste ONE of these prompts

Five lines. Pick your language and paste the block as your first message with
llms.txt attached (or its contents pasted underneath). The detailed rules live
in llms.txt; the AI reads them there.

### PHP

```
Build me a social wall: one web page that shows the live posts from my Tagembed wall.
API docs: https://github.com/wallapi/tagembed.com-API-Docs - read llms.txt there and follow its "Integration rules for generated code".
Use PHP 8: one self-contained index.php, nothing to install. Token comes from the TAGEMBED_ACCESS_TOKEN env var, so don't ask me for it.
Give me the complete code first, then tell me how to run it as if I've never used a terminal.
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
```

### Node.js

```
Build me a social wall: one web page that shows the live posts from my Tagembed wall.
API docs: https://github.com/wallapi/tagembed.com-API-Docs - read llms.txt there and follow its "Integration rules for generated code".
Use Node.js 18+ with Express: server.js and package.json. Token comes from the TAGEMBED_ACCESS_TOKEN env var, so don't ask me for it.
Give me the complete code first, then tell me how to run it as if I've never used a terminal.
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
```

## 4. Save the files it gives you

For every `### FILE:` block: click the copy button on the code block, open a
plain-text editor (macOS: TextEdit with Format > Make Plain Text; Windows:
Notepad; or VS Code), paste, and save with the exact filename shown into a
new folder called `my-social-wall`. Do not let the editor add `.txt`.

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
