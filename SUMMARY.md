# Round 2026-08-22_0048 — `font-family` must read `var(--mono)` (check #6)

## What I did

- **Restored the previous round's tip first.** The branch was cut from `3503537` again, not
  from `529253a` (round 0036). `git checkout 529253a -- .` in its own commit (`8377f60`), so
  this round's real diff stays readable. `git diff --stat 529253a` was empty afterwards.
- **Added check #6 to `tools/check-tokens.mjs`:** every `font-family` declaration across the
  existing 15 scan targets must read `var(--mono)` exactly. `--mono` was the last of the 22
  tokens in `tokens.css` with nothing enforcing it (11 colours, 3 channels and 7 radii were
  already guarded). **No CSS changed** — all 17 in-scope declarations already read the token.
- **Rejected fallback lists too:** `var(--mono), monospace` fails, not just a bare family name.
  The fallbacks belong inside the token, where every consumer inherits them at once.
- **Documented it in `README.md`** under *Typeface*, next to the `font-weight` inventory check.
- **Updated `AUTOPILOT.md`:** the `⚠️ --mono has no checker` note became a ✅ record of check #6,
  and `## Next task` now points at a documentation round.

## Why

Two non-obvious choices:

**`@font-face` blocks are blanked before scanning.** Eight declarations name `'JetBrains Mono'`
literally — 4 in `fonts.css`, 4 in `index.html`'s embedded faces — and they are the *declaration*
of the family, not a use of it. This is the same declarer-vs-consumer split the `font-weight`
check already makes, so it reuses the same `blankOut(text, /@font-face\s*\{[^}]*\}/g)` idiom.
Skipping this would have failed the clean tree with 8 errors.

**Exact match, no fallback list allowed.** This is stricter than it needs to be for correctness
today, and that is the point: `font-family:'JetBrains Mono', ui-monospace, monospace` renders
identically to `var(--mono)` right now, so nothing on screen would ever surface it. The day the
owner swaps the typeface, that one rule keeps the old face and shows up as a single odd-looking
element rather than an obvious global break — which is the failure mode this whole script exists
to prevent.

**`font:` shorthand is deliberately not supported.** The only `font:` in the project is at
`index.html:3008`, inside a JS template string, which `scanTargets` never sees. Supporting the
shorthand would mean parsing its grammar for zero current benefit; the blind spot is written
into the code comment and the README instead, the same way the `font-weight` check records its.

## Verification

`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test` — all green:

```
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

A check that only ever prints "pass" proves nothing, so the failure path was exercised on real
edits, each reverted with `git checkout --` afterwards:

| Injected | Result |
|---|---|
| `font-family:'JetBrains Mono', ui-monospace, monospace` in `index.html`'s `<style>` | exit 1, `FAIL index.html:522` |
| `font-family:monospace` in `Badge.css` | exit 1, `FAIL design-system/src/components/Badge/Badge.css:3` |
| `style="…font-family:'JetBrains Mono'"` on `#sceneChips` | exit 1, `FAIL index.html:635` |
| `--font-family:'Nope'` on that same `Badge.css` line | **not flagged** — exactly 2 errors reported, so the `(?<![-\w])` lookbehind holds |
| `font-family:'JetBrains Mono'` inside a `<script>` template string (`index.html:3008`) | **passes** — confirms `scanTargets` really never sees JS |

The clean run is itself the fifth negative test the plan asked for: the 8 `@font-face`
declarations pass, which they could not do if the blanking were missing.

All reported line numbers are real file lines, matching the `lineOffset` convention of the
other checks. Exit code confirmed non-zero on failure.

## What I did NOT do

- **Changed no CSS.** This round is a regression guard, exactly as planned — `git diff 529253a`
  touches only `tools/check-tokens.mjs`, `README.md`, `AUTOPILOT.md`, `SUMMARY.md`.
- **Did not touch `ctx.font`** in the canvas code (lines 1616, 1674, 1722, 3134, 3491–3502) or
  the `font:` shorthand at 3008. All are JavaScript and out of scope by construction.
- **Did not answer any of the four owner decisions** (jsPDF vendoring, chip `padding`, spacing /
  font-size scale, browser-verification permissions). Each moves pixels or adds a file to the
  repo. Still blocked on the owner; that is what next round's task is about surfacing.
- **Did not verify in a real browser.** Playwright and Chrome-DevTools MCP are permission-blocked
  in this environment — confirmed in an earlier round, not re-attempted.

## Risk

- **Low, and confined to tooling.** No shipped file changed, so nothing a user sees can have
  moved. Worst realistic case is a future false positive: a legitimate `font-family:inherit`
  would now fail. That is intentional (the token already covers the whole document, so `inherit`
  buys nothing), but a reviewer who disagrees should say so — it is a one-line relaxation.
- **The strict "no fallback list" rule is a judgement call.** If the owner ever wants a
  per-component fallback that differs from `--mono`'s, this check blocks it and would need
  loosening. I read that as the intended trade: one typeface, one place.
- **The `font:` shorthand blind spot is real but currently empty.** Nothing in either stylesheet
  uses it; if someone writes `font:12px/1.4 'Some Face'` in CSS later, both this check and the
  `font-weight` check will miss it. Documented in the code and the README rather than guessed at.
- **Branch-base bug is still not fixed upstream.** This is the sixth consecutive round that had
  to restore the previous tip by hand. 30+ `auto/*` branches now stack in parallel and nothing
  has merged to `main`. That is a runner problem, not a repo problem, but it grows every round.
