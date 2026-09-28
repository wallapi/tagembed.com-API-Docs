# Step 4 - Simple HTML

Links written BASE/<path> are files in this repo. BASE is the one my prompt gave; if it gave none, BASE is where you got this file: the URL up to and including the branch name, or the local repo folder.

Step 4 writes no code any more: the Simple HTML code is finished, tested and
zipped with all 19 themes, the sample posts and a README:
BASE/templates/dist/social-widget-html.zip
(source: BASE/templates/html/ - built by tools/build-previews.py).

Follow step 4 in BASE/prompts/library/build/steps.md: give me the
link, WIDGET_THEME=<theme slug> for .env, custom.css if step 3 made
one, and the one-line start command.

Later changes to the code (a filter bar, load more, a cache change...)
go into the starter's own files - index.html + posts.php - keeping its markup, the
.tbd-* classes and the theme files as they are.
