# ChatGPT - build a Tagembed social widget

Use this when you are chatting with ChatGPT in the browser. It cannot touch
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

1. Open https://chatgpt.com and start a **new chat**.
2. Click the **+** (paperclip) button next to the message box, choose
   **Upload from computer**, and pick `llms.txt`.
3. Paste the prompt from step 3 and send.

ChatGPT can sometimes fetch URLs itself, but attaching the file is more
reliable than hoping it browses. If your plan has no file upload, paste the
whole llms.txt at the bottom of the prompt instead. Use the **Copy code**
button on each code block - never retype a file.

## 3. Paste this prompt

Five lines. Paste the block as your first message with
llms.txt attached (or its contents pasted underneath). The detailed rules live
in llms.txt; the AI reads them there.

```
Build me a social widget: one web page that shows the live posts from my Tagembed gallery.
Brief: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md - fetch it RAW and the two specs it links (the API spec and the design spec); if you cannot fetch URLs, follow the attached llms.txt.
Give me BOTH languages: a single self-contained index.php (PHP 8, nothing to install) AND the Node.js set (server.js, package.json, cache file) - plus a preview.html - the same page as a static file with the sample posts baked into the HTML, calling nothing, so I can double-click it and see the design before I have a token - and one README.md covering them. Token comes from the ACCESS_TOKEN env var - write the code first, then ask me for it at the end.
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
