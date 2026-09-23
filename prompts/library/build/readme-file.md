# Prompt 1, part 3 of 3 - README.md

Fetch both RAW first - the README documents what they describe:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/common.md
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/prompts/library/build/cache.md
Already fetched one of these for an earlier part? Do not fetch it again.

Deliver README.md, covering preview.html and the stack I picked -
index.php, or server.js + package.json - from parts 1-2. Document
only that stack, never the one I did not pick:
- the files, and which theme the build uses;
- the two settings, ACCESS_TOKEN and API_BASE_URL (always
  https://api.tagembed.com/api), and where to set them (.env, cPanel,
  Vercel/Netlify, Docker);
- how to run it, written for someone who has never used a terminal -
  and that preview.html just opens by double-click;
- how the cache works, including what happens when the cache folder
  is not writable;
- a short list of what to check when it breaks.

Then, at the end of this reply, ask me for my access token - my
Tagembed dashboard, the gallery's card, its three-dot menu, "Access
Token" - and offer to put it in a .env for me.
