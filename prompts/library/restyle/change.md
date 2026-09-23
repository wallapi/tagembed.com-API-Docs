# Prompt 3a - restyle the widget: the change

My message names the layout and the style; where it does not, use the
MOSAIC with rounded cards and soft shadows.

Restyle the widget in the layout I named (MOSAIC, REEL rail,
3-column card grid or full-screen signage view) and the style I named
(rounded cards + soft shadows, flat minimal, or editorial with a serif
headline). Layouts are in sections 4-5 of
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/widget-design-spec.md
and the REEL rail in full here, only if it is the one I named:
https://raw.githubusercontent.com/wallapi/tagembed.com-API-Docs/main/guides/design/reel-layout.md
Keep the --tbd-* tokens already declared - no new colours, no CSS
framework, CSS stays inside the same file. Every text/surface pair at
WCAG AA, and no dark mode or theme toggle - the build is one skin.
Leave the data layer and caching untouched: CSS and markup only, and
the same change lands in preview.html and in the server file I have
(index.php or server.js - both, if I built both), so they stay identical.
