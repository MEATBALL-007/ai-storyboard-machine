# Round 2026-08-30_0054 — no-op: five channels checked, no owner answer; a second, worse tip-ranking failure mode found

## What I did

- **Restored the previous round's tip `5886125` (`_0044`) before reading anything else in the project.**
  `git log --oneline -1` showed HEAD at `3503537` — the stale base the runner cuts every `auto/*` branch
  from — and `ls tools` showed `test.mjs` only, the independent tell. Restored with
  `git checkout <tip> -- .` as its own commit (`169e71b`) so this round's real diff stays readable.
- **Checked all five channels an owner answer could arrive through — none has one.** Every number under
  Verification is this round's own command output; nothing is transcribed from a previous SUMMARY.
- **Ran the full Verify command and all five parity-harness keys.** Every value matches the expected table
  in `AUTOPILOT.md` exactly, including `grep -c "✗ #toast:"` = 0.
- **Found a second failure mode of the superseded tip-ranking formula, distinct from the one round `_0044`
  documented, and worse.** `git for-each-ref --sort=-committerdate:short` ranks the **four-rounds-stale**
  `_0009` first, not the two-rounds-stale `_0027`. See Why — this is the only substantive finding here.
- **Changed no CSS, no `tools/`, no `docs/`, no `README.md`.** Beyond the restore commit, the only files
  this round writes are `SUMMARY.md` and `AUTOPILOT.md`.

## Why

The seven entries in `README.md → ## Open decisions` block every remaining acceptance criterion, and each
one either moves visible pixels or adds a file to the repo — the owner's call, not an agent's. The survey
work behind them is finished (token tooling 22/22 across six checks, parity table closed at 11/11
components), so there is no honest fallback task left. The queued Next task says so explicitly: if no
decision has been answered, check the channels, write `SUMMARY.md`, end the round, and do not invent a
substitute. That is exactly what this round is — the twelfth consecutive no-op.

### "The old formula" names two different bugs, with two different wrong answers

Round `_0044` proved the superseded formula misranks real refs in this repo, and recorded the mechanism as:
all dates collapse to one calendar day, so `sort -r` falls through to comparing **sha** strings, ranking
`7f93323` (`_0027`) first. **That account is correct for the formula as written in the contract** — a
`for-each-ref … | sort -r` pipeline over printed text. I reproduced its premise and it holds.

But the truncation bug has a second form, and this round hit it. If a round reaches for git's *native*
sort instead of the text pipeline, the tie is broken by **refname ascending**, not by sha:

```
git for-each-ref --sort=-committerdate:short --format='%(committerdate:short) %(objectname:short) %(refname:short)' refs/heads/auto
2026-08-30 3c4a327 auto/…/2026-08-30_0009     <- ranked first, and it is FOUR ROUNDS STALE
2026-08-30 6fb8369 auto/…/2026-08-30_0018
2026-08-30 7f93323 auto/…/2026-08-30_0027
2026-08-30 59a555b auto/…/2026-08-30_0034
2026-08-30 5886125 auto/…/2026-08-30_0044     <- the actual previous round, ranked LAST
```

Same truncated key, opposite ordering, and the previous round lands at the **bottom** of the list rather
than merely below a rival. The pipeline variant loses two rounds of work; this variant loses four. Both are
silent for exactly the reason `_0044` gave: a wrong restore of no-op rounds discards only `AUTOPILOT.md`
and `SUMMARY.md`, so tests and every harness key still pass.

The practical rule this yields: **the sort key and the display format are independent, and only the key
matters.** `--sort=-committerdate` (full precision) with a `%(committerdate:short)` *display* is safe,
because truncation never touches the comparison. Truncation is only dangerous when it reaches the thing
being compared — the `:short` inside `--sort=`, or the `:short` printed as the first field ahead of
`| sort -r`. The contract's one-liner is correct as written; I am not changing it.

**How I actually picked the tip this round.** `git for-each-ref --sort=-committerdate` (full-precision
key, `:short` only in the display), run **before** the restore, in the documented order — so my own branch
still sat at `3503537` / 2026-08-13 and could not float to the top. It put `5886125` first. Branch-name
order agrees, the author check and the empty whole-tree diff corroborate, and the sha ordering rules out a
truncated key having produced the answer by luck: `5886125` sorts *below* `59a555b` lexicographically, so
a sha tiebreak could not have returned it.

**On the owner-vs-runner discriminator.** Round `_0027` corrected the rule to key on the commit **author**
(`%an`/`%ae`) rather than a `chore: round … no-op` **subject**. I used the author field as the decision.

## Verification

Ran myself, this round, in this order.

**Restore preconditions**

- `git log --oneline -1` → `3503537` = stale base, restore required.
- `ls tools` → `test.mjs` only (no `check-tokens.mjs`) — independent confirmation the tree was stale.
- `git for-each-ref --sort=-committerdate` (before restore) → `5886125` on **both**
  `auto/…/2026-08-30_0044` and `origin/auto/…/2026-08-30_0044`; the sha has not moved, so restoring from
  it cannot bury an answer. Precondition read free from the same output.
- `git log -1 --format="%h %an <%ae> %ad %s" 5886125` → `PHANTOM AUTOPILOT <autopilot@phantom.local>
  Sun Aug 30 00:51:14 2026 +0700 chore: round 2026-08-30_0044 no-op -- 5 channels checked, no owner
  answer; iso8601 tip-ranking fix finally proved…` — runner author, so not an owner commit.
