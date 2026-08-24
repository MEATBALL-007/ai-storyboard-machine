# Round 2026-08-25_0007

## What I did

- **Restored the previous round's tip first.** The runner cut this branch from the stale base
  `3503537` again: no `tools/check-tokens.mjs`, no
  `docs/btn-parity-proof.mjs`, `index.html` back at its pre-token state, and the `## Next task`
  section arrived **empty** in the prompt. Commit `24391f3` brings the tree to `094e5c0`, the tip
  of round `2026-08-24_0322`; `git diff <tip> -- .` after the checkout prints nothing.
- **Tried the cleaner restore first and recorded why it is unavailable.** `094e5c0` is a direct
  descendant of `3503537`, so `git merge --ff-only` would have been a true fast-forward with no
  synthetic commit and a linear history. The Bash tool denies `git merge` outright ("This command
  requires approval"). That is the standing reason the path-checkout convention exists; it had not
  been written down before, so it is in the restore commit message now.
- **Checked all four channels an owner answer could arrive through. All four are clean.**
  README `## Open decisions` still has 7 `### N.` headings and 7 intact `**If you answer:**`
  markers (one per decision, none consumed); no answer prose matches
  `^(\*\*)?(answer|owner (says|decision)|decided|ตอบ)`; `main` is still at `ef3220e`;
  `git status --untracked-files=all` is empty; and `git ls-files | grep -i jspdf` is empty, so
  decision 1's expected artefact never landed.
- **Ended the round without inventing a substitute task**, exactly as the contract instructs. The
  only commits are the restore and this bookkeeping commit. No `.css`, no `index.html`, no
  `tools/`, no `docs/` source line changed.
- **Ran the full Verify command and all five harness keys anyway** (below). A no-op round is still
  a round that must prove the tree it hands on is green.

## Why

- The contract's "Next task" is unusually explicit that **the fallback work is exhausted** — token
  tooling is 22/22 across six checks and a seventh would enforce nothing, the element-parity table
  is closed at 11/11, and the harness already reads library CSS and reports its own undecidable
  selectors. It then pre-names the tempting candidates as out of bounds (implementing
  `:last-child`/`>`/`+`/`~`, adding the harness to Verify, applying decisions 2/5/6/7 unilaterally).
  With no owner input, the correct output of this round is a record that nothing unlocked; hard
  rule 5 says a round that only confirms the plan is a successful round.
- **Why I checked four channels rather than just the README:** decision 1's answer is a *file drop*,
  not prose, and an answer could in principle land on `main` instead of a round branch. Two of the
  four channels are therefore invisible to a README read. All four being clean is what makes "no
  answers" a finding rather than an assumption.
- **Why I read the task from the restored file, not the prompt.** The `AUTOPILOT.md` text handed to
  me described the repo as of round `_0036` and its `## Next task` section was empty. The restored
  file's Next task is three rounds newer and says something materially different. A round that
  trusted the prompt would have re-done committed work.

## Verification

Verify command, all three steps, on the final committed tree:

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens 22/22, fonts 4/4, checks 3-6 clean (15 CSS sources)
npm --prefix design-system test -> Test Files 12 passed (12), Tests 31 passed (31)
```

All five harness keys, against the counts the contract records for them — every number identical:

```
buttons    2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements, 0 undecidable
segmented  021b966:index.html index.html         -> PASS, 45 pairs /  9 elements, 0 undecidable
toast      bb10dd9:index.html 10e8f39:index.html -> PASS,  5 pairs /  1 element,  0 undecidable
ds-disabled-hover HEAD:…/styles.css …/styles.css -> PASS, 15 pairs /  3 elements, 1 undecidable
                                                    (.pui-menu__item:last-child, "identical in
                                                     both versions", subject matches
                                                     .pui-menu__item and .pui-menu__item--danger)
toast-hit  3d3d5cc:index.html index.html         -> FAIL — 5 declaration(s) differ, 0 markup
                                                    problem(s), 0 unmatched. `grep -c "✗ #toast:"`
                                                    = 0, so #toast has no diff at any state and
                                                    all 5 are #toastUndo pointer-events
                                                    (unset)->auto. This FAIL is the expected,
                                                    recorded result of round 0003's deliberate
                                                    behaviour change — not a regression.
```

No negative test this round: nothing was changed, so there is no claim of the form "this edit moved
no pixels" for a negative test to falsify. The earlier rounds' negative tests stand as the evidence
that these keys still bite.

## What I did NOT do

- **Did not answer any of the seven open decisions** and did not touch `index.html`, `Button.css`,
  `Menu.css`, `tools/`, or `docs/btn-parity-proof.mjs`.
- **Did not invent substitute work.** Every tempting candidate was pre-named as out of bounds by the
  contract, and each either moves pixels or is the owner's call.
- **Did not tick any acceptance criterion.** This round produced no user-visible change and
  unlocked nothing.
- Did not run a browser (decision 4 still unanswered; Playwright and Chrome-DevTools MCP are
  permission-blocked here, not merely headless).

## Risk

- **This is the third consecutive round that could only re-verify and re-report** — the previous
  round recorded itself as the second. Every remaining acceptance criterion depends on a human
  answering `README.md → ## Open decisions`. The runner will keep opening near-identical PRs; that
  cost is real and no round can fix it from the inside. **This is the thing to look at, and the
  only input that changes it is an owner answer.**
- **The stale-base restore is the load-bearing step of this round.** It is a path checkout
  (`git checkout <tip> -- .`), which is tree-equivalent to a fast-forward only because no file is
  deleted between `3503537` and `094e5c0` — I checked `--name-status` and it lists only `M`/`A`
  entries, no `D`. If a future round's diff ever deletes a file, this technique silently leaves the
  deleted file behind. Since `git merge` is denied, the check must be re-run every round rather
  than assumed.
- **The "Nth round in a row" tally that restore commit messages carry is not verifiable and
  undercounts.** The previous round's message said "Fifteenth"; only 9 commits across all 47 round
  branches use that wording at all, so rounds that phrased the restore differently were never
  counted. I have not repeated a specific number — the checkable facts are that HEAD was at
  `3503537` at checkout (see reflog) and that no round has yet started from a correct base.
- **Nothing here re-proves the app renders correctly.** All five harness keys and all six token
  checks read source text; none opens a renderer. The `ds-disabled-hover` PASS explicitly disclaims
  `.pui-menu__item:last-child`, which is exactly the rule decision 7 would touch — so the one open
  decision most likely to be acted on next is also the one the harness is blindest to.
- **The `toast-hit` key is a FAIL that must stay a FAIL at exactly 5.** A reviewer skimming for
  green will misread it. If that number ever moves, someone has touched the app side of the toast.
