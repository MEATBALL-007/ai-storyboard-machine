# Round summary — 2026-08-22 0036

## What I did

- **Restored the previous round's work first.** The branch was cut from `3503537`
  (the round-1 contract) again, so the tree was missing everything from rounds
  `0043` through `0024` — including `tools/check-tokens.mjs`, which the Verify
  command runs. Restored to `2519d97` and committed that separately
  (`1602bf2`) so the real change is reviewable on its own.
- **Closed the `style="…"` gap in `tools/check-tokens.mjs`** — the one task named
  in "Next task". Added a **third scan target** to `scanTargets` instead of touching
  any check's logic, so all four value scans (colour, font-weight, radius, and the
  count they report) gained the coverage at once. Scan targets went 14 → 15.
- **Blanked `<script>` before locating attributes**, which is load-bearing rather
  than tidy (see Why).
- **Updated the two places that documented the gap as open** — the block comment
  above the radius check in `check-tokens.mjs`, and two sections of `README.md`.
- **Set the next task**: check #6, `font-family` must read `var(--mono)`. Surveyed
  it this round so the next round doesn't have to: every stylesheet `font-family`
  already uses the token, so it is a pure regression guard with no CSS to change.

## Why

**A new target, not new logic.** All four existing scans already iterate over
`scanTargets`. Adding a target buys coverage for all of them and leaves five
working checks untouched; teaching each check to find attributes separately would
have been four edits and four chances to break something green.

**Line numbers.** The rest of the file relies on `blankOut` being
*length-preserving* — replace a match with the same number of characters and every
derived string stays index-aligned with the original, so `index.html:616` means
line 616. I extended that one step: start from an all-blank copy of the file and
splice only each attribute's *contents* back at its original offset. Hence
`lineOffset: 0` for this target — the text already carries true file lines.

**Why `<script>` must be cut.** `index.html` generates markup from template
strings, and two of those hold colours that genuinely match tokens — `#111`
(`--surface`) in the shimmer gradient on line 2251, and `#FA4616` (`--secondary`)
in the self-test banner on line 3008. Scanning the whole file would fail the
colour check on JavaScript that is doing nothing wrong (`ctx.fillStyle` cannot
resolve a custom property, so those literals are deliberate). Blanking `<script>`
first is what makes the attribute scan safe. Test D below is the proof.

**Wording.** `"N stylesheet(s) scanned"` became `"N CSS source(s) scanned"` — a
`style=` attribute is CSS, but calling it a stylesheet would be wrong.

## Verification

Full Verify command, clean tree apart from the intended files:

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test

54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
Test Files  12 passed (12)
     Tests  31 passed (31)
```

**Five negative tests**, each by editing `index.html`, running the checker, then
`git checkout -- index.html`. The contract asked for four; the fifth checks for
false positives.

| # | Injected | Result |
|---|---|---|
| A | `style="…; border-radius:3px"` on line 635 | exit 1 — `index.html:635: "border-radius: 3px" hardcodes … --r-md` |
| B | `style="…; background:#FFC72C; border:1px solid rgba(250,70,22,.4)"` on 635 | exit 1 — **two** errors, `--accent` and `--secondary-rgb` |
| C | `style="…; font-weight:300"` on 635 | exit 1 — `asks for a weight with no @font-face — … ships 400, 500, 700, 800` |
| D | all three of the above inside a JS template string on line 2710 (`<script>`) | **exit 0, all five checks pass** — proves `<script>` is cut |
| E | `style="…; border-radius:3px" title="#FFC72C"` + `#FFC72C font-weight:300` as body **text**, line 810 | exit 1 — radius at `index.html:810` only; the `title=` attribute and the body text are ignored |

E is the one worth reading twice: it proves both that the offset is right far from
the other test site, and that only the *inside* of a `style=` attribute is read —
a hex in body text or in another attribute does not trip the colour check.

Final state confirmed with `git status --short`: `index.html` unmodified, so no
test edit leaked into the commit.

## What I did NOT do

- **Did not change a single line of CSS.** The scan came up green on the real
  file, which is the outcome the contract predicted: line 616 (the export button)
  already spells `var(--r-md)`, `var(--accent)` and `font-weight:700`. `color:#000`
  has no token, so it correctly does not fail.
- **Did not touch the remaining untokenised literals** (`#000`, `#0a0a0a`,
  `#7ac87a`, `#ffb4a0`, `rgba(0,0,0,…)`, `rgba(255,255,255,…)`) — no token exists
  for them and inventing one widens the design language, which is the owner's call.
- **Did not handle `style='…'` (single quotes)** — `grep -c "style='"` returns 0,
  and HTML also permits unquoted attribute values. See Risk.
- **Did not start check #6** (`font-family`), even though the survey for it is
  done and it looked quick. One task per round.
- Did not attempt browser verification or jsPDF vendoring — both are recorded as
  blocked in AUTOPILOT.md (permissions / no local copy of jsPDF), not re-tried.

## Risk

- **The scan only understands `style="…"` with double quotes.** Today that covers
  all 24 occurrences, but `style='…'` and unquoted values are legal HTML and would
  slip past silently — the same shape of hole this round just closed. Cheap to
  extend if the owner wants belt-and-braces; I left it narrow because a wider
  regex risks matching across an attribute boundary and producing false failures.
- **`<script>` detection is regex-based.** `/<script[^>]*>[\s\S]*?<\/script>/gi`
  would mis-slice if the string `</script>` ever appeared inside a JS string
  literal. It does not today (`grep` finds exactly one `</script>`, at line 4031),
  and if it ever did, the browser would break before the checker would.
- **HTML comments are not excluded.** A `style="border-radius:3px"` inside
  `<!-- … -->` would be reported. There are none today, and a false *failure* is
  the safe direction for this kind of tool.
- **The checker is only as good as its invocation.** It is in the Verify command
  and in README, but nothing in `design-system`'s `npm test` runs it — a
  contributor who runs only `npm test` gets a green result without it. Unchanged
  by this round, but worth a reviewer's attention.
- The restore commit (`1602bf2`) is large by line count. It is a pure
  `git checkout 2519d97 -- .`, i.e. identical to the previous round's tip; the
  only new work in this round is `8e19ac1` plus the docs commit.
