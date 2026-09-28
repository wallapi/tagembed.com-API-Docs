# Prompt 1 - every step of the social widget build, in order

These are the build steps for a Tagembed social widget, kept in
Tagembed's public API docs repo (github.com/wallapi/tagembed.com-API-Docs,
which also holds the API reference, llms.txt). The person who pasted
this link asked you to take them through these steps.

Everything the build uses is static: small HTML/CSS pages, two short
text files, and finished starter code (PHP, Node.js, React, Simple
HTML) that calls the Tagembed API with the user's own access token from
their .env file. You are welcome to read any file before you show it,
and to point out anything that looks wrong.

Each step is one reply, then stop and wait for my answer. Keep
questions short. The preview is already finished for every theme, and
so is the code for the four stacks, so there is nothing to generate -
besides this file, fetch only what each step names. No plan or recap
is needed; keep each reply to what its step names.

If you can write files in my project (Claude Code, Cursor, Copilot,
Codex, Windsurf, Gemini CLI...), save the files yourself instead of
showing them to me - same content, same paths.

A few things that keep the build accurate:

- The files change often, so fetch each link fresh on each step, even
  in a chat we have used for this build before. An earlier fetch, or a
  version you remember, may be out of date.
- There are 17 themes (14 social, 3 review), and the picker page is
  their only catalogue. If you remember a different catalogue, it is an
  older version.
- Theme question: show the picker page itself, not a table or a list
  of theme names - the pictures are what I choose from.
- Every file this build uses is linked in full in steps 1-4. The stack
  code comes from templates/dist/social-widget-<stack>.txt (never a .md
  file), and the only other files under prompts/library/build/ are
  stack-question.txt and stack-question-again.txt. There is no
  preview.md, server.md, php.md, node.md or other "part 2" file - a link
  that is not given below is not part of this build, so skip it.
- Sample posts must match the theme: social themes (1-14) use the
  social sample posts, review themes (15-17) the review ones.
- If a link will not open, say so and stop. That does not limit which
  stacks you can write for in step 4.

## Step 1 - theme

Fetch this page RAW - it is the theme picker:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/thumbnails.html?v=2026-09-28b
It is a small static page: the heading "Pick a theme" and 17 cards,
each a base64 WebP screenshot of the widget with its number and name
underneath ("1. Classic Card"). It has no scripts, links or forms.

Show it as an HTML artifact (or canvas) with the fetched file as its
whole content, unchanged - it renders as it is. If you work in my
folder instead, save it as theme-picker.html without retyping it and
open it in my browser. If the fetch fails, say it failed.

Please show the page itself - not a table, a list or a description of
it, and not a picker of your own. A rebuilt page (another title,
number badges, "social"/"reviews" tags, look descriptions, image file
names, stock photos) is not the one I pick from.

Then give me this one line, for me to click, not for you to fetch: the
real screenshots, full size, in my own browser -
https://raw.githack.com/wallapi/tagembed.com-API-Docs/main/guides/themes/thumbnails.html
Some fetch tools summarise a page before you see it, so the artifact
may only approximate the real look; this link always shows the exact
file.

End with: "Which theme do you want? Reply with its name or number."
Then stop and wait for my answer.

## Step 2 - the preview (fetch TWO files, write no code)

Each theme's preview is a finished file. Its name (the "slug") is the
theme name in lower case with dashes: 1 classic-card, 2 social-card,
3 modern-card, 4 classic-photo, 5 square-photo, 6 collage, 7 vivid,
8 horizontal-slider, 9 horizontal-columns, 10 slider, 11 reels,
12 story-theme, 13 single-post, 14 widget-theme, 15 review-box,
16 review-carousel, 17 review-list.

Fetch RAW
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/<slug>.html?v=2026-09-28b
and give it back to me as preview.html, exactly as it is - same CSS,
markup, sample posts, image URLs and base64 "data:image" thumbnails.
It is static HTML and CSS (slider themes add a few lines of script for
the arrows), already built from the sample posts, so there is nothing
to redesign, fill or inject. The only other fetch in this step is
stack-question.txt, below.

Show it as an HTML artifact, canvas or preview pane, the same way as
step 1. Then give me this one line, for me to click, not for you to
fetch: the real images load full-size in my own browser -
https://raw.githack.com/wallapi/tagembed.com-API-Docs/main/guides/previews/<slug>.html
- a chat's own preview pane blocks outside photos and video and shows
a coloured tile in their place.

