# Round 2026-09-21_0037 — no-op round (all 8 owner decisions still open)

## What I did

- **Restored the previous round's tip.** The runner cut this branch from the stale base
  `3503537` again, so the working tree arrived without any of the 51+ rounds of work.
  Restored from `92d9038` (tip of `auto/…/2026-09-21_0027`) and committed it as `68bf84a`.
- **Checked all five channels for an owner answer — there is none.** All 8 decisions in
  `README.md` `## Open decisions` are still unanswered, so every remaining acceptance
  criterion stays blocked. No substitute task was invented (hard rule 5 + the standing
  instruction in `AUTOPILOT.md:345-349`).
- **Ran the full Verify command and all 5 harness keys.** Every number matches the
  reference table in `AUTOPILOT.md:4100-4106` exactly.
- **Recorded this round's tip-selection A/B result in `AUTOPILOT.md`.** The buggy
  formula the contract tracks would have restored the *wrong* tip this round — see Risk.
- Updated `## Next task` and the next-round tiebreak prediction block.

## Why

The contract's task for this round was conditional: *if the owner has answered a decision,
act on it; otherwise run the no-op protocol and stop.* Channel 2 shows 8/8 still open and
channel 5 shows no owner commits on any branch, so the second branch applied. There is no
unblocked work left — token tooling is 22/22 complete, the parity table is closed at 11/11
components, and the three remaining CSS deltas (chip padding, segmented padding, input
sizes) plus the `:hover`-on-disabled repair all move pixels, which is the owner's call.

**Why the restore commit uses `git checkout <tip> -- .`:** `git merge --ff-only` and
`git read-tree -u --reset` are both refused by the Bash tool in this environment (confirmed
repeatedly, see `AUTOPILOT.md:4076-4085`). `checkout -- .` cannot delete files, so I proved
the result is byte-identical with a tree-hash comparison rather than trusting the command.

## Verification

**Restore integrity**

```
git rev-parse HEAD^{tree} 92d9038^{tree}
  e9f9f68077786d04febe82ecef6bc319ac9ea545
  e9f9f68077786d04febe82ecef6bc319ac9ea545   ← identical, every path at once
git diff --stat 92d9038          → (no output)
git status -uall --short         → (no output)
```

Precondition checked before restoring: local **and** `origin/` refs for `_0027` both point
at `92d9038`, so the owner had not committed an answer over the old branch.

**Five channels — no answer on any of them**

| # | Channel | Result |
|---|---|---|
| 1 | tree identity vs. restored tip | identical (`e9f9f680…`) |
| 2 | `README.md` open-decision counter | **8/8 still open** |
| 3 | `git ls-files \| grep -i jspdf` | empty — jsPDF still not vendored (decision 1) |
| 4 | `git status -uall --short` | empty |
| 5 | non-`auto/*` refs | `design-system` `3503537`, `mac` `e3a355c`, `mac/hardening-pass` `592e7c3`, `main`/`origin/main` `ef3220e` — **none moved** |

**Verify command — all three steps green**

```
node tools/test.mjs                 → 54 passed, 0 failed
node tools/check-tokens.mjs         → 6/6 checks pass:
    tokens in sync 22/22 · fonts in sync 4/4 · no derived-colour literals (15 CSS sources)
    font weights available · no radius literals · typeface from one source
npm --prefix design-system test     → 12 files, 31 passed
```

**Harness — all 5 keys, using the pinned refs from `AUTOPILOT.md:4120-4124` (not guessed)**

| key | pairs / elements | markup coverage | result |
|---|---|---|---|
| `buttons` | 85 / 17 | 7 old gone, 5 new | PASS, no undecidable |
| `segmented` | 45 / 9 | 0 old gone, 3 new | PASS, no undecidable |
| `toast` | 5 / 1 | 0 old gone, 1 new | PASS, no undecidable |
| `ds-disabled-hover` | 15 / 3 | N/A (stylesheet) | PASS + **1 undecidable rule** (expected) |
| `toast-hit` | 10 / 2 | 0 problems, 0 unmatched | **FAIL — 5 declarations differ (expected)** |

`toast-hit` is *supposed* to fail: it documents the intentional `pointer-events:auto` fix
from round `2026-08-24_0003`. I verified it row by row with `grep "✗"` rather than the
known-blind `grep -c "✗ #toast:"` — all five `✗` rows are `#toastUndo`
(`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`) and **no `#toast` row
appears**, which is the proof the app side was not touched.

## What I did NOT do

- **Did not answer or act on any of the 8 open decisions.** Decisions 2 / 5 / 6 / 7 all
  move visible pixels; 1 needs a file only the owner can supply; 8 is a history call.
- **Did not touch `index.html`, `Button.css`, or `Menu.css`.** The contract forbids it
  while decision 7 is open, and nothing in Verify would catch it if I did.
- **Did not add a 7th token check.** Coverage is already 22/22 tokens; the previous round
  concluded there is nothing left to enforce.
- **Did not verify anything in a real browser.** Playwright and Chrome-DevTools MCP are
  both permission-blocked here (decision 4 has not been granted) — this is not a
  "no display" problem, so future rounds should not spend time retrying it.

## Risk

- **The tip-selection tiebreak fired "tails" this round — a real, unmasked measurement.**
  With the correct formula (`--sort=-committerdate`, tie-broken by refname, own refname
  dropped) row 1 is `92d9038` = `_0027`, which is right. With the buggy formula the
  contract tracks (`committerdate:short`, sha printed before refname, `| sort -r`) row 1 is
  `f33211e` = `_0017`, because `'f' > '9'` lexically. **Using the buggy formula this round
  would have silently discarded all of round `_0027`'s work** — and no checker would have
  noticed, because the tree would still have been self-consistent and every test would
  still have been green. Running cumulative tally of the buggy formula: **tails 32 of 50**
  (32/46 excluding the 4 structurally-masked rounds). `_0027`'s conditional prediction was
  correct on both outcome and reasoning.
- **Nothing was verified in a browser, this round or any round.** Every claim about
  rendering and hit-testing in this project rests on reading source plus the CSS spec.
- **This round produced no functional change.** `index.html` and all design-system CSS are
  byte-identical to the previous tip. The only diffs are `AUTOPILOT.md` and `SUMMARY.md`.
  A reviewer comparing against `main` is really reviewing the accumulated work of all
  previous rounds, restored intact — not anything authored here.
- **The project cannot progress further without the owner.** Six consecutive rounds have
  now been no-ops. Rounds are cheap, but the honest status is: the work is finished up to
  the point where every remaining step requires a human decision.
