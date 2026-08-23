# Round 2026-08-24_0036

## What I did

- **Restored the previous round's tip first.** The runner cut this branch from `3503537`, which is
  12 rounds stale — the tree had no `tools/check-tokens.mjs`, no `docs/btn-parity-proof.mjs`, no
  `SUMMARY.md`, and an `AUTOPILOT.md` whose "Next task" was the *very first* task of the effort.
  Restored `771ed64` (tip of `auto/…/2026-08-24_0023`) as commit 1. Verified the diff contained no
  deletions (`git diff --name-status --diff-filter=D`) before trusting `git checkout 771ed64 -- .`,
  then confirmed `git diff --stat 771ed64` was empty.
- **Wrote `### 7. Disabled controls that still react to hover — repair or accept?`** into
  `README.md` under `## Open decisions`, in the house format (what is blocked → table of gaps →
  options + cost → "**If you answer:**").
- **Re-verified every claim against the source before writing it, and found two of them wrong.**
  Corrected both in the decision text rather than repeating them (details under *Why*).
- **Found a third defect nobody had recorded**, in the app: `.menu-pop button.danger:hover`
  (`index.html:588`) and `.menu-pop button:disabled:hover` (`:585`) are both `(0,3,1)`, so line 588
  wins on source order. The context menu's Delete item carries `class="danger"` and *is* disabled
  when a panel is locked or the app is read-only — so the app's own guard is defeated by a rule
  three lines below it. Documented as an option; not fixed (it moves visible pixels).
- **Fixed two stale counts** the new decision made wrong: the maintainer banner said "four
  decisions" (there were already six) and the section intro said "Six questions".
- Updated `## Next task` and the criterion-2 notes in `AUTOPILOT.md`.

**No `.css` file and no `index.html` line was touched.** `git status` showed `M README.md` only
before the AUTOPILOT/SUMMARY edits.

## Why

**The headline of the decision is a bug that the file already tried to prevent.**
`Button.css:6` declares `.pui-btn:disabled{… box-shadow:none}` — a deliberate attempt to kill the
primary button's glow while disabled. It does not work. `.pui-btn:disabled` and
`.pui-btn--primary:hover` (line 9) are **both `(0,2,0)`**; the tie falls through to source order and
the rule three lines below wins. A disabled primary button still glows under the cursor. That row
is qualitatively different from the others in the table: there is nothing to guess about intent,
because the file states it. The repair is still a visible change, so it is still the owner's call.

The app contains the same tie *resolved the other way* — `#genBtn:hover` (`:137`) then
`#genBtn:disabled` (`:138`), both `(1,1,0)`, reset last, glow correctly suppressed. Two files, one
tie, opposite outcomes, decided by nothing but line order. I put that in the README because a
working counterexample in the same repo is far more convincing than an argument about the cascade.

**Two claims handed to me by the previous round were wrong.** I checked before writing:

1. Round 0023 recorded that `.pui-btn--icon:hover` (line 15) overrides `color` back to `--accent`
   when disabled. It does not — `.pui-btn--icon:disabled` (line 16) has equal specificity and comes
   *after*, so `color:var(--dim)` wins. What actually leaks is `background:var(--surface)` and
   `border-color:var(--dim)`, which `:disabled` never declares. Corroborated by the app: its fix at
   `index.html:492` resets exactly `background`, `border-color` **and** `color` — i.e. the author
   was addressing the box, not the text colour.
2. Round 0023 recorded that the app "writes a `:disabled:hover` reset everywhere". It guards three
   of five. `#tourBack` (`:558`) sets only `opacity`/`cursor`, but it is a `.btn--ghost` and
   `.btn--ghost:hover` (`:344`) sets `color` + `border-color` that nothing resets — the Back button
   on the first tour step is disabled and still brightens. And the danger-menu case above.

Writing an owner-facing decision from an unverified premise is worse than writing nothing: the
owner would answer a question about a defect that doesn't exist while the real one stayed hidden.

