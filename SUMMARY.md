# Round 2026-08-31_0004 — no-op: five channels checked, no owner answer; the truncated-key formula misranks again, this time losing three rounds

## What I did

- **Restored the previous round's tip `5f7b72d` (`_0054`) before reading anything else in the project.**
  `git log --oneline -1` showed HEAD at `3503537` — the stale base the runner cuts every `auto/*` branch
  from — and `ls tools` showed `test.mjs` only, the independent tell. Restored with
  `git checkout <tip> -- .` as its own commit (`9091c19`) so this round's real diff stays readable.
- **Checked all five channels an owner answer could arrive through — none has one.** Every number under
  Verification is this round's own command output; nothing is transcribed from a previous SUMMARY.
- **Ran the full Verify command and all five parity-harness keys.** Every value matches the expected table
  in `AUTOPILOT.md` exactly, including `grep -c "✗ #toast:"` = 0.
- **Hit a real discriminating case for the tip-ranking formula for the second time — and this one is
  costlier than round `_0044`'s.** The superseded truncated-key formula ranks `7f93323` (`_0027`) above the
  correct tip; following it would have discarded `_0034`, `_0044`, and `_0054`. See Why.
- **Changed no CSS, no `tools/`, no `docs/`, no `README.md`.** Beyond the restore commit, the only files
  this round writes are `SUMMARY.md` and `AUTOPILOT.md`.

## Why

The seven entries in `README.md → ## Open decisions` block every remaining acceptance criterion, and each
one either moves visible pixels or adds a file to the repo — the owner's call, not an agent's. The survey
work behind them is finished (token tooling 22/22 across six checks, parity table closed at 11/11
components), so there is no honest fallback task left. The queued Next task says so explicitly: if no
decision has been answered, check the channels, write `SUMMARY.md`, end the round, and do not invent a
substitute. That is exactly what this round is — the thirteenth consecutive no-op.

### The truncated-key formula misranks again, and the loss is bigger than last time

Round `_0044` found the first case where the superseded formula and the correct one disagree on real refs
in this repo. Round `_0054` then documented a *second spelling* of the same bug (git's native `--sort`,
tie-broken by refname) but was explicit that it had run that variant deliberately, for comparison — it was
not a live misranking. **This round is a live one, in the contract's own pipeline form.**

Reproduced this round, after the restore commit:

```
git for-each-ref --format="%(committerdate:short) %(objectname:short) %(refname:short)" refs/heads \
  | grep "auto/deep_dive" | sort -r | head -4
2026-08-31 9091c19 auto/…/2026-08-31_0004   <- my own branch (see the caveat below)
2026-08-30 7f93323 auto/…/2026-08-30_0027   <- first non-self entry, and THREE ROUNDS STALE
2026-08-30 6fb8369 auto/…/2026-08-30_0018
2026-08-30 5f7b72d auto/…/2026-08-30_0054   <- the actual previous round, ranked third
```

Six rounds now carry the date `2026-08-30`, so `%(committerdate:short)` ties across all of them and `sort`
falls through to comparing **sha strings**. `7f93323` beats `5f7b72d` lexicographically while losing badly
on time. A round that trusted that first non-self line would have restored `_0027` and silently dropped
`_0034`, `_0044` and `_0054` — three rounds, against the two `_0044` measured. The loss grows every round
that lands on the same calendar day, which is the part worth noticing: this is not a fixed-size bug.

It stays silent for the reason every previous round gave: a wrong restore of no-op rounds discards only
`AUTOPILOT.md` and `SUMMARY.md`, so the tree stays self-consistent, `git status` stays clean, Verify stays
green, and all five harness keys still match.

**Caveat on the command above — it does not undercut the finding.** I ran it *after* the restore commit,
so my own branch floats to the top; that is the trap round `_0018` documented, and it is why the rule says
"the first entry that is not your own branch." It does not affect the comparison, because the misranking
here is entirely among the six `2026-08-30` siblings, none of which is my branch.

**How I actually picked the tip this round.** `git for-each-ref --sort=-committerdate` — full-precision
key, `:short` only in the *display*, per the rule round `_0054` distilled — run **before** the restore, in
the documented order, so my own branch still sat at `3503537` / 2026-08-13 and could not float to the top.
It put `5f7b72d` first with a full timestamp of `2026-08-30 01:02:21 +0700`, ahead of `5886125` at
`00:51:14`. Branch-name order agrees, the author check and the empty whole-tree diff corroborate, and the
sha ordering rules out a truncated key having produced the answer by luck — as shown above, a sha tiebreak
returns `7f93323`, not `5f7b72d`.