- `git diff --stat 59a555b 5886125` → `AUTOPILOT.md` + `SUMMARY.md` only (147+/78-) = the tip is clean.
- `git diff --name-status HEAD 5886125` → 13 `M`, 3 `A`, **no `D`** → a path-checkout is equivalent to a
  fast-forward here. This is what makes `git checkout <tip> -- .` safe; it would silently resurrect
  deleted files otherwise.

**Restore**

- `git checkout 5886125 -- .`, then committed as
  `169e71b chore: restore previous round tip 5886125 (branch cut from stale base 3503537)`.
- `git diff 5886125 --stat` (whole tree, **no** `-- .` pathspec) → **empty**. Proves no leftover files from
  the stale base *and* no missing files in one command, and closes channel 1 without a grep —
  `README.md` is unchanged byte for byte.

**The five channels**

1. `README.md → ## Open decisions` — unchanged (empty whole-tree diff above). Secondary counts:
   `grep -c "^### [1-7]\."` = **7**, `grep -c "If you answer:"` = **7**,
   `grep -c "| Option | Cost |"` = **7**. I also grepped the prose for an answer left *inline* rather than
   as a table replacement (`answer|decided|chose|we pick`): all nine hits are the standing prompts and the
   section's own framing — no owner reply.
2. jsPDF vendored? `git ls-files | grep -i jspdf` → **no output**.
3. `main` moved? → `ef3220e` (2026-06-27), unchanged, as are `mac/main` / `origin` / `origin/main`.
4. Files dropped in untracked? `git status --untracked-files=all --short` → **empty**.
5. Non-`auto/*` refs: `design-system` / `origin/design-system` = `3503537` (2026-08-13, newest of the
   group); `mac` / `mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` exists **only** as
   `origin/` + `mac/` refs = `592e7c3` (2026-07-20); `main` / `mac/main` / `origin` / `origin/main` =
   `ef3220e` (2026-06-27). Everything predates the current work → no answer parked on a sibling branch.

**Verify command — all three steps green**

```
node tools/test.mjs           -> 54 passed, 0 failed
node tools/check-tokens.mjs   -> tokens in sync: 22/22 ... identical in index.html
                                 fonts in sync: 4/4 ... embedded byte-identical
                                 no derived-colour literals: 15 CSS source(s) scanned
                                 font weights available: 15 CSS source(s), all in {400,500,700,800}
                                 no radius literals: 15 CSS source(s), every border-radius reads --r-*
                                 typeface from one source: 15 CSS source(s), every font-family var(--mono)
npm --prefix design-system test -> Test Files 12 passed (12) / Tests 31 passed (31)
```

**Parity harness — all five keys, exactly the expected values**

```
buttons            2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements
segmented          021b966:index.html index.html         -> PASS, 45 pairs /  9 elements
toast              bb10dd9:index.html 10e8f39:index.html -> PASS,  5 pairs /  1 element
ds-disabled-hover  HEAD:design-system/src/styles.css design-system/src/styles.css
                                                         -> PASS, 15 pairs / 3 elements,
                                                            1 undecidable rule (unchanged)
toast-hit          3d3d5cc:index.html index.html         -> FAIL - 5 declaration(s) differ,
                                                            10 pairs / 2 elements,
                                                            0 markup problems, 0 unmatched;
                                                            grep -c "✗ #toast:" = 0
```

`toast-hit`'s FAIL is the expected result — it records an intentional behaviour change from round
`2026-08-24_0003` — and `✗ #toast:` = 0 is the proof the app side was not touched.

## What I did NOT do

- **Did not answer any of the seven open decisions**, and did not implement any option from them.
  Decisions 2 / 5 / 6 / 7 all move visible pixels; that is the owner's call.
- **Did not touch `Button.css`, `Menu.css`, `index.html`, `tools/`, or `README.md`.** The Next task block
  names these explicitly as forbidden while decision 7 is unanswered.
- **Did not change the tip-ranking one-liner.** It is correct as written. This round only documents that a
  *different* spelling of the same idea fails in a second way, so no future round reaches for it.
- **Did not add a seventh token check.** All 22 tokens already have enforcement.
- **Did not invent a substitute task.** The fallback list is genuinely exhausted.
- **Did not audit whether earlier same-day rounds restored the wrong sibling tip** — see Risk. It is a
  separate task and would break the one-task rule.
- **Did not open a browser.** Decision 4 is still unanswered.

## Risk

- **The retrospective audit is now better motivated than when `_0044` flagged it, and I still did not do
  it.** There are two known misranking modes, not one, and the native-sort mode puts the correct tip
  *last*. Rounds before `_0009` used a truncated key; several fell on the same calendar day. A reviewer who
  wants one thing checked should check that. The mechanism is silent by construction.
- **My second-failure-mode finding is about a command no round is instructed to run.** The contract's
  one-liner is the text-pipeline form and is correct. I ran the native-sort form deliberately, to compare;
  it is not evidence that any past round used it. Do not read it as a defect in the current contract.
- **The empty whole-tree diff is the load-bearing check for the restore**, and it passed. But it only
  proves the tree matches `5886125` — it says nothing about whether `5886125` was the right tip. That rests
  on the four corroborating methods listed under Verification.
- **This round changes only `SUMMARY.md` and `AUTOPILOT.md`** on top of the restore commit, which is
  byte-for-byte the previous round's tip.
- **The five harness keys are not in the Verify command, by design.** Nothing forces a future round to run
  them or keeps them in sync with the code. They confirmed this restore was complete; they are not a
  standing guarantee.
- **Twelve consecutive rounds have now produced nothing but bookkeeping.** Three of the seven acceptance
  criteria cannot close without an owner decision. A reviewer should read
  `README.md → ## Open decisions`, not this file.
