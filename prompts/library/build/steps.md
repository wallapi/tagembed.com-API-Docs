# Prompt 1 - every step of the social widget build, in order

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
  guides/themes/thumbnails.html shown as it is, then one line asking
  which theme. Never a table or a list of themes - no name, type, look,
  layout, description or thumbnail-link columns.
- Sample posts: they must match the theme I pick. A social theme
  (1-14) uses ONLY the social sample posts; a review theme (15-17)
  uses ONLY the review sample posts. Never mix the two files.
- Language: Build the server in whatever language or framework I name -
  writing it from the guide's rules is the job.
  Never tell me the guide only supports some languages. There is no
  separate guide per language and none is needed: common.md, cache.md
  and server.md ARE the guide for every language and framework. Write
  the code yourself from those rules - that is the job, not "building
  from memory". Never look for a ready-made version in my language.
- "Do not build from memory" means only this: if a link will not open,
  say so and stop. It never means you may only write languages the
  pages show code for.
- File names: the part 2 file is named exactly `server.md`, for every
  language and framework - there is no `nodejs.md`, `php.md`,
  `python.md` or any other per-language file, here or anywhere else in
  this guide. If a link built from the language I named 404s, you
  invented that name - re-read part 2's link above, character for
  character, and fetch `server.md` instead.
- No narration: each reply in this flow is the deliverable itself (the
  picker, the question, or a part's files) plus the one line the step
  names - never a plan, a recap, or "here is what I built/changed".
- Speed: whenever a step names more than one link, fetch them all at
  once - in parallel, the same turn - never one, then wait for it,
  then the next. Only wait between steps for my answer, never between
  two fetches inside the same step.

## Step 1 - theme

Fetch this page RAW - it is the theme picker, every theme's name
under its thumbnail, the images embedded so it renders anywhere:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/thumbnails.html?v=2026-09-24c
Show it to me exactly as it is: as an HTML artifact (or canvas) if you
can make one; if you work in my folder, save it as theme-picker.html
without retyping it and open it in my browser. Do not fetch the theme
catalogue yet - it is for after I pick.

The file is about 45 KB, almost all of it the 19 thumbnails as base64
WebP images - that is what makes it render inside an artifact, where
outside image links are blocked. So the artifact's code is the whole
fetched file, character for character, every base64 string complete:
never shorten, trim or re-encode an image, never swap one for a link
or a placeholder, never turn the page into markdown, a table or a
description of it. A long answer here is expected.

This file exists - never tell me there is no picker file. If the fetch
fails, say it failed. If you can neither show it as an artifact nor
open it in my browser, say so in one line and ask me which theme I want
by name - never show a table or a list of themes instead.

Your whole reply is the picker and then one line:
"Which theme do you want? Reply with its name or number." Then stop
and wait for my answer.

After I pick, fetch the theme catalogue RAW and that theme's preview
file RAW together, in parallel - not one after the other:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md?v=2026-09-24c
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/previews/<slug>.html?v=2026-09-24c
<slug> is the theme name lower-cased with dashes (Modern Card ->
modern-card.html); the catalogue's own "Preview" line is the authority
if that guess is ever wrong - refetch with the right name then. The
preview file is the template, never the thumbnail. Its
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
to choose from, never turn the question into "X or Y", and never
switch to a language I did not name. Code shown on any page (including
PHP and Node.js examples elsewhere in this guide) is an example for
you, never a menu for me - do not repeat those names back to me as if
they were the choices.

My answer starts the build: do not repeat my choices or ask me to
confirm - reply straight away with part 1 of step 3.

## Step 3 - the build, in 2 parts

Deliver ONE part per reply: fetch every link that part needs together,
in parallel, follow them exactly and write its files complete - then
stop, and end the reply with one line naming the next part. Do not
fetch or write a later part until I reply "next".

1. preview.html - fetch these two together, in parallel (skip common.md
   if you already fetched it earlier in this build):
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/common.md?v=2026-09-24c
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/preview.md?v=2026-09-24c
2. the runnable server files in my language (or framework), with their
   README.md in the same reply - fetch these two together, in parallel
   (common.md too, only if you have not fetched it yet):
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/cache.md?v=2026-09-24c
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/server.md?v=2026-09-24c

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
I ask for another tweak. Once I say "next", part 2's server file gets
the same custom.css pasted the same way, so both files stay identical.

If you cannot open a link, say so in one line - do not build from memory.
Writing my chosen language from these rules is not building from memory.
