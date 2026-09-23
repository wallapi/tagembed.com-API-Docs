# Fallback palette — only when the themes cannot be read

Part of [widget-design-spec.md](../widget-design-spec.md), section 2. Use it
only when the theme catalogue (guides/themes/README.md) cannot be fetched at all.

If the network is blocked and you genuinely cannot fetch the catalogue, say so
in one line and use these instead. Never mix them with a theme's values — a
build is skinned by one or the other, not both.

```css
/* Brand */
--tbd-indigo:    #283da8;  /* headings, active states             */
--tbd-blue:      #4462e8;  /* links, primary accents              */
--tbd-blue-ink:  #3350d6;  /* link hover — darker, stays readable */
--tbd-blue-lite: #8ea2fb;  /* gradients and fills ONLY, never text*/
--tbd-brand:     #526ff9;  /* the product CTA blue — fills and buttons,
                              never body text: 4.2:1 on white            */

/* Light theme */
--tbd-ink:       #09090b;  /* author names, headings              */
--tbd-body:      #3f3f46;  /* post text — softer than ink         */
--tbd-muted:     #6b6478;  /* handles, network, dates             */
--tbd-surface:   #ffffff;  /* card                                */
--tbd-bg:        #f7f7f9;  /* widget background behind the cards  */
--tbd-line:      rgba(9,9,11,.09);    /* hairline card border     */

/* Shape, depth, motion */
--tbd-radius:    14px;     /* cards; 8px for chips and buttons    */
--tbd-shadow:    0 1px 2px rgba(9,9,11,.05),
                 0 4px 12px rgba(9,9,11,.05);
--tbd-shadow-up: 0 2px 4px rgba(9,9,11,.06),
                 0 12px 28px rgba(9,9,11,.10);  /* card hover     */
--tbd-ring:      0 0 0 3px rgba(68,98,232,.35); /* focus ring    */
--tbd-ease:      150ms cubic-bezier(.2,0,.2,1);

/* Type and rhythm */
--tbd-font:      Inter, -apple-system, "Segoe UI", Roboto,
                 Helvetica, Arial, sans-serif;
--tbd-text:      15px/1.55;   /* post text                        */
--tbd-meta:      13px/1.4;    /* handle, network, date            */
--tbd-gap:       20px;        /* grid gutter and card padding     */
```

A gradient, where one is wanted:
`linear-gradient(135deg, var(--tbd-indigo), var(--tbd-blue))`.

Every text/surface pair above is at or beyond WCAG AA. Measured on white:
`--tbd-indigo` 9.0:1, `--tbd-blue` 5.1:1, `--tbd-blue-ink` 6.4:1, the muted
tone 5.6:1. Two consequences worth keeping: `--tbd-blue-lite` and `--tbd-brand`
are fills, never text, and a lighter grey must not be substituted for the muted
tone — that is the usual way this palette gets broken, and dates and handles
are the first things to become unreadable.

`--tbd-brand` is Tagembed's product CTA blue (`#526ff9`, the same value the
app uses); the other four are derived from it to clear AA as text, which
`#526ff9` itself does not at body size.
