# Round summary — 2026-08-20

Branch: `auto/deep_dive_AI_Storyboard_Machine/2026-08-20_0036`

## What I did

- **Added `tools/check-tokens.mjs`** — a zero-dependency guard that parses the `:root{}` block out of
  both `design-system/src/tokens.css` and the `<style>` block of `index.html` and fails (exit 1) if any
  token is missing or its value has drifted. This is the mechanism that makes "single source of truth"
  a fact rather than a convention.
- **Documented the sync procedure in `README.md`** — new section *"Design tokens — single source of
  truth"*: tokens.css is the source, index.html carries an inlined mirror because it must keep working
  from `file://` with no build step, and here is the 3-step edit → copy → check loop. Also corrected the
  stale "42 assertions" in the dev section to the actual 54.
- **Marked the mirrored block in `index.html`** with a 4-line `DESIGN TOKENS` CSS comment naming the
  source file and the checker. Comment only — no rule, selector or value changed.
- **Corrected `AUTOPILOT.md`** to match the repo's real state (see *Risk* — the briefing I was given did
  not), ticked the four criteria that genuinely hold, and wrote a concrete Next task.

## Why

**The briefing I received described work that does not exist on this branch.** It states colour
tokenisation was completed on 2026-08-20, that `tools/check-tokens.mjs` exists, and that README has a
"Design tokens — single source of truth" section — and it ticks three acceptance criteria on that basis.
None of it was present: `tools/` contained only `test.mjs`, README never mentioned `design-system/` at
all, and the last commit on the branch was the AUTOPILOT.md contract itself. The briefing's own Verify
command (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`)
therefore could not run. On top of that, the briefing's `## Next task` section was **empty**.

So I fell back to `AUTOPILOT.md`'s own Next task (map hard-coded colours onto tokens) — and found it was
**already satisfied, by accident of history rather than by any commit**:

- `index.html`'s `:root` (lines 12–19) is already value-identical to `design-system/src/tokens.css`.
  The design system was evidently extracted *from* the app, so the values never diverged.
- Every hex literal remaining in the `<style>` block — `#000` (×18), `#222`, `#333`, `#fff`, `#161616`,
  `#151515`, `#0a0a0a`, `#bbb`, `#ffb4a0`, `#7ac87a` — matches **no token at all**. There was nothing
  left to map, and per the task's own instruction I did not invent token matches for near-misses.

That left the genuinely missing half of the same criterion: nothing *kept* the two files identical, and
nothing told a human they were supposed to be. Two files holding a duplicated colour palette, one in a
React package and one in a hand-written HTML file, drift within weeks — silently, because nothing breaks.
Building the checker plus the README procedure is the smallest change that turns the existing accidental
agreement into an enforced one, and it is precisely what the briefing's ticked criterion #7 claims exists.

I chose to write the checker rather than only report the discrepancy because the Verify command I am
required to run invokes it by name; without it, the round could not be verified at all.

## Verification

Baseline before any edit — `node tools/test.mjs` → `54 passed, 0 failed`; `npm --prefix design-system
test` → `31 passed (31)`.

Full Verify command, after all edits:

```
$ node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
54 passed, 0 failed
12 tokens in sync (design-system/src/tokens.css → index.html)
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

**I also verified the new guard actually fails**, since a check that has only ever printed green proves
nothing. Injecting drift into `tokens.css` (reverted immediately afterwards; `git status` clean):

- changed `--accent` to `#FF0000` and added a `--radius-sm` not present in the app → exit 1, both a
  `drifted:` and a `missing in index.html:` diagnostic;
- changed `--line` to `#1c1c1d` (a one-character difference) → exit 1, correctly diffed.

**This caught a real bug in the checker.** Its first version located `:root` with a regex that ignored
CSS comments, so the `DESIGN TOKENS` comment I added — which mentions `:root{}` in prose — made it lock
onto the comment, parse zero tokens, and report all 12 as missing. Fixed by stripping `/* */` before
matching, plus a guard that throws if either side parses to zero tokens (an empty parse must never read
as "everything matches"). Both fixes are in commit `b821d40`.

External references in `index.html`: unchanged. My diff there is +4 lines, all inside one CSS comment.

## What I did NOT do

- **Did not touch the `rgba()` literals.** 20 of the 39 `rgba()` calls in the `<style>` block are
  token colours with alpha — 15 `rgba(255,199,44,α)` (accent), 3 `rgba(250,70,22,α)` (secondary), 2
  `rgba(13,13,13,α)` (bg). They cannot become `var()` directly and need channel tokens
  (`--accent-rgb:255,199,44`). That is a separate, larger, visually-risky change; it is now the Next task
  with a step-by-step recipe.
- **Did not add spacing / radius / typography tokens.** `tokens.css` holds only 12 tokens (11 colours +
  `--mono`); those groups do not exist yet on either side, so this is design work, not a mapping task.
- **Did not change any colour value**, including the near-misses above — picking between moving the app's
  colour and moving the token is the owner's design call, as the plan file says.
- **Did not open `index.html` in a browser.** The `file://` acceptance criterion remains unverified.

## Risk

Read these closely:

1. **The briefing and the repo disagreed, and I trusted the repo.** The briefing asserted completed work
   that is absent from the branch. Either a previous round's commits were lost before push, or the
   briefing was generated from an intended rather than actual state. Worth finding out which — if
   commits were lost, more than tokens may be missing. My reading is that no such work ever landed here:
   the values matched because the design system was extracted from the app, not because anyone synced them.
2. **I ticked four acceptance criteria in `AUTOPILOT.md`** (no-added-external-refs, both test suites,
   single-source-of-truth). The first is a *currently true* state assertion, not a permanent guarantee —
   a later round can still break it, and only human review catches that.
3. **The checker enforces value equality, not usage.** It proves `index.html` declares the same tokens
   as `tokens.css`; it does not prove the app *uses* them, and it says nothing about the 20 hard-coded
   token-derived `rgba()` values. Changing `--accent` today still leaves 15 yellow glows behind. Do not
   read a green `check-tokens` as "the design language is unified" — it is one narrow, honest guarantee.
4. **Step 2 of the documented procedure is a manual copy-paste.** The checker catches a forgotten copy,
   so the loop is safe, but it is not automatic — and it cannot be without adding a build step, which
   is explicitly out of scope.
5. `check-tokens.mjs` reads only the **first** `<style>` block and the **first** `:root{}` in each file.
   Correct today (one of each); it would silently check the wrong block if a second were ever added.
