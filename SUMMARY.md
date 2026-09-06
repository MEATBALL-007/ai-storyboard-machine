# Round 2026-09-07_0000 — SUMMARY

## What I did

- **Restored the previous round's tip before reading anything.** `git log --oneline -1` showed
  `3503537` — the stale base the runner cuts every `auto/*` branch from — so the working tree had
  no `tools/check-tokens.mjs`, no `docs/btn-parity-proof.mjs`, no token/radius/font work, and no
  `## Open decisions` in `README.md`. Restored `49b333d` (branch `…/2026-09-06_0045`) via
  `git checkout 49b333d -- .` as its own commit (`cd1cf97`) so this round's real diff stays readable.
- **Checked all five owner-answer channels. None has been answered — still 8 open decisions.**
  This is a no-op round: `index.html`, `design-system/`, `tools/` and `docs/` were not touched by a
  single byte. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full three-stage Verify plus all five parity-harness keys** — every number matches the
  expected table, which is the independent confirmation that the restore was byte-correct.
- **Corrected a rule the contract has recorded wrongly for several rounds, with a real A/B run.**
  The tip-selection trap is *not* the `:short` token and *not* "ties fall through to the sha". It is
  the **field order** in `--format`: `sort -r` compares the whole line, so a tied truncated date
  breaks on whichever field is printed next. Printing the refname before the sha is safe *by
  construction*; printing the sha first is the actual hazard. Written into `AUTOPILOT.md`.
- **Resolved round `_0045`'s conditional forecast: TAILS — the first round where the damage would
  have been real** rather than avoided by luck. Recorded, with a structurally-argued forecast for
  the next round.

## Why

- **The restore comes first, before any Read.** The stale tree does not look broken — it looks
  *done*: on `3503537` the app's `:root` really is byte-identical to `tokens.css` (11 tokens), so a
  round that reads before restoring concludes the token work is finished and wastes itself. That has
  actually happened here (round `2026-08-28_0004`), and once (`2026-08-19_0022`) it permanently
  dropped `docs/design-parity.md` from the tree.
- **Why I re-ran the A/B the contract said was settled.** Line 356 said the evidence was sufficient
  and the next round need not repeat it. I ran it anyway because it is read-only, costs two commands,
  and this was the first round where the recorded forecast predicted *actual* damage — a claim worth
  confirming by execution rather than inheriting. That is what surfaced the error in the rule. I did
  not act on the corrected rule beyond documenting it; my tip selection used full-precision
  `--sort=-committerdate` plus a refname cross-check, as instructed.
- **Why the correction matters and is not pedantry.** As written, the rule condemns
  `'%(committerdate:short) …' | sort -r` wholesale. A future round following that literally would
  believe it must avoid `:short` entirely, while the genuinely dangerous variant — sha printed before
  refname — is not what the rule names. The two differ by field order alone and produce a six-row
  displacement on today's data.

## Verification

Restore correctness, by the method the contract prescribes (tree equality, not diff shape):

```
git diff --stat 49b333d -- .                            → (empty)  tree byte-identical
git diff --diff-filter=D --name-only 3503537 49b333d    → (empty)  no deletions missed by path-checkout
git merge-base --is-ancestor 3503537 49b333d            → ancestor-ok
git log -1 --format="%h %an <%ae> %ad %s" 49b333d
  → 49b333d PHANTOM AUTOPILOT <autopilot@phantom.local> Sun Sep 6 00:51:05 2026 +0700
    chore: round 2026-09-06_0045 no-op -- five channels checked, no owner answer
```

Verify command, all three stages green:

```
node tools/test.mjs              → 54 passed, 0 failed
node tools/check-tokens.mjs      → 6/6 checks pass:
    tokens in sync 22/22 · fonts in sync 4/4 · no derived-colour literals (15 CSS sources)
    font weights available · no radius literals · typeface from one source
npm --prefix design-system test  → 12 test files, 31 passed
```

All five harness keys, matching the expected table exactly:

```
buttons           2488f2d:index.html  index.html   → PASS  85 pairs / 17 elements, markup 7 gone / 5 new
segmented         021b966:index.html  index.html   → PASS  45 pairs / 9 elements,  markup 0 gone / 3 new
toast             de07ea8:  10e8f39:index.html     → PASS   5 pairs / 1 element,   markup 0 gone / 1 new, no undecidable
ds-disabled-hover 49b333d:styles.css  styles.css   → PASS  15 pairs / 3 elements, markup N/A (stylesheet)
                                                      + 1 undecidable rule (.pui-menu__item:last-child)
toast-hit         3d3d5cc:index.html  index.html   → FAIL — 5 declaration(s) differ  ← expected result
```

