# Round `auto/deep_dive_AI_Storyboard_Machine/2026-08-25_0025`

**Outcome: no-op round — checked every channel an owner answer could arrive through, found none,
verified the tree is unchanged, ended. Fifth such round in a row.**

## What I did

- **Restored the previous round's tip.** The runner cut this branch from `3503537` again, so
  the working tree arrived without `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs`, or any
  of the token/radius/parity work. Restored `auto/…/2026-08-25_0018` as its own commit
  (`36d2c86`) so this round's real diff stays readable.
- **Checked all five owner-answer channels. All five are dry:**
  1. `README.md → ## Open decisions` — headings `### 1.`–`### 7.` all present, `If you answer:`
     count is still 7 (one per decision, none consumed). No answer text anywhere.
  2. No file matching `jspdf*` at the repo root (decision 1's artefact).
  3. `main` still `ef3220e` ("Add README") — has not moved.
  4. `git status --untracked-files=all` — empty.
  5. Non-`auto/*` refs — newest is `design-system`/`origin/design-system` at **2026-08-13**,
     older than every round of this work. Nothing hidden on a sibling branch.
- **Ran the full Verify plus all five harness keys** and confirmed every recorded number is
  unchanged (below).
- **Updated `AUTOPILOT.md`** — status line now names round `0025`, and I recorded two tool
  constraints this round hit so the next round doesn't spend calls rediscovering them.

## Why

The queued Next task said, in its own words: check the decisions first; if none is answered,
write SUMMARY.md and end the round, and **do not invent a substitute task**. That instruction
exists because the fallback work really is exhausted — token tooling is 22/22 across six checks,
the element-parity table is closed at 11/11 components, and the harness now reports its own
undecidable selectors. The three remaining acceptance criteria are gated on decisions 1, 2/5/6
and 4, every one of which moves pixels or adds a file, and so is the owner's call.

I deliberately did not treat "nothing to do" as licence to pick up the explicitly-forbidden
list (implementing `:last-child`/combinator matching, adding the harness to Verify, or applying
decisions 2/5/6/7 unilaterally). Those were forbidden precisely because an idle round is
tempted by them.

## Verification

Full Verify command, all three stages green:

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens 22/22, fonts 4/4,
                                   checks 3-6 clean across 15 CSS sources
npm --prefix design-system test -> Test Files 12 passed (12), Tests 31 passed (31)
```

All five harness keys, against the same before/after pairs the previous round recorded — every
count identical:

```
buttons    2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements
segmented  021b966:index.html index.html         -> PASS, 45 pairs /  9 elements
toast      bb10dd9:index.html 10e8f39:index.html -> PASS,  5 pairs /  1 element
ds-disabled-hover HEAD:design-system/src/styles.css design-system/src/styles.css
                                                 -> PASS, 15 pairs /  3 elements,
                                                    1 undecidable rule
                                                    (.pui-menu__item:last-child, "structural
                                                     pseudo :last-child")
toast-hit  3d3d5cc:index.html index.html         -> FAIL — 5 declaration(s) differ,
                                                    0 markup problems, 0 unmatched.
                                                    grep -c "✗ #toast:" = 0
```

`toast-hit`'s FAIL is the expected, recorded result of round 0003's deliberate behaviour change,
not a regression. The `grep` count of `0` is the load-bearing part: no diff on `#toast` at any
state means all 5 differing declarations are `#toastUndo`'s `pointer-events (unset)→auto`, which
in turn proves nobody removed `pointer-events:none` from the container.

Restore completeness was verified by `git diff --stat auto/…/2026-08-25_0018 -- .` printing
nothing — that checks the *result*, so it catches a file that should have been deleted, which
inspecting the diff's shape beforehand would not.

## What I did NOT do

- **Did not answer, edit, reorder or delete any of the seven open decisions.** Each one moves
  pixels or adds a file to the repo.
- **Did not touch `index.html`, `Button.css` or `Menu.css`** — decision 7's territory.
- **Did not add a seventh token check.** All 22 tokens are already covered; a previous round
  concluded there is nothing left to enforce, and I agree after re-reading the checker's output.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying costs a round and changes nothing until decision 4 is answered.
- **Did not add the harness to the Verify command.** It is a per-round evidence tool tied to
  specific before/after shas, not an invariant that should stay green forever.

## Risk

- **This round changes no behaviour at all.** The only diffs are the mechanical restore commit
  and two documentation edits (`AUTOPILOT.md` status line + two tool-constraint notes). A
  reviewer should confirm exactly that: `git diff 36d2c86..HEAD` should touch `AUTOPILOT.md`
  and `SUMMARY.md` and nothing else.
- **Nothing in this repo has ever been verified in a real browser.** Every claim in the Verify
  block comes from source-text analysis or jsdom; no renderer was opened. The
  `ds-disabled-hover` PASS explicitly disclaims one rule it cannot read, and jsdom does no
  hit-testing, so the `:hover` and `pointer-events` reasoning rests on the CSS spec rather than
  observation. This is decision 4.
- **The stall is now five rounds deep and will not clear on its own.** Every future round will
  produce exactly this SUMMARY until someone answers a decision in `README.md`. The cheapest
  unblock is decision 4 (a permission grant) or decision 1 (dropping `jspdf.umd.min.js` at the
  repo root) — neither requires a design judgement.
- **Nothing has been merged to `main` (still `ef3220e`, 2 commits).** 40+ `auto/*` branches now
  stack in parallel off `3503537`, each re-restoring its predecessor. That is a runner-side
  problem, but it grows with every round spent here.