Then fetch RAW
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/stack-question.txt?v=2026-09-28b
and end your reply with its two lines, copied as written there, not
paraphrased.

## Step 3 - customise (fetch ONE file, repeat as often as I ask)

Do not redesign the preview. Every look is set by CSS variables, so a
change is a few lines in a file called custom.css. The variables:
--tbd-bg (page), --tbd-surface (card), --tbd-text, --tbd-author,
--tbd-font, --tbd-weight, --tbd-size (text size), --tbd-radius (card
corners), --tbd-img-radius (image corners), --tbd-gap (space between
cards), --tbd-pad (space inside a card), --tbd-cols (columns, or cards
per view on sliders), --tbd-align, --tbd-lines (text lines shown).
Class names, for anything else: .tbd-card, .tbd-media, .tbd-head,
.tbd-author, .tbd-date, .tbd-net, .tbd-text, .tbd-stars, .tbd-header.

Write custom.css - only what changes, mostly one `:root { ... }` block,
adding to any custom.css from earlier in this chat. Then reply with:
1. preview.html again, so this chat shows the change, if you can show
   one: the step 2 file exactly as it was, with the whole custom.css
   pasted in just before its </style>, under a /* custom.css */
   comment. Change nothing else in the file.
2. custom.css in one short code block, with one line: keep it - it
   goes into the build in step 4.
Then fetch RAW
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/stack-question-again.txt?v=2026-09-28b
and end your reply with its one line, copied as written there. This is
the only fetch in this step; it ends when I name a stack.

## Step 4 - the files for my stack (fetch what this step names, write no new code - except Other)

If this chat can offer a download (ChatGPT, claude.ai, Gemini...) and
I named PHP, Node.js, React or Simple HTML: fetch nothing in this
step - the finished bundle already exists. Reply with only:
- the download link:
  https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/dist/social-widget-<php|nodejs|react|html>.zip
  - finished code, every theme, the sample posts and README.md;
  it holds the same files as social-widget-<stack>.txt in the list
  below, if you want to read them first;
- .env as a code block: ACCESS_TOKEN= (empty),
  API_BASE_URL=https://api.tagembed.com/api, WIDGET_THEME=<slug>;
- custom.css, only if step 3 made one - the final version;
- one line: unzip it, put .env and custom.css in the unzipped folder;
- then everything under "After the files" below, from "how to start
  it" to the token question.
For an Other stack, even in this same chat type: do not refuse and do
not substitute one of the four zips above - port it, the same as
every other AI does below, and deliver it the way the "Delivery"
section further down says a chat like this one delivers (usually one
zip of the ported files, not the pre-built one).

The code for every stack is finished. Fetch RAW these three - nothing
else:
1. My stack's files, all in one text file - each file starts with a
   line "===== FILE: <path> =====":
   - PHP:         https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/dist/social-widget-php.txt?v=2026-09-28b
   - Node.js:     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/dist/social-widget-nodejs.txt?v=2026-09-28b
   - React:       https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/dist/social-widget-react.txt?v=2026-09-28b
   - Simple HTML: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/dist/social-widget-html.txt?v=2026-09-28b
2. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/themes/<slug>.css?v=2026-09-28b
3. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/themes/<slug>.json?v=2026-09-28b

Hand every file over here in the chat, each as its own code block
headed with its path, ready to save - exactly as fetched, character
for character. Do not rewrite, shorten, "improve" or merge any of
them, and write no "rest stays the same". The files, in this order:
- every file from the stack text file - README.md included (it is
  already written: how to run, settings, the look, the cache, fixes) -
  except .env.example and except the sample file I do not need:
  samples/social.json for a social theme, samples/reviews.json for a
  review theme (15-17) - give only that one;
- themes/<slug>.css and themes/<slug>.json (keep the themes/ folder);
- custom.css, only if step 3 made one - the final version, with every
  change from step 3 (the code adds it after the theme, so my changes
  show);
- .env - the .env.example text with WIDGET_THEME=<slug> filled in and
  ACCESS_TOKEN left empty (it shows the sample posts until I add it).

### Other stack (anything not in the four above)

