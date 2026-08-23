# Round 2026-08-24_0102

## What I did

- **Restored the previous round's tip first.** The runner cut this branch from the stale base
  `3503537` for the sixth round running (no `tools/check-tokens.mjs`, no
  `docs/btn-parity-proof.mjs`, `index.html` back at its 191 KB pre-token state). Commit
  `dcd5f38` brings the tree to `607aa5a`, the tip of round `2026-08-24_0048`; `git diff` against
  that revision is empty.
- **Checked `README.md → ## Open decisions` for owner answers: there are none.** All seven are
  still open option-tables ending in "**If you answer:**", and decision 1's expected artefact
  (a `jspdf.umd.min.js` dropped at the repo root) is not there. So criteria 1 / 2 / 3 stay
  blocked and the contract's single named fallback task applies.
- **Made `docs/btn-parity-proof.mjs` report the selectors it cannot read** (commit `ae0cc42`).
  `ruleMatches()` now separates "does not match" from "cannot be decided", `computed()` keeps
  the flag instead of discarding it, and each run ends with a counted
  `⚠ N undecidable rule(s)` list naming each rule, *why* it is unreadable (`combinator >` /
  `structural pseudo :last-child`) and which test elements its subject matches.
- **Warning, not failure — but the PASS line no longer overclaims.** A run with undecidable
  rules prints `PASS — … Except the N undecidable rule(s) listed above, which this PASS says
  nothing about.` The two versions are tracked separately, so a rule present on only one side
  raises `⚠ the two lists DIFFER — this change added or removed a rule the model cannot read.`
- **Corrected the file header and the `ds-disabled-hover` comment**, both of which described
  behaviour the file did not have.

## Why

- **The header's claim was false in two different ways, and the contract only knew about one.**
  It said `>` `+` `~` and structural pseudo-classes were "reported as unsupported, not silently
  ignored". For combinators, `ruleMatches()` did set `unsupported:true` and `computed()` threw
  it away — the failure the contract describes. But a structural pseudo **never set the flag at
  all**: it died inside `compoundMatchesElement()` and came back as a bare `{matched:false}`,
  indistinguishable from an honest non-match. That second path is the one that matters here,
  because `Menu.css:11` is a structural rule, so fixing only the documented half would have
  left the actual blind spot in place.
- **Subject-only reporting was too noisy to be useful, so I evaluate whatever is evaluable.**
  My first version checked only the subject compound (which is what the contract's scope line
  suggests). It reported `.menu-pop button:last-child` against all 17 buttons of the `buttons`
  key — none of which are inside `.menu-pop`. The unsupported part there is only `:last-child`;
  the `.menu-pop` prelude is a plain descendant this model handles fine. So the prelude is now
  checked normally when the selector has no combinator, and skipped (deliberately
  over-reporting) when it does, because that is the case where the relationship itself is
  unmodelled. This is the difference between a warning that gets read and one that gets ignored.
- Warning rather than failing follows the previous round's recommendation: every existing key
  trips `Menu.css:11`, so failing would retire the harness rather than sharpen it.

## Verification

Verify command, all three steps, on the final committed tree:

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens 22/22, fonts 4/4, checks 3-6 clean (15 CSS sources)
npm --prefix design-system test -> Test Files 12 passed (12), Tests 31 passed (31)
```

All five harness keys, compared against the results recorded for them:

```
buttons    2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements, 0 undecidable
segmented  021b966:index.html index.html         -> PASS, 45 pairs /  9 elements, 0 undecidable
toast      bb10dd9:index.html 10e8f39:index.html -> PASS,  5 pairs /  1 element,  0 undecidable
ds-disabled-hover HEAD:…/styles.css …/styles.css -> PASS, 15 pairs /  3 elements, 1 undecidable
                                                    (.pui-menu__item:last-child, identical in
                                                     both versions, subject matches the two
                                                     menu rows)
toast-hit  3d3d5cc:index.html index.html         -> FAIL — 5 declaration(s) differ, unchanged.
                                                    `grep -c "✗ #toast:"` = 0, i.e. #toast has
                                                    no diff at any state and all 5 are
                                                    #toastUndo pointer-events (unset)->auto
```

Every pair/element count is identical to the last round's record. Three negative tests, each
reverted immediately (final `git status` shows only `AUTOPILOT.md`, `SUMMARY.md` and the
committed harness):

1. **A combinator rule must be reported.** Added `.pui-menu > .pui-menu__item{color:red}` to
   `Menu.css`. Reported as `combinator >` against both menu rows; the two lists diverged and
   raised the DIFFER warning. Note what this case demonstrates: the cascade diff *still* said
   `0 declaration(s) differ` for a rule that turns every menu item red. Before this round that
   run printed a clean, unqualified `PASS`.
2. **Removing `:last-child` must lower the count.** Rewrote `Menu.css:11` as
   `.pui-menu__item{border-bottom:none}`. The AFTER list dropped 1 -> 0 and the DIFFER warning
   fired. (The run also went to `FAIL — 10 declaration(s) differ`, correctly: without the
   pseudo the rule really does apply to both rows, which is a change this model *can* see.)
3. **Rules it cannot read but that do not apply must stay silent.** Added
   `.pui-menu > .pui-nothing-here{color:red}` and `.nowhere .pui-menu__item:last-child{color:red}`.
   Count stayed at 1 — the first filtered out by the subject test, the second by the prelude
   test. This is the one that proves the report is not just "every unsupported rule".

## What I did NOT do

- **Did not answer any of the seven open decisions**, and did not touch `Button.css`,
  `Menu.css`, `index.html`, or `tools/`. The only committed source change is
  `docs/btn-parity-proof.mjs`.
- **Did not implement `:last-child` / `>` / `+` / `~` matching.** That needs a real DOM tree,
  which this harness deliberately does not build; the task was to *report* the gap, not close
  it. I have written this into the next task as explicitly out of bounds.
- Did not add the harness to the Verify command — it is a per-round instrument, not a checker.
- Did not tick any acceptance criterion. This round produced no user-visible change.

## Risk

- **The `>` `+` `~` branch is proven only by a synthetic rule I wrote myself.** There is no
  combinator in the design system's CSS today, so negative test 1 is the only evidence that
  path works. For `+` and `~` specifically, the prelude is skipped entirely, so those would be
  reported against any element whose subject matches anywhere in the file — untested against
  real code because no such rule exists to test against.
- **The report is a warning and nothing enforces acting on it.** A future round can read
  `⚠ 1 undecidable rule(s)` and move on. It also does not make the harness *correct* about
  `Menu.css:11` — that rule is still undiffable, and decision 7 touches that file. The warning
  changes what a PASS can be read as claiming; it does not extend what the tool can prove.
- **`nearTotal` counts printed rules, not before+after.** My first version summed both maps and
  printed "1 undecidable rule" in the list but "2" on the PASS line. Fixed and re-verified, but
  it is the kind of number a reviewer should re-derive rather than trust.
- The harness is still not in the Verify command and nothing forces it to track the code — the
  same caveat every round since 0027 has carried.
- **Still no browser** (decision 4 unanswered). Everything above is computed from source and
  the CSS cascade rules, not observed in a renderer.
