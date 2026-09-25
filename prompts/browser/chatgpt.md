# ChatGPT - build a Tagembed social widget

Use this when you are chatting with ChatGPT in the browser. It cannot touch
your computer, so the prompts below make it hand you complete files plus a
setup checklist. It asks you two things first - which theme, then which
language the server code should be in - and nothing else before the code.

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
Brief: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-build-brief.md?v=2026-09-24c - fetch it RAW and the two specs it links (the API spec and the design spec); if you cannot fetch URLs, follow the attached llms.txt.
First show me the theme picker from the theme catalogue as an HTML artifact - the thumbnails page itself, not a list of names - and ask which theme I want; then ask exactly this - never shortened into an either/or between two languages: "Which language or framework do you want the server code in? Any one you name." One question per reply, and start building on my second answer. Build only in that language: the runnable server file(s) and their README.md in the same reply, plus a preview.html - the same page as a static file with the sample posts baked into the HTML, calling nothing, so I can double-click it and see the design before I have a token. Token comes from the ACCESS_TOKEN env var - write the code first, then ask me for it at the end.
Give me the complete code first, then tell me how to run it as if I've never used a terminal.
You can't access my computer, so output every file complete and ready to save, starting each with "### FILE: <name>", then a setup checklist.
```

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
- **Fields look wrong** (`undefined`, empty author) - the AI guessed field
  names; make sure llms.txt was attached or is in the folder, and paste the
  Post object section from it.

Spec: [llms.txt](https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/llms.txt) · more prompts (filters, load-more, Redis, design):
[../../guides/prompts.md](../../guides/prompts.md)
