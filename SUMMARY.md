# Round 2026-08-22_0001 — channel tokens in design-system component CSS

## What I did

- **Restored the previous round's work first.** The runner cut this branch from `3503537`
  again, not from the previous tip `c7cfd80`, so the tree was missing `tools/check-tokens.mjs`,
  the token/radius mapping and the embedded fonts that `AUTOPILOT.md` describes as done.
  Restored verbatim as its own commit (`59a8732`) so this round's real diff stays readable.
- **Replaced the last three token-derived colour literals in the design system**
  (`Button.css:9`, `Badge.css:7`, `Badge.css:8`) with the channel tokens `--accent-rgb` /
  `--secondary-rgb`. Rendered colour is identical; nothing moves.
- **Extended `tools/check-tokens.mjs` with a third check** that scans every stylesheet under
  `design-system/src` plus the `<style>` block of `index.html`, and fails on any `rgb()`/`rgba()`
  triple or hex matching a token's value, naming the token that should have been used.
- **Fixed a real defect in that new check before committing it:** it numbered `index.html`
  findings from the start of the `<style>` block, so a literal at file line 65 was reported as
  line 58. In a 3,756-line file that is worse than printing no line number.
- Documented the new check in `README.md` and updated `AUTOPILOT.md`.

## Why

The app moved to `rgba(var(--accent-rgb),α)` in an earlier round but the library never
followed. That is the "single source of truth" goal inverted: re-tinting `--accent` would have
moved the app and stranded the component library on the old yellow. Three lines, no pixels
moved — but the guard is the part that matters, because this is the second time this class of
drift had to be cleaned up by hand.

`tokens.css` and `index.html`'s `:root{}` are exempt from the scan. They *are* the palette
declaration, and the two checks above already prove they agree — flagging them would have made
the check unusable and invited someone to delete it.

## Verification

Ran the Verify command in full:

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```

```
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 14 stylesheet(s) scanned, none re-hardcode a tokenised colour
Test Files  12 passed (12)
     Tests  31 passed (31)
```

**A guard that cannot fail is worthless, so I proved this one fails.** Three negative tests,
each reverted afterwards:

| reintroduced | result |
|---|---|
| `rgba(250,70,22,.18)` in `Badge.css` | exit 1 — `Badge.css:7 … --secondary-rgb` |
| `#FFC72C` in `Chip.css` (replacing `var(--accent)`) | exit 1 — `Chip.css:7 … --accent` |
| `rgba(255,199,44,` in `index.html` `<style>` | exit 1 — `index.html:65 … --accent-rgb` |

The third is what exposed the off-by-seven line number; after the fix it reports `index.html:65`,
which is the true file line. The `:root{}` exemption is proven by the green run — the block
declares `--accent:#FFC72C`, and the scan does not flag it.

## What I did NOT do

- **Did not touch the remaining literals** — `rgba(0,0,0,…)`, `rgba(255,255,255,…)`, `#000`,
  `#0a0a0a`, `#7ac87a`, `#ffb4a0`, `rgba(120,200,120,.15)`. None has a matching token; inventing
  one would widen the design language, which is the owner's call.
- **Did not tokenize spacing or font-size.** A previous round surveyed these and correctly
  concluded they are a continuum (0.5px font-size steps, near-every padding value 1–12px), not a
  scale. Snapping them moves pixels and needs owner approval — it is item 3 in the blocked list.
- **Did not fix the `font-weight:300` I found** at `index.html:558`. It is real (only 400/500/
  700/800 are embedded) but it is a separate task, so I made it the next one instead of quietly
  widening this round's scope.
- Did not open a browser. Playwright and Chrome-DevTools MCP are permission-blocked here, which
  a previous round already established — I did not spend the round retrying them.

## Risk

- **The scan is textual, so it cannot see literals built by string concatenation** or set from
  JavaScript. It only proves that no *stylesheet* re-hardcodes a token colour.
- **I widened the scan past what the task specified.** The task said
  `design-system/src/components/**/*.css`; I scan all of `design-system/src` except `tokens.css`,
  which additionally covers `styles.css` and `fonts.css`. I verified both are clean, so this is
  green today, but it is slightly more than was asked for.
- **The `:root{ … }` exemption uses `/:root\s*\{[^}]*\}/`, which stops at the first `}`.** That is
  correct for this repo's flat declaration block, but it would silently under-strip if someone
  ever nested a rule inside `:root`. It would then report a false positive, not miss a real one —
  the safe direction to fail.
- **The three colour changes are verified by reasoning and by the checker, not by eye.** They are
  textual substitutions of identical values, and the DS test suite passes, but no one has looked
  at the rendered result — as with every CSS round on this project so far.
- **The `font-weight:300` claim in the next task is spec-reading, not observation.** I state in
  `AUTOPILOT.md` that it currently renders as 400; that follows from the CSS font-matching
  algorithm and the fact that browsers do not synthesize lighter weights, but it has not been
  seen in a browser. The next round should treat it as a claim to check, not a fact.
