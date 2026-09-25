# Gemini - build a Tagembed social widget

Use this when you are chatting with Gemini in the browser. It cannot touch
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

1. Open https://gemini.google.com and start a **new chat**.
2. Click the **+** button in the message box, choose **Upload files**, and
   pick `llms.txt`.
3. Paste the prompt from step 3 and send.

Gemini follows instructions very literally. If you write "ask me for my
token before you start", it will stop, ask, and write a plan instead of code -
the code only arrives after you answer. The prompt below therefore names
the only two questions it may ask - theme, then language - and moves the
token to the end. Gemini also does not always open raw GitHub URLs, so
always attach the file. If it offers to open the result in **Canvas**, that is
fine - the file content is the same.

## 3. Paste this prompt

Four lines. Paste the block below as your first message, in a brand-new
chat (a continued one may reuse an old, stale fetch instead of reading the
files fresh). It links browser-preamble.md (hand over every file complete,
each starting with a `### FILE:` header) and steps.md (the theme picker, the
language question, then the build) - fetched one at a time, so every reply
stays quick and the theme-picker render is never spelled out here.

```
I am in a browser chat - fetch this RAW and follow it exactly: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/browser-preamble.md
Then build me a social widget from my Tagembed gallery - fetch this RAW and follow it exactly, stopping and waiting for my answer wherever it says to. Start with step 1: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/steps.md
Fetch every file fresh in this reply, even one you think you already know - never answer from memory of an earlier version.
If you cannot open a link, say so in one line - do not build from memory.
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
  me the theme picker page itself, rendered - `guides/themes/thumbnails.html`,
  as steps.md says - never a list."
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
