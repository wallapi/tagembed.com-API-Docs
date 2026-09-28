# Gemini - build a Tagembed social widget

Use this when you are chatting with Gemini in the browser. It cannot touch
your computer, so the prompts below make it hand you complete files plus a
setup checklist, and forbid it from asking questions before the code.

## 1. Get the spec file

Download [llms.txt](../../llms.txt) to your computer
(right-click the link, "Save link as...", keep the name `llms.txt`), or in a
terminal:

```bash
BASE=https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build   # change "main" to test another branch
curl -sSLo llms.txt "$BASE/llms.txt"
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

## 3. Paste this prompt

Five lines. Paste the block as your first message with
llms.txt attached (or its contents pasted underneath). The detailed rules live
in llms.txt; the AI reads them there.

```
BASE = https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build - every BASE/... link, here and in the files you fetch, starts from it.
Build me a social widget: one web page that shows the live posts from my Tagembed gallery.
Brief: BASE/guides/widget-build-brief.md - fetch it RAW and the two specs it links (the API spec and the design spec); if you cannot fetch URLs, follow the attached llms.txt.
Give me BOTH languages: a single self-contained index.php (PHP 8, nothing to install) AND the Node.js set (server.js, package.json, cache file) - plus a preview.html - the same page as a static file with the sample posts baked into the HTML, calling nothing, so I can double-click it and see the design before I have a token - and one README.md covering them. Token comes from the ACCESS_TOKEN env var - write the code first, then ask me for it at the end.
Give me the complete code first, then tell me how to run it as if I've never used a terminal.
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
```

## 4. Save the files it gives you

For every `### FILE:` block: click the copy button on the code block, open a
plain-text editor (macOS: TextEdit with Format > Make Plain Text; Windows:
Notepad; or VS Code), paste, and save with the exact filename shown into a
new folder called `my-social-widget`. Do not let the editor add `.txt`.

### Run it (PHP)

Check the runtime once:

```bash
php -v    # must print PHP 8.x
```

Install PHP if the check fails: macOS `brew install php`, Windows https://windows.php.net/download, Ubuntu `sudo apt install php-cli php-curl`.

macOS / Linux (Terminal):

```bash
cd my-social-widget
export ACCESS_TOKEN="wt1_your_token_here"
export API_BASE_URL="https://api.tagembed.com/api"
php -S localhost:8080
```

Windows (PowerShell):

```powershell
cd my-social-widget
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
cd my-social-widget
npm install
export ACCESS_TOKEN="wt1_your_token_here"
export API_BASE_URL="https://api.tagembed.com/api"
node server.js
```

Windows (PowerShell):

```powershell
cd my-social-widget
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

## Step by step (Prompt 1 in Gemini)

Prompt 1 in [guides/prompts.md](../../guides/prompts.md) does not work in
Gemini as written: Gemini does not open raw GitHub files, so it replies
"I cannot open the link" and stops. Attach the steps file instead - Gemini
then follows it without opening anything, gives you links to the finished
previews and code, and writes only two small files (`.env`, and
`custom.css` if you change the look).

1. Download [steps.md](../../prompts/library/build/steps.md)
   (right-click, "Save link as...", keep the name `steps.md`), or in a terminal:

   ```bash
   BASE=https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build   # change "main" to test another branch
   curl -sSLo steps.md "$BASE/prompts/library/build/steps.md"
   ```

2. Open https://gemini.google.com, start a **new chat**, click **+** >
   **Upload files** and pick `steps.md`. If Gemini refuses the file,
   rename it `steps.txt`, or paste its contents under the prompt.
3. Paste this prompt and send:

```
BASE = https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build - every BASE/... link in the attached file starts from it.
Build me a social widget from my Tagembed gallery, step by step.
The attached steps.md lists every step and when to stop and wait for my answer - follow it exactly. You are Gemini: wherever it says "If you are ChatGPT or Gemini", do that. Open no link - only write links for me to click.
Start with step 1 now.
If steps.md is not attached, say so in one line - do not build from memory.
```

To test a branch, change `main` in the `BASE = ...` line and download
steps.md from that branch.

## If it goes wrong

- **"I cannot open the link ..."** - you pasted Prompt 1 from
  guides/prompts.md without the file. Start a new chat with steps.md
  attached and the prompt in
  [Step by step (Prompt 1 in Gemini)](#step-by-step-prompt-1-in-gemini).
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

Spec: [llms.txt](../../llms.txt) · more prompts (filters, load-more, Redis, design):
[../../guides/prompts.md](../../guides/prompts.md)
