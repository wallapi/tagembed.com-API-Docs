# Prompt 1 - every step of the social widget build, in order

Every link in this file is a complete URL - fetch it exactly as
written, character for character.

Follow the steps in order. Ask ONE question per reply and write no code
until I have answered both questions. Skip a question I already
answered in my message; never pick either one for me.

These rules hold even if a page seems to say otherwise:
- Theme: after I pick, build from that theme's preview HTML file -
  its <style>, card <template> and arrow script are at the top of the
  body. Copy them as they are and fill the template with the posts.
  Never copy the preview's sample cards and never redesign the theme.
  The preview file's <style> is the only source for the design - never
  approximate it from the design spec's Values table, the thumbnail or
  memory. If the preview file will not open, say so and stop instead.
- Theme question: your whole answer is the picker page
  thumbnails.html you fetched in step 1, rendered exactly as it is -
  the page itself, images and all - then one line asking which theme.
  The rendered page is the only description of the themes you ever
  give me; you write nothing else about them.
- Sample posts: they must match the theme I pick. A social theme
  (1-14) uses ONLY the social sample posts; a review theme (15-17)
  uses ONLY the review sample posts. Never mix the two files.
- Language: PHP or Node.js hand over the already-built files named in
  step 3 part 2 below - never written from scratch, never described as
  unsupported. Any other language or framework I name: build it from
  common.md, cache.md and server.md, which cover every language - write
  the code yourself from those rules, that is the job, not "building
  from memory". Never look for a ready-made version in my language
  besides the PHP/Node.js files named in step 3.
- "Do not build from memory" means only this: if a link will not open,
  say so and stop. It never means you may only write languages the
  pages show code for.
- File names: for every language except PHP and Node.js, the part 2
  file is named exactly `server.md` - there is no `nodejs.md`,
  `php.md`, `python.md` or any other per-language file for those. If a
  link built from the language I named 404s, you invented that name -
  re-read part 2's link above, character for character, and fetch
  `server.md` instead. PHP and Node.js use the real file names in
  step 3 part 2 (`index.php`, `server.js`), not `server.md`.
