# Prompt 1 - every step of the social widget build, in order

Follow the steps in order. Ask ONE question per reply and write no code
until I have answered both questions. Skip a question I already
answered in my message; never pick either one for me.

## Step 1 - theme

Fetch this RAW and show me its theme picker the way it says - the
thumbnails page itself, rendered (an HTML artifact, or the page opened
in my browser), never a list of theme names and never a table of your
own - and ask which one I want. Only if the page cannot be shown, use the
catalogue's thumbnail table as it is: two columns, the numbered theme name
and the thumbnail as a picture, nothing else:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
Then stop and wait for my answer.

After I pick, that theme's preview file (its "Preview" line in the
catalogue) is the template - never the thumbnail. Copy the whole file
as it is and only inject the posts: one card per post from its
<template id="tbd-card-template">, between its tbd:cards marks, as
the catalogue's "Filling the card" says. The posts come from the
sample posts JSON (or the live API), never from the preview.

## Step 2 - language

Ask which language I want the server code in - any server-side
language works (PHP, Node.js, Python, Ruby, Go, ...). Then stop and
wait for my answer, and build in exactly the language I name.

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