**Why the fallback in the new Next task is the harness, not a CSS fix.** Two rounds in a row
(0023 editing `Toast.css`, and this one) had to fall back to "read the `git diff` yourself" as
evidence, because `docs/btn-parity-proof.mjs` only reads `index.html`. If the owner answers
decision 7 — which edits `Button.css` and `Menu.css` — we hit that wall immediately. Teaching the
harness to read `design-system/src/**/*.css` moves zero pixels, is in `docs/` not `tools/`, and is
not a seventh token checker.

## Verification

Full Verify command, all three stages, run on the final tree:

```
$ node tools/test.mjs
54 passed, 0 failed

$ node tools/check-tokens.mjs
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)

$ npm --prefix design-system test
Test Files  12 passed (12)
     Tests  31 passed (31)
```

The guard the previous round required — proof that nobody touched the app side:

```
$ node docs/btn-parity-proof.mjs toast-hit 3d3d5cc:index.html index.html
markup coverage OK — 0 old class tokens gone, 0 new class attributes at the expected counts
✗ #toastUndo (base) / :hover / :disabled / :disabled:hover / :focus
    pointer-events   before: (unset)   after: auto   <- .toast-act
compared 10 (element, state) pairs across 2 "toast-hit" elements
FAIL — 5 declaration(s) differ, 0 markup problem(s).
```

`FAIL — 5 declaration(s) differ` is **the required result, unchanged**, and `#toast` shows no diff
at any of its five states — which is the evidence that this round did not touch `index.html`.

Claims in the new decision were checked against source, not memory: `Button.css` and `Menu.css`
read in full; `grep -n "disabled" index.html` for every app-side rule (138, 491–492, 558, 573–574,
584–585, 588); `index.html:2196–2212` to confirm `bR`/`bX` are `.pc-tools` children; `:3860–3874`
to confirm the Delete menu item carries `class="danger"` and receives `disabled`.

## What I did NOT do

- **Did not edit `Button.css`, `Menu.css`, or `index.html`.** The task said documentation only, and
  every option in decision 7 changes what a person sees. `AUTOPILOT.md` is explicit that answering
  an open decision is the owner's right, not an agent's.
- **Did not answer any of decisions 1–7**, or fix the two app-side gaps I found.
- **Did not tick any acceptance criterion.** Nothing was unblocked this round — decision 7 *adds* a
  blocker to criterion 2 rather than removing one. Criterion 2 now waits on decisions 2, 5, 6, 7.
- **Did not build the harness extension.** It is queued as the fallback in the next round's task,
  behind "check for an owner answer first".
- Did not touch `tools/`, `storyboard-simulator.html`, or the test markers.

## Risk

- **The Verify command is green, and that proves almost nothing about this round's subject.** No
  checker evaluates `:hover`, and jsdom does no hit-testing. Green here means "I didn't break
  anything else", not "the disabled-hover analysis is right". The analysis rests on reading the CSS
  and applying the cascade rules, plus the `index.html:492` corroboration noted above.
- **The specificity arithmetic is the load-bearing claim and it is hand-computed.** Worth a
  reviewer's own check: `.pui-btn:disabled` = `(0,2,0)`, `.pui-btn--primary:hover` = `(0,2,0)`;
  `.menu-pop button:disabled:hover` = `(0,3,1)`, `.menu-pop button.danger:hover` = `(0,3,1)`. If
  either tie is not a tie, the corresponding paragraph in decision 7 is wrong.
- **I contradicted a previous round's written findings in two places.** If my correction is the
  thing that's wrong, the README now misinforms the owner more confidently than before. Both
  corrections are stated with their reasoning in `AUTOPILOT.md` (criterion 2, items ก/ข) so they
  can be checked without re-deriving them.
- **Still no browser verification** — decision 4 has not been granted. Every claim about what a user
  sees is derived from source and the CSS cascade spec, never observed.
- **The restore commit is large** (`+1959 / −162` across 16 files). It is a pure tree restore of
  `771ed64`, verified byte-identical, but a reviewer diffing this branch against `main` will see 12
  rounds of accumulated work as if it were one commit.