**On the owner-vs-runner discriminator.** Round `_0027` corrected the rule to key on the commit **author**
(`%an`/`%ae`) rather than a `chore: round … no-op` **subject**. I used the author field as the decision.

## Verification

Ran myself, this round, in this order.

**Restore preconditions**

- `git log --oneline -1` → `3503537` = stale base, restore required.
- `ls tools` → `test.mjs` only (no `check-tokens.mjs`) — independent confirmation the tree was stale.
- `git for-each-ref --sort=-committerdate` (before restore) → `5f7b72d` on **both**
  `auto/…/2026-08-30_0054` and `origin/auto/…/2026-08-30_0054`; the sha has not moved, so restoring from
  it cannot bury an answer. Precondition read free from the same output.
- `git log -1 --format="%h %an <%ae> %ad %s" 5f7b72d` → `PHANTOM AUTOPILOT <autopilot@phantom.local>
  Sun Aug 30 01:02:21 2026 +0700 chore: round 2026-08-30_0054 no-op -- 5 channels checked, no owner
  answer; second tip-ranking failure mode documented` — runner author, so not an owner commit.
- `git diff --stat 5886125 5f7b72d` → `AUTOPILOT.md` + `SUMMARY.md` only (110+/78-) = the tip is clean.
- `git diff --name-status HEAD 5f7b72d` → 13 `M`, 3 `A`, **no `D`** → a path-checkout is equivalent to a
  fast-forward here. This is what makes `git checkout <tip> -- .` safe; it would silently resurrect
  deleted files otherwise.

**Restore**

- `git checkout 5f7b72d -- .`, then committed as
  `9091c19 chore: restore previous round tip 5f7b72d (branch cut from stale base 3503537)`.
- `git diff 5f7b72d --stat` (whole tree, **no** `-- .` pathspec) → **empty**. Proves no leftover files from
  the stale base *and* no missing files in one command, and closes channel 1 without a grep —
  `README.md` is unchanged byte for byte.

**The five channels**

1. `README.md → ## Open decisions` — unchanged (empty whole-tree diff above). Secondary counts:
   `grep -c "^### [1-7]\."` = **7**, `grep -c "If you answer:"` = **7**,
   `grep -c "| Option | Cost |"` = **7**. I also grepped the prose for an answer left *inline* rather than
   as a table replacement (`answer|decided|chose|we pick`): all ten hits are the standing prompts and the
   section's own framing (lines 8, 9, 404, and the seven `**If you answer:**` prompts) — no owner reply.
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
- **Did not change the tip-ranking one-liner.** It is correct as written, and this round is a third
  independent confirmation of that — it only adds a measured cost to the failure it already describes.
- **Did not add a seventh token check.** All 22 tokens already have enforcement.
- **Did not invent a substitute task.** The fallback list is genuinely exhausted.
- **Did not audit whether earlier same-day rounds restored the wrong sibling tip** — see Risk. It is a
  separate task and would break the one-task rule.
- **Did not open a browser.** Decision 4 is still unanswered.

## Risk

- **The retrospective audit is now the single best-motivated unclaimed task in this repo, and I again did
  not do it.** Three rounds have now demonstrated the misranking on live refs, the cost measured so far has
  gone 2 rounds → 3 rounds, and it grows with every additional round sharing a calendar day. Rounds before
  `_0009` all used the truncated key and several fell on the same day. A reviewer who wants exactly one
  thing checked should check that. The mechanism is silent by construction.
- **My reproduction of the misranking was run after the restore commit**, so its first line is my own
  branch. I judged that harmless because the misranking is entirely among the six `2026-08-30` siblings —
  but a reader who wants the cleanest possible evidence should re-run it before restoring, not after.
- **The empty whole-tree diff is the load-bearing check for the restore**, and it passed. But it only
  proves the tree matches `5f7b72d` — it says nothing about whether `5f7b72d` was the right tip. That rests
  on the four corroborating methods listed under Verification.
- **This round changes only `SUMMARY.md` and `AUTOPILOT.md`** on top of the restore commit, which is
  byte-for-byte the previous round's tip.
- **The five harness keys are not in the Verify command, by design.** Nothing forces a future round to run
  them or keeps them in sync with the code. They confirmed this restore was complete; they are not a
  standing guarantee.
- **Thirteen consecutive rounds have now produced nothing but bookkeeping.** Three of the seven acceptance
  criteria cannot close without an owner decision. A reviewer should read
  `README.md → ## Open decisions`, not this file.