`toast-hit`'s FAIL is the correct, documented outcome of that key: it records the deliberate
`pointer-events:auto` behaviour change from round `2026-08-24_0003`. I read **all five** `✗` rows
rather than `grep -c "✗ #toast:"` (blind-spotted per round `_0043`); all five are `#toastUndo`
(`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`) and none is `#toast`, which is the
evidence that the app side was not touched.

`ds-disabled-hover`'s "before" side reads the tip I actually restored (`49b333d`), not a sha copied
from an old status block.

The A/B, run after restore with `grep -v 2026-09-07_0000` to exclude my own branch and reproduce the
pre-restore condition:

```
'%(committerdate:short) %(refname:short) %(objectname:short)' | sort -r
  → _0045  _0036  _0028  _0020  _0012  _0002        every row correctly ordered

'%(committerdate:short) %(objectname:short) %(refname:short)' | sort -r
  → _0036  _0028  _0002  _0020  _0012  _0045        real tip 49b333d sunk to row 6
```

Row 3 of the second listing (`8def8f7` = `_0002`, the *oldest* tip of the day, sitting above `_0020`
and `_0012`) reproduces exactly what round `_0045` recorded observing — which is what identifies the
sha-first form as the one earlier rounds were running.

Five channels, all dry:

```
grep -c "| Option | Cost |" README.md   → 8      two independent counters agree
grep -c "If you answer:"    README.md   → 8      ⇒ no decision answered
git ls-files | grep -i jspdf            → (empty)  jsPDF still not vendored
git status --untracked-files=all --short → (empty)  no owner-dropped files
non-autopilot branches: design-system/origin/design-system = 3503537 (2026-08-13);
  mac, mac/design-system = e3a355c (2026-07-20); mac/hardening-pass, origin/hardening-pass = 592e7c3
  (2026-07-20); main, mac/main, origin, origin/main = ef3220e (2026-06-27) — none moved
```

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`.** All eight owner decisions
  are still open; every remaining path to the acceptance criteria moves pixels or is an owner's call.
  `git status` for this round shows `AUTOPILOT.md` and `SUMMARY.md` only.
- **Did not invent substitute work.** Backlog work that touches code is genuinely exhausted, and the
  last read-only item (`retrospective restore audit`) closed in round `2026-08-31_0023`.
- **Did not act on the corrected sort rule beyond documenting it** — no tooling was changed to
  enforce it, because nothing in the repo runs that pipeline; it is a hazard for future rounds
  reading the contract, and the contract is where the fix belongs.
- **Did not recover `docs/design-parity.md`** (still retrievable at `c3351fc:docs/design-parity.md`).
  That is decision 8 and remains the owner's call.
- **Did not verify anything in a browser** — decision 4 has not been granted, and Playwright and
  Chrome-DevTools MCP are both permission-blocked, not merely headless.

## Risk

- **The corrected sort rule is the one new claim in this round; it rests on a run I did, on today's
  ref set.** The two listings above are the whole evidence. The reasoning that refname-ordering is
  safe "by construction" holds only while round numbers stay zero-padded to equal width and share a
  common prefix — if the runner ever changes the branch naming scheme, that guarantee lapses. Using
  `--sort=-committerdate` does not depend on naming at all, which is why the instruction I left says
  to use it rather than to rely on field order.
- **The forecast for the next round says risk is temporarily zero.** That is because this round's tip
  is the only tip dated `2026-09-07`, so no tie exists at row 1 for any formula. It stops being true
  the moment a second round closes on the same date, and it is an argument about ref topology, not a
  check I could run against a future that does not exist yet. Treat it as a prediction.
- **`toast-hit` reports FAIL by design.** A reviewer scanning for green will misread this. The
  meaningful assertion is the composition of the failure — five rows, all `#toastUndo`, zero `#toast`
  — not the exit status.
- **The underlying runner bug is still unfixed and is the real cost here.** Every round spends its
  opening on a restore, and the stalemate now exceeds three weeks and has crossed a month boundary.
  No round can fix this from inside the repo; it needs the owner.
- **`AUTOPILOT.md` was 2,663 lines / 354,310 bytes before this round's edit and grew again.** This is
  why `## Next task` arrives empty in the runner's prompt — the file is truncated before it reaches
  me. Trimming it is an owner decision, so I left it and read the section from the file after
  restoring instead.
