# Prompt 1 - every step of the social widget build, in order

Follow the steps in order. Ask ONE question per reply and write no code
until I have answered both questions. Skip a question I already
answered in my message; never pick either one for me.

## Step 1 - theme

Fetch this RAW and show me its theme picker the way it says - the
thumbnails page itself, rendered (an HTML artifact, or the page opened
in my browser), never a list of theme names - and ask which one I want:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/themes/README.md
Then stop and wait for my answer.

After I pick, build from that theme's preview HTML (its "Preview" line
in the catalogue), never from the thumbnail. Take only its structure
and CSS - the posts come from the sample posts JSON, never the preview.

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
