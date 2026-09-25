# Gemini - build a Tagembed social widget

Use this when you are chatting with Gemini in the browser. It cannot touch
your computer, so the prompt below makes it hand you complete files plus a
setup checklist. Gemini does not reliably open raw GitHub links, so the
build's step-by-step file (`steps.md`) is attached rather than linked, and
the prompt tells Gemini to open no other link either - only write links back
for you to click.

## 1. Download steps.md

```bash
curl -sSLo steps.md https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/steps.md
```
Or right-click [steps.md](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/steps.md), "Save link as...", keeping the name `steps.md`.

## 2. Start the chat and attach it

1. Open https://gemini.google.com and start a **new chat**.
2. Click the **+** button in the message box, choose **Upload files**, and
   pick `steps.md` (rename it `steps.txt` first if Gemini refuses the file).
3. Paste the prompt from step 3 and send.

Gemini follows instructions very literally, so the prompt spells out that it
should follow the attached file exactly and never open a link itself.

## 3. Paste this prompt

```
Build me a social widget from my Tagembed gallery, step by step.
The attached steps.md lists every step and when to stop and wait for my answer - follow it exactly. You are Gemini: wherever it says "If you are ChatGPT or Gemini", do that. Open no link - only write links for me to click. You cannot access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>".
Start with step 1 now.
If steps.md is not attached, say so in one line - do not build from memory.
```

PHP or Node.js build fastest here: their files are already written, so
Gemini only ever hands you links and writes the couple of small config files
itself, never a whole file it would otherwise have to fetch and repeat back.

## 4. Save the files it gives you

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
- **Fields look wrong** (`undefined`, empty author) - Gemini opens no link
  and guessed instead; download
  [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt),
  attach it too, and paste the Post object section from it.

Spec: [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) · more prompts (filters, load-more, Redis, design):
[../../guides/prompts.md](../../guides/prompts.md)
