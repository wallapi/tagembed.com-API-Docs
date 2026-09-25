# Prompt 1 - every step of the social widget build, in order

Follow the steps in order. Ask ONE question per reply and write no code
until I have answered both questions. Skip a question I already
answered in my message; never pick either one for me.

These rules hold even if a page seems to say otherwise:

- Theme: after I pick, build from that theme's preview HTML file -
  its <style>, card <template> and arrow script are at the top of the
  body. Copy them as they are and fill the template with the posts.
  Never copy the preview's sample cards and never redesign the theme.
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

## Step 1 - theme

Fetch this page RAW - it is the theme picker, every theme's name
under its thumbnail, the images embedded so it renders anywhere:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/thumbnails.html
Before writing any other text, try to open it as an HTML artifact (or
canvas), the fetched bytes as its whole content, unchanged - do this
first, not after you have already described or listed what the file
contains. If you work in my folder instead, save it as
theme-picker.html without retyping it and open it in my browser. Do
not fetch the theme catalogue yet - it is for after I pick.

This file exists - never tell me there is no picker file. If the fetch
fails, say it failed. If the artifact tool fails or is unavailable,
your entire reply is one line and nothing else - no table, no theme
names, no per-theme looks, no thumbnail links standing in for the
images: "I can't render an artifact here - which theme do you want, by
name or number?"

Your whole reply is the picker and then one line:
"Which theme do you want? Reply with its name or number." Then stop
and wait for my answer.

After I pick, fetch the theme catalogue RAW:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
and then that theme's preview file RAW (its "Preview" line in the
catalogue) - it is the template, never the thumbnail. Its

<style>, then its build note, <template id="tbd-card-template"> and
arrow script come first, at the top of <body>; the sample cards come
last. Copy the whole file as it is except those sample cards, and only
inject the posts: one card per post from its template, between its
tbd:cards marks, as the catalogue's "Filling the card" says. The posts
come from the sample posts JSON that matches the theme - social for
1-14, reviews for 15-17 - (or the live API), never from the preview's
sample cards.

## Step 2 - language

Ask me exactly this, word for word, with nothing added: "Which
language or framework do you want the server code in?" No options
named in the question itself - not even as examples. Then stop and
wait for my answer, and build in exactly what I name: any
server-side language (PHP, Node.js, Python, Ruby, Go, Java, C#, ...)
or framework (Laravel, Express, Flask, Django, ...) counts the same.

These guides cover every language equally: the rules are the same
whatever it is, and server.md says how to write it in any of them.
I choose with nothing pre-picked and no list to choose from, and
whatever I name is what gets built. Code shown on any page is an
example, not a limit.

My answer starts the build: do not repeat my choices or ask me to
confirm - reply straight away with part 1 of step 3.

## Step 3 - the build, in 2 parts

Deliver ONE part per reply: fetch only that part's link RAW, follow it
exactly and write its files complete - then stop, and end the reply
with one line naming the next part. Do not fetch or write a later part
until I reply "next".

1. preview.html
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/preview.md
2. the runnable server files in my language (or framework), with their README.md in the same reply
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/server.md

If you cannot open a link, say so in one line - do not build from memory.
Writing my chosen language from these rules is not building from memory.
