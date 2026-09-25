# Gemini - build a Tagembed social widget

Use this when you are chatting with Gemini in the browser. It cannot touch
your computer, so the prompts below make it hand you complete files (or a
download link) plus a setup checklist. It walks through short steps - theme,
then the preview, an optional customise, then PHP / Node.js / React /
Simple HTML / Other - and nothing else before the code. The first four
stacks are already built and tested, so those arrive as a ready zip in
seconds; naming anything else ports that same code into your stack instead.

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
files fresh). It is one link, steps.md - the theme picker, the language
question, then the build, fetched one step at a time so every reply stays
quick and the theme-picker render is never spelled out here.

```
Build me a social widget from my Tagembed gallery.
Fetch this RAW and follow it exactly - it lists every step and when
to stop and wait for my answer. Start with step 1 now:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/steps.md
If a link will not open, say so in one line and stop.
```

## 4. Save the files it gives you

**PHP / Node.js / React / Simple HTML:** click the download link, unzip it
into a folder called `my-social-widget`, then put the `.env` (and
`custom.css`, if you asked for a change) it gave you inside that same
unzipped folder.

**Any other stack:** for every `### FILE:` block, click the copy button on
the code block, open a plain-text editor (macOS: TextEdit with Format >
Make Plain Text; Windows: Notepad; or VS Code), paste, and save with the
exact filename shown into `my-social-widget`. Do not let the editor add
`.txt`.

### Run it

The `README.md` inside the folder has the exact check and run commands.
The four built-in stacks:

| Stack | Check it is installed | Run it (in `my-social-widget`) | Open |
| ----- | --------------------- | ------------------------------ | ---- |
| PHP / Simple HTML | `php -v` (8.x) | `php -S localhost:8080` | http://localhost:8080 |
| Node.js | `node -v` (v18 or higher) | `npm install`, then `npm start` | http://localhost:3000 |
| React | `node -v` (v18 or higher) | `npm install`, then `npm run dev` | http://localhost:5173 |

Any other stack you named: the README gives its own check, install (only if
the framework needs one) and run command.

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

- **The AI asked anything besides theme, customise-or-not and stack before
  writing code** - reply: "Build it now with the defaults in the prompt, and
  ask me for the credentials at the end."
- **It showed a list of theme names instead of the pictures** - reply: "Show
  me the theme picker page itself, rendered - `guides/themes/thumbnails.html`,
  as steps.md says - never a list."
- **It wrote the server code in a different stack than you asked** - reply:
  "Rewrite it for <your stack>, with its README."
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
