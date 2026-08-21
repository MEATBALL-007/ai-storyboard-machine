# SUMMARY — round 2026-08-22_0015

## What I did

- **Restored the previous round's work first.** The branch was cut from `3503537` again
  (the stale base), so `tools/check-tokens.mjs`, the embedded fonts and every token/radius
  change were missing from the tree even though the contract describes them. Restored
  `auto/deep_dive_AI_Storyboard_Machine/2026-08-22_0001` (tip `b6c4ef4`) as its own commit
  `3d0d245` so this round's real diff stays readable.
- **`index.html:558`: `font-weight:300` → `400`.** `.add-card .ac-plus` asked for a weight
  that has no font file behind it — only 400 / 500 / 700 / 800 are embedded.
- **Added a 4th check to `tools/check-tokens.mjs`: every `font-weight` must have an
  `@font-face`.** It scans `index.html`'s `<style>` plus `design-system/src/**/*.css`,
  resolves `normal`→400 and `bold`→700, skips the relative keywords (`bolder`/`lighter`),
  blanks out `@font-face` blocks (they *declare* the inventory rather than draw on it),
  and reports real `index.html` line numbers via the existing `lineOffset` machinery.
- **Documented it in README** under *Typeface*, including why this bug is invisible on
  screen and what to do if you actually want a new weight.
- Updated `AUTOPILOT.md`: recorded the 4th check under the "single source of truth"
  criterion, added the `font-weight` survey to the "already surveyed, don't redo" block,
  and set a new *Next task*.

## Why

The one non-obvious judgement here is **why `300` → `400` is not a design change.** CSS
font matching, for a desired weight below 400, first walks *down* the available weights and
only then walks up. With nothing below 400 installed it lands on 400 — and browsers
synthesize *bolder* faces but never thinner ones. So the rule has been rendering at 400
ever since the fonts were embedded in round 0043. Writing `400` records what already
happens; it does not move a pixel. (Caveat under Risk.)

Two smaller calls:

- **`normal`/`bold` are checked, `bolder`/`lighter` are not.** The first two resolve to
  fixed numbers, so they can be wrong in exactly the same way. The other two are relative
  to the inherited weight and have no fixed answer to check.
- **`fonts.css` is the inventory for both sides.** Check #2 already proves `index.html`
  embeds byte-identical copies of every weight `fonts.css` declares, so one list serves
  both scan targets rather than two lists that could disagree.

## Verification

`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
— all green:

```
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 14 stylesheet(s) scanned, none re-hardcode a tokenised colour
font weights available: 14 stylesheet(s) scanned, every font-weight is one of 400, 500, 700, 800
Test Files  12 passed (12)
     Tests  31 passed (31)
```

A green checker proves nothing on its own, so I ran four negative trials — each one edits a
file, runs the checker, and restores the file:

| trial | expected | got |
|---|---|---|
| put `font-weight:300` back in `index.html` | exit 1 | exit 1 — `index.html:558: "font-weight:300" asks for a weight with no @font-face — design-system/src/fonts.css ships 400, 500, 700, 800` |
| `font-weight:900` in `Button.css` | exit 1 | exit 1 — `design-system/src/components/Button/Button.css:8: …` |
| `font-weight:bold` in `Button.css` | exit 0 (700 exists) | exit 0 |
| `font-weight:lighter` in `Badge.css` | exit 0 (relative) | exit 0 |

Line numbers in both failures are the real ones. `git status` was clean afterwards and the
checker was re-run to confirm the tree came back intact.

## What I did NOT do

- **Did not add a 300-weight font file.** That is the alternative fix if the owner wants a
  genuinely lighter plus sign, and it needs `jetbrains-mono-latin-300-normal.woff2`, which
  cannot be fetched here (no network, no local copy). The contract said to prefer 300→400
  when unsure, and I did.
- **Did not touch `ctx.font` in the canvas code.** `font-weight` appears there too; it is
  JavaScript, it is out of scope, and the checker only ever sees the `<style>` block.
- **Did not touch the untokenised colour literals, chip padding, spacing/font-size, or
  jsPDF.** All four are still blocked on owner decisions listed in `AUTOPILOT.md`.
- **Did not attempt browser verification.** Playwright and Chrome-DevTools MCP were both
  permission-blocked in an earlier round; retrying would waste the round.

## Risk

1. **The 300→400 claim is read off the CSS Fonts spec, not off a rendered page.** Nobody has
   opened this app in a browser across seven rounds of CSS work. The reasoning is sound and
   the fallback is benign — worst case the plus sign was already 400 and stays 400 — but it
   is unverified, like every other visual claim in this project. This is the strongest
   argument for unblocking item 4 in *รอเจ้าของตัดสินใจ*.
2. **The checker only understands the `font-weight` longhand.** I confirmed neither side
   uses the `font:` shorthand today (0 occurrences), and said so in both the code comment
   and the README, but a future `font: 300 12px/1 …` would slip through.
3. **The restore commit `3d0d245` is large and is not this round's work.** Review it as a
   re-application of `b6c4ef4`, not as new code — `git diff b6c4ef4 3d0d245` is empty.
   This is the fifth consecutive round that has had to do this; the runner bug is still
   unfixed and `main` is still at `ef3220e` with none of this merged.
4. **A weight embedded in `index.html` but absent from `fonts.css` is still unchecked.**
   Check #2 only iterates `fonts.css`'s faces, so the reverse direction has no guard. It
   cannot cause a wrong render today (the inventory is derived from `fonts.css` either way),
   so I left it rather than widening this round's scope.
