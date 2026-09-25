# Prompt 1, part 2 of 2 - the runnable server files + README.md, in the language I picked

Fetch both RAW first and follow them - the shared rules and the cache:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/common.md?v=2026-09-24c
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/cache.md?v=2026-09-24c
Already fetched one of these for an earlier part? Do not fetch it again.

Deliver the real project files in the language I picked - whatever it
is: PHP, Node.js, Python, Ruby, Go, Java, C#, or any other - so I can
run it straight away. Never a description of the code, never
a single "server" file in some other language: the files that language
or framework actually runs, with their real names.

- I named only a language (the usual case): write ONE file with that
  language's own extension - app.py for Python, server.js for Node.js,
  index.php for PHP, main.go for Go, and so on -
  holding the API call, the cache, the HTML and the CSS. Use ONLY the
  language's standard library (Python: http.server + urllib; Node.js
  18+: http + the built-in fetch; Go: net/http), so there is nothing to
  install and no dependency file: I run that one file with one command
  (python app.py, node server.js, php -S localhost:8080, go run
  main.go) and the page is up. The file reads a .env beside it on its
  own if one exists - a few lines of code, no package - so the token
  can live there and the run command stays one line. Only if the
  language truly cannot serve a page without a package (Ruby 3 has no
  built-in web server), use the single smallest one and say so.
- I named a framework (Flask, Django, Express, Laravel, Next.js,
  Spring Boot, Rails, ...): write the files that framework needs to
  serve this page, in its normal layout - entry point, route,
  view/template, config and its dependency file - and nothing it does
  not need.

Ready to run means: I run the command from the README and the page is
up - no missing file, no placeholder, no "add your routes here", no
step left for me to fill in. The page it serves is the same theme
preview file as preview.html from part 1, copied as it is; the only
difference is that it fills the card template from body.posts in a
loop on every request (per common.md) instead of from the sample JSON.

Then, in this SAME reply, deliver README.md for exactly what you just
wrote - preview.html and those files, nothing for any other language:
- the files, and which theme the build uses;
- the two settings, ACCESS_TOKEN and API_BASE_URL (always
  https://api.tagembed.com/api), and where to set them (.env, cPanel,
  Vercel/Netlify, Docker);
- how to check the language is installed, and the exact command to
  run it (plus the install command, only if a framework needs one),
  copy-paste ready for macOS/Linux and Windows, written
  for someone who has never used a terminal - with the URL to open -
  and that preview.html just opens by double-click;
- how the cache works and how to change the TTL, including what
  happens when the cache folder is not writable;
- a short list of what to check when it breaks - 401, empty page,
  stale posts.

Then, at the end of this reply, ask me for my access token - my
Tagembed dashboard, the gallery's card, its three-dot menu, "Access
Token" - and offer to put it in a .env for me.
