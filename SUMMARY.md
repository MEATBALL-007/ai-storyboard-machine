# Round 2026-08-25_0018

## What I did

- **Restored the previous round's tip first.** The runner cut this branch from the stale base
  `3503537` yet again — `git log --oneline -1` at checkout showed `3503537`, `tools/` held only
  `test.mjs`, `docs/` only `superpowers/`, and the `## Next task` section arrived **empty** in the
  prompt. Commit `0b48c63` brings the tree to `43426ad`, the tip of round `2026-08-25_0007`.
- **Verified the restore with a stronger check than the convention asked for.** The standing
  instruction was "confirm `git diff --name-status 3503537 <tip>` has no `D` lines", which *infers*
  tree equality from the shape of the diff. I ran `git diff --stat 43426ad` instead — it printed
  nothing, which *proves* the working tree equals `43426ad` and would also catch a file that should
  have been deleted and wasn't. That is now written into `AUTOPILOT.md` as the check to run.
- **Re-tested both cleaner restore paths; both are still denied.** `git merge --ff-only 43426ad`
  → "This command requires approval", as round 0007 recorded. I also tried
  `git read-tree -u --reset 43426ad`, which *does* delete files and would be the correct primitive
  — it is denied too. The path checkout remains the only available route.
- **Checked five channels an owner answer could arrive through. All five are clean.**
  The four from the contract: README `## Open decisions` still has 7 `### N.` headings and 7 intact
  `**If you answer:**` markers (none consumed); `git ls-files | grep -i jspdf` is empty, so
  decision 1's file drop never landed; `main` is still at `ef3220e`;
  `git status --untracked-files=all` is empty. **Plus a fifth I added:** the non-autopilot refs
  (`design-system`, `hardening-pass`, `main`, and their `origin`/`mac` counterparts) have a newest
  commit of **2026-08-13** — older than every round of this work, so no answer is parked on a
  sibling branch. A keyword scan of `README.md` for `Answer|ANSWER|ตอบ|Decision:|Chosen` also
  returned nothing.
- **Ended the round without inventing a substitute task.** The only commits are the restore and
  this bookkeeping commit. No `.css`, no `index.html`, no `tools/`, no `docs/` source line changed.

## Why

- The restored `## Next task` is explicit that **the fallback work is exhausted** — token tooling is
  22/22 across six checks, the element-parity table is closed at 11/11, and the harness already
  reads library CSS and reports its own undecidable selectors. It then pre-names every tempting
  candidate as out of bounds (implementing `:last-child`/`>`/`+`/`~`, adding the harness to Verify,
  applying decisions 2/5/6/7 unilaterally). With no owner input, the correct output is a record
  that nothing unlocked; hard rule 5 says a round that only confirms the plan is a successful round.
- **Why I added a fifth channel.** The four prescribed channels all assume the answer arrives in
  this branch's working tree or on `main`. An owner poking at the repo could equally have committed
  to `hardening-pass` or `design-system`, which are real branches here. Checking them costs one
  command and converts "probably no answer" into "no answer anywhere reachable".
- **Why I read the task from the restored file, not the prompt.** The `AUTOPILOT.md` handed to me
  described the repo as of round `_0036` and its `## Next task` was empty. The restored file's Next
  task is materially different. A round that trusted the prompt would have re-done committed work —
  most likely re-writing `tools/check-tokens.mjs` from scratch.

## Verification

Verify command, all three steps, on the final committed tree:

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens 22/22, fonts 4/4, checks 3-6 clean (15 CSS sources)
npm --prefix design-system test -> Test Files 12 passed (12), Tests 31 passed (31)
```

All five harness keys, against the counts the contract records — every number identical:

```
buttons    2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements
segmented  021b966:index.html index.html         -> PASS, 45 pairs /  9 elements
toast      bb10dd9:index.html 10e8f39:index.html -> PASS,  5 pairs /  1 element
ds-disabled-hover HEAD:design-system/src/styles.css design-system/src/styles.css
                                                 -> PASS, 15 pairs /  3 elements,
                                                    1 undecidable rule
                                                    (.pui-menu__item:last-child, "structural
                                                     pseudo :last-child", subject matches
                                                     .pui-menu__item and .pui-menu__item--danger)
toast-hit  3d3d5cc:index.html index.html         -> FAIL — 5 declaration(s) differ,
                                                    0 markup problem(s), 0 unmatched.
                                                    `grep -c "✗ #toast:"` = 0, so #toast has no
                                                    diff at any state and all 5 are #toastUndo
                                                    pointer-events (unset)->auto.
```

`toast-hit`'s FAIL is the expected, recorded result of round 0003's deliberate behaviour change —
not a regression. Its `10 pairs / 2 elements` line counts `#toast` and `#toastUndo`; the 5 diffs are
all on the latter.

No negative test this round: nothing was changed, so there is no claim of the form "this edit moved
no pixels" for a negative test to falsify. The earlier rounds' negative tests stand as the evidence
that these keys still bite.

## What I did NOT do

- **Did not answer any of the seven open decisions** and did not touch `index.html`, `Button.css`,
  `Menu.css`, `tools/`, or `docs/btn-parity-proof.mjs`.
- **Did not invent substitute work.** Every tempting candidate is pre-named out of bounds by the
  contract, and each either moves pixels or is the owner's call.
- **Did not tick any acceptance criterion.** This round produced no user-visible change.
- Did not run a browser (decision 4 still unanswered; Playwright and Chrome-DevTools MCP are
  permission-blocked here, not merely headless).

## Risk

- **This is the fourth consecutive round that could only re-verify and re-report.** Every remaining
  acceptance criterion depends on a human answering `README.md → ## Open decisions`. The runner will
  keep opening near-identical PRs; that cost is real and no round can fix it from the inside.
  **This is the thing to look at, and the only input that changes it is an owner answer.**
- **The stale-base restore is the load-bearing step of this round.** It is a path checkout, which
  cannot delete files. It happened to be tree-exact here (`git diff --stat 43426ad` empty), but if a
  future round's tip ever deletes a file relative to `3503537`, this technique leaves the deleted
  file behind and the checker is the only thing standing between that and a silently wrong tree.
  Both better primitives (`git merge --ff-only`, `git read-tree -u --reset`) are denied.
- **I have not asserted a verifiable "Nth round in a row" count.** I state fourth because rounds
  0322, 0007 and this one each recorded a no-op and 0102 was the last round with real work, but
  restore-commit wording is inconsistent across the 47 round branches so any tally read from commit
  messages undercounts. The checkable facts are the reflog (HEAD at `3503537` on checkout) and the
  unchanged `main`.
- **Nothing here re-proves the app renders correctly.** All five harness keys and all six token
  checks read source text; none opens a renderer. The `ds-disabled-hover` PASS explicitly disclaims
  `.pui-menu__item:last-child`, which is exactly the rule decision 7 would touch — so the one open
  decision most likely to be acted on next is also the one the harness is blindest to.
- **The `toast-hit` key is a FAIL that must stay a FAIL at exactly 5.** A reviewer skimming for
  green will misread it. If that number ever moves, someone has touched the app side of the toast.