Still fetch only 3 files, then port - fast, no plan, no scaffold. The
closest finished bundle is the reference; copy its logic, markup,
.tbd-* classes and cache as they are, changing only the language:
- PHP frameworks (Laravel, WordPress, CodeIgniter, Symfony...):
  social-widget-php.txt
- Frontend-only (Vue, Angular, Svelte, plain JS...):
  social-widget-react.txt - keep its server.js (it holds the token),
  port only the component
- Everything else (Next.js, Nuxt, Express, Python, Ruby, Go, Java,
  .NET...): social-widget-nodejs.txt
plus themes/<slug>.css and themes/<slug>.json as above, from
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/templates/themes/.

Write only the files that stack needs to run - usually 2-4:
- one server-side file that calls the API with the token and caches
  (a route/controller, or the framework's server route - e.g. a
  Next.js route handler or server component, a Django/Flask view);
- one view/template/component, only if the stack separates them;
- the dependency file, only if the stack has one (package.json,
  requirements.txt, composer.json, go.mod...), with the fewest
  packages;
- themes/ and custom.css exactly as in the list above;
- .env - the reference bundle's .env.example keys (ACCESS_TOKEN empty,
  API_BASE_URL, WIDGET_THEME=<slug>, PORT only if the stack uses one),
  read on the server the stack's usual way (Laravel env()/config,
  Django/Flask python-dotenv, Next.js .env.local, Rails/Go/others a
  dotenv package or the host's settings) - never with a NEXT_PUBLIC_,
  VITE_, REACT_APP_ or other browser prefix. In a project I already
  have, do not replace my .env: give only these lines to add to it.
  One line: add .env to .gitignore;
- README.md: the reference bundle's README (already fetched) adapted
  to this stack - same sections (Files, Run it, Settings, Changing the
  look, How the cache works, If it goes wrong), short, written for
  someone who has never used a terminal. Change only the file names,
  commands and where each file goes; keep its line that the token
  stays on the server.
No samples/ folder and no sample posts for an Other stack: drop
samplePosts() / sw_samples() and the file read. An empty ACCESS_TOKEN
returns no posts (touching neither the API nor the cache) and the page
shows the bundle's .tbd-note line instead: "Set ACCESS_TOKEN in .env
to show your gallery."

For a framework I already have (Laravel, WordPress, Django, Rails...),
give only the files to drop into my project and one line on where each
goes - never a new project, config boilerplate, Docker, CI, tests,
lock files or extra helpers.

The token stays server-side in every port: the browser only ever
calls my own server's route, never api.tagembed.com.

Delivery, so I can download instead of copying code blocks:
- Can write files in my project: save them there (as said at the top).
- Otherwise, if this chat can make a downloadable file (ChatGPT,
  claude.ai, Gemini...): put every file in one
  social-widget-<stack>.zip, keeping the paths, and give me only the
  download link plus one line per file (path - what it does). No code
  blocks - that is slower and I would copy them by hand.
- Only if it cannot make files: each file as its own code block headed
  with its path.

After the files, short:
- one line: save them all in one folder, keeping the paths (themes/,
  samples/, and src/ for React; for Other, where each file goes).
- how to start it, one line:
  - PHP / Simple HTML: `php -S localhost:8080`, open
    http://localhost:8080 - or upload the folder to any PHP host.
  - Node.js: `npm install`, then `npm start`, open http://localhost:3000
  - React: `npm install`, then `npm run dev`, open http://localhost:5173
  - Other: that stack's own one-line start command.
- "README.md has every step, for someone who has never used a terminal."
Then a short "What you can add next" list - 4 to 6 one-line ideas I
could send back as my next request, picked from: a network filter bar,
a "Load more" / next-page link, auto-refresh, a lightbox for images and
videos, shopping tags on posts, dropping the widget into a section of
my existing site, Redis or another cache.

Always add this one line, for every stack: keep ACCESS_TOKEN (and any
other key) only on the server - in .env or the host's environment
settings - never in frontend code, a public folder, a VITE_ /
NEXT_PUBLIC_ / REACT_APP_ variable, or git (put .env in .gitignore);
anywhere the browser can reach, the token is disclosed.

End by asking for my access token - Tagembed dashboard, the gallery's
card, its three-dot menu, "Access Token" - and offer to put it in the
.env for me.

If you cannot open a link, say so in one line - do not build from
memory. Writing my chosen stack's port from the reference bundle is
not building from memory.
