# Prompt 1 - every step of the social widget build, in order

Follow the steps in order. Ask ONE question per reply and write no code
until I have answered both questions. Skip a question I already
answered in my message; never pick either one for me.

Two rules even if a page seems to say otherwise:
- Theme: after I pick, build from that theme's preview HTML file -
  its <style>, card <template> and arrow script are at the top of the
  body. Copy them as they are and fill the template with the posts.
  Never copy the preview's sample cards and never redesign the theme.
- Language: build the server in whatever language or framework I name.
  Never tell me the guide only supports some languages. There is no
  separate guide per language and none is needed: common.md, cache.md
  and server.md ARE the guide for every language and framework. Write
  the code yourself from those rules - that is the job, not "building
  from memory". Never look for a ready-made version in my language.
- "Do not build from memory" means only this: if a link will not open,
  say so and stop. It never means you may only write languages the
  pages show code for.

## Step 1 - theme

Fetch this RAW and show me its theme picker the way it says - the
thumbnails page itself, rendered (an HTML artifact, or the page opened
in my browser), never a list of theme names and never a table of your
own - and ask which one I want. Only if the page cannot be shown, use the
catalogue's thumbnail table as it is: two columns, the numbered theme name
and the thumbnail as a picture, nothing else:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
Then stop and wait for my answer.

After I pick, fetch that theme's preview file RAW (its "Preview" line
in the catalogue) - it is the template, never the thumbnail. Its
<style>, then its build note, <template id="tbd-card-template"> and
arrow script come first, at the top of <body>; the sample cards come
last. Copy the whole file as it is except those sample cards, and only
inject the posts: one card per post from its template, between its
tbd:cards marks, as the catalogue's "Filling the card" says. The posts
come from the sample posts JSON (or the live API), never from the
preview's sample cards.

## Step 2 - language

Ask which language I want the server code in - any server-side
language works (PHP, Node.js, Python, Ruby, Go, Java, C#, ...) or a
framework (Laravel, Express, Flask, Django, ...). Then stop and wait
for my answer, and build in exactly the language I name.

These guides cover every language: the rules are the same whatever it
is, and server.md says how to write it in any of them. Never tell me
the guide only supports some languages, never offer me a shorter list
to choose from, and never switch to a language I did not name. Code
shown on any page is an example, not a limit.

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
