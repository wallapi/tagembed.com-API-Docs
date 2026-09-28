# Prompt 3a - restyle the widget: the change

Links written BASE/<path> are files in this repo. BASE is the one my prompt gave; if it gave none, BASE is where you got this file: the URL up to and including the branch name, or the local repo folder.

My message names the layout and the style; where it does not, use the
MOSAIC with rounded cards and soft shadows.

Restyle the widget in the layout I named (MOSAIC, REEL rail,
3-column card grid or full-screen signage view) and the style I named
(rounded cards + soft shadows, flat minimal, or editorial with a serif
headline). Layouts are in sections 4-5 of
BASE/guides/widget-design-spec.md
and the REEL rail in full here, only if it is the one I named:
BASE/guides/design/reel-layout.md
Keep the --tbd-* tokens already declared - no new colours, no CSS
framework, CSS stays inside the same file. Every text/surface pair at
WCAG AA, and no dark mode or theme toggle - the build is one skin.
Leave the data layer and caching untouched: CSS and markup only, and
the same change lands in preview.html, index.php and server.js, so the three files stay identical.