- No narration: each reply in this flow is the deliverable itself (the
  picker, the question, or a part's files) plus the one line the step
  names - never a plan, a recap, or "here is what I built/changed".
- Speed: whenever a step names more than one link, fetch them all at
  once - in parallel, the same turn - never one, then wait for it,
  then the next. Only wait between steps for my answer, never between
  two fetches inside the same step.

## Step 1 - theme

Fetch these two RAW, together, in parallel, in this one turn - never
fetch only the first and treat its text as enough, and never wait to
read the first before starting the second:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md?v=2026-09-25b
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/thumbnails.html?v=2026-09-25b

The first is the theme catalogue; its "Agents: ask first" section
says exactly how to show the second - the picker file you just
fetched - (as an artifact, opened in my folder, or neither) and what
to do if either fetch fails. Follow it exactly - do not describe the
themes yourself, shorten its instructions, or build your own picker
page from the catalogue's per-theme text instead of using the
thumbnails.html you already have in hand.

Your whole reply is what that section says (the picker or the
fallback line), then the question. Then stop and wait for my answer.

If you are ChatGPT or Gemini: skip the artifact path in that
section entirely - you cannot reproduce a base64-heavy file whole in
this chat, and a broken copy looks done when it is not. Instead reply
with only this table, then the question:

| # | Theme | Type |
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
| 15 | Review Box | review |
| 16 | Review Carousel | review |
| 17 | Review List | review |

After I pick, fetch that theme's preview file RAW: its complete URL
is the "Preview" line under that theme in the catalogue you already
fetched above - copy it exactly, and do not fetch the catalogue
again. The preview file is the template, never the thumbnail. Its
<style>, then its build note, <template id="tbd-card-template"> and
arrow script come first, at the top of <body>; the sample cards come
last. Copy the whole file as it is except those sample cards, and only
inject the posts: one card per post from its template, between its
tbd:cards marks, as the catalogue's "Filling the card" says. The posts
come from the sample posts JSON that matches the theme - social for
1-14, reviews for 15-17 - (or the live API), never from the preview's
sample cards.

## Step 2 - language

Ask me this exact question, word for word - never shorten it into an
either/or between two languages, never pick any two to name in the
question itself:
"Which language or framework do you want the server code in? Any one
you name - your call." Then stop and wait for my answer, and build in
exactly the language I name.

These guides cover every language: the rules are the same whatever it
is, and server.md says how to write it in any of them. Never tell me
the guide only supports some languages, never offer me a shorter list
to choose from, and never switch to a language I did not name. Any
example code shown on any page illustrates the rules for you alone -
it is never a menu for me, so never repeat an example's language back
to me as if it were one of my choices, and never turn my open question
into a pick between two of them.

If I name PHP or Node.js, part 2 of step 3 below fetches already-built,
tested files instead of server.md - faster, nothing to write. Every
other language still follows server.md, exactly as always.

My answer starts the build: do not repeat my choices or ask me to
confirm - reply straight away with part 1 of step 3.

## Step 3 - the build, in 2 parts

Deliver ONE part per reply: fetch every link that part needs together,
in parallel, follow them exactly and write its files complete - then
stop, and end the reply with one line naming the next part. Do not
fetch or write a later part until I reply "next".

1. preview.html - fetch these two together, in parallel (skip common.md
   if you already fetched it earlier in this build):
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/common.md?v=2026-09-25b
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/preview.md?v=2026-09-25b
   If you are ChatGPT or Gemini: fetch nothing in this part and skip
   preview.html - you cannot reproduce the theme's sample-post images
   whole in this chat. Say so in one line and move straight to part 2.
2. the runnable server files in my language (or framework), with their
   README.md in the same reply:
   - PHP or Node.js: skip cache.md and server.md. Fetch all of this
     in parallel, in one turn:
     a. the three files for my language -
        PHP:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/templates/php/index.php
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/templates/php/README.md
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/templates/php/.env.example
        Node.js:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/templates/nodejs/server.js
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/templates/nodejs/README.md
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/templates/nodejs/.env.example
     b. the three URLs on the "Server files" line under the theme I
        picked, in the catalogue you fetched in step 1 - copy them
        exactly.
     c. the one sample file matching that theme - social (1-14) or
        review (15-17):
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/sample-posts-social.json
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/sample-posts-reviews.json
     Hand every file over unchanged (do not rewrite them), except one
     line: in .env.example set WIDGET_THEME= to the slug of the theme I
     picked (the name in the "Server files" URLs, e.g. social-card).
     The code reads these exact paths, next to index.php / server.js,
     so name each "### FILE:" header with its folder:
     themes/<slug>.css, themes/<slug>.template.html, themes/<slug>.json,
     and samples/sample-posts-social.json or
     samples/sample-posts-reviews.json.
   - Every other language: fetch these two together, in parallel
     (common.md too, only if you have not fetched it yet):
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/cache.md?v=2026-09-25b
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/server.md?v=2026-09-25b

Between part 1 and part 2, if I ask to change colours, font, radius,
spacing, columns or line clamp instead of saying "next": do not
rewrite the file. Write a small custom.css with only the changed
tokens from the theme's own :root block (--tbd-bg, --tbd-surface,
--tbd-text, --tbd-author, --tbd-font, --tbd-weight, --tbd-size,
--tbd-radius, --tbd-img-radius, --tbd-gap, --tbd-pad, --tbd-cols,
--tbd-align, --tbd-lines - only the ones the theme I picked actually
sets), then give me preview.html again with that custom.css pasted
into its <style>, right before </style>, under a /* custom.css */
comment - nothing else in the file changes. Keep doing this each time
I ask for another tweak. Once I say "next": for PHP or Node.js, hand
over that same custom.css as its own file, saved next to index.php or
server.js - both already read it on their own, nothing to paste. Every
other language gets the custom.css pasted into the server file the
same way as preview.html, so both stay identical.

If you cannot open a link, say so in one line - do not build from memory.
Writing my chosen language from these rules is not building from memory.
