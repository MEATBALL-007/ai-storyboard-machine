# Round 2026-09-03_0017 — no-op (no owner answer on any of the 8 open decisions)

## What I did

- **Restored the previous round's tree.** The branch was cut from the stale base `3503537`
  (runner bug, 57th round running). Path-restored tip `2eda89e` (`…/2026-09-03_0007`) as its own
  commit `f55a06f` (13 `M` + 3 `A`, no `D`); residual `git diff --stat 2eda89e -- .` is empty.
- **Checked all five owner-answer channels — nothing has been answered.** Both README counters
  read 8 and agree, no `jspdf` file, no untracked drop, `main` still `ef3220e`, and no non-`auto/*`
  ref newer than 2026-08-13.
- **Ran the full Verify (3 stages) and all five harness keys.** Every number matches the expected
  table exactly. No source file was touched.
- **Ran the retired `:short` ranking formula live** and recorded the result in `AUTOPILOT.md`:
  it produced the worst same-day inversion yet recorded (5 places), while being *accidentally
  correct at position 1* because of the calendar rollover.
- Updated `AUTOPILOT.md` (new status block + sharpened the `## Next task` instructions) and
  overwrote this file. Nothing else changed: `index.html`, `design-system/`, `tools/` and `docs/`
  are byte-identical to `2eda89e`.

## Why

The queued Next task says explicitly: if no decision has been answered, check the five channels,
write SUMMARY, end the round — fallback work that touches code is exhausted (token tooling is
22/22 across six checks, the parity table is closed at 11/11), and the last read-only fallback
(the retrospective restore audit) was completed in round `2026-08-31_0023`. Every remaining item
moves pixels or adds a file to the repo, so each is the owner's call, not an agent's.

The one judgement call: I spent a single extra Bash call running the `:short` formula for real.
Without it I would have written an *inference* into `AUTOPILOT.md` about what the trap would have
done this round — and prior rounds have been burned by exactly that. One call converted a guess
into evidence, and the evidence turned out to be the strongest case against `:short` on record.

## Verification

Verify command — all three stages green:

```
node tools/test.mjs          -> 54 passed, 0 failed
node tools/check-tokens.mjs  -> tokens 22/22 · fonts 4/4 · no derived-colour literals ·
                                font weights available · no radius literals ·
                                typeface from one source   (6/6 checks, 15 CSS sources)
npm --prefix design-system test -> 12 test files, 31 passed
```

`docs/btn-parity-proof.mjs` — all five keys, exact commands run:

| key | command | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | PASS — 85 pairs / 17 elements, 0 undecidable |
| `segmented` | `021b966:index.html index.html` | PASS — 45 pairs / 9 elements |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | PASS — 5 pairs / 1 element, 0 undecidable |
| `ds-disabled-hover` | `2eda89e:design-system/src/styles.css design-system/src/styles.css` | PASS — 15 pairs / 3 elements, **+1 undecidable** (`.pui-menu__item:last-child`) |
| `toast-hit` | `3d3d5cc:index.html index.html` | `FAIL — 5 declaration(s) differ, 0 markup problem(s), 0 unmatched` — 10 pairs / 2 elements |

`toast-hit`'s FAIL-5 is the expected, correct result (the deliberate 2026-08-24 `pointer-events`
fix), not a regression: `grep -c "✗ #toast:"` = **0**, so the app-side `#toast` rule has no diff at
all; all 5 differing declarations are on `#toastUndo`, each reading
`before: (unset)` → `after: auto <- .toast-act`.

Restore preconditions, run before touching the tree:

```
git log -1 --format="%h %an <%ae> %ad %s" 2eda89e
  -> 2eda89e PHANTOM AUTOPILOT <autopilot@phantom.local> Thu Sep 3 00:11:54 2026 +0700
     chore: round 2026-09-03_0007 no-op -- five channels checked, no owner answer
git merge-base --is-ancestor 3503537 2eda89e   -> ancestor-ok
git diff --diff-filter=D --name-only HEAD 2eda89e -> (empty)
git diff --stat 2eda89e -- .                   -> (empty, after restore)
```

Author is the runner, so this tip is the previous round's own commit, not an owner answer.

Five channels:

1. `grep -c "| Option | Cost |" README.md` = **8**, `grep -c "If you answer:" README.md` = **8**
   — the two counters agree, which is the "nobody answered" signal. Run *after* the restore.
2. `git ls-files | grep -i jspdf` — empty.
3. `main` / `mac/main` / `origin` / `origin/main` = `ef3220e` (2026-06-27) — unmoved.
4. `git status --untracked-files=all --short` — empty.
5. Non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest of
   the group), `mac`/`mac/design-system` = `e3a355c` (2026-07-20), `hardening-pass` (only
   `origin/` + `mac/`) = `592e7c3` (2026-07-20). Nothing newer than 2026-08-13.

Tip selection — both formulas run live, labelled:

```
(a) pipeline :short (retired)          (c) :iso8601 (the one actually used)
2026-09-03 2eda89e _0007  <- right, but only because the day rolled over
2026-09-02 facbf71 _0036               2026-09-03 00:11:54 2eda89e _0007  correct
2026-09-02 e66cdf6 _0029               2026-09-02 00:52:48 75f48e3 _0047
2026-09-02 b791ace _0015               2026-09-02 00:46:25 facbf71 _0036
2026-09-02 98e4380 _0002               2026-09-02 00:34:05 e66cdf6 _0029
2026-09-02 75f48e3 _0047  <- real end-of-day tip, ranked 6th of 6
2026-09-02 3716e2b _0022               2026-09-02 00:27:22 3716e2b _0022
```

Six tips now share `2026-09-02`, so `:short` ties all six and the sha fallback orders them
`f` > `e` > `b` > `9` > `7` > `3`, sinking `75f48e3` (`_0047`, 00:52:48) five places. Cross-checked
the winner by refname (`_0007` is the highest round number below my own `_0017`); `:iso8601` and
refname agree, and `head -16` showed 8 distinct tips with nothing clipped.

## What I did NOT do

- **Did not answer any open decision.** All 8 remain open; each moves pixels or adds a file.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte. The only
  changed files are `AUTOPILOT.md` and `SUMMARY.md`.
- **Did not add a 7th token check** and did not add the harness to Verify — both explicitly
  forbidden in the Next task block.
- **Did not restore `docs/design-parity.md`** (decision 8) — still reachable at
  `c3351fc:docs/design-parity.md`, but restoring it is the owner's call.
- **Did not re-run the retrospective restore audit** (closed in `2026-08-31_0023`).
- **Did not retry the browser MCPs.** They are permission-blocked, not merely headless
  (decision 4); retrying costs a round and changes nothing.
- **Did not trim `AUTOPILOT.md`**, now ~1,580 lines and 30 status blocks. Deleting round history
  is discarding evidence, so it is an owner decision. It is recorded as a note, not a 9th
  decision, because it blocks no acceptance criterion.

## Risk

- 🔴 **The `:short` trap now has its worst recorded case, and it fires *invisibly*.** This round's
  live output ranked the correct tip first, so a round reading only row 1 would conclude the
  formula is safe. It is not — one row down it inverted a six-way tie by five places. **From the
  next round on, `2026-09-03` will hold two or more tips, so the rollover will no longer mask it.**
  Restoring the wrong sibling is undetectable downstream: the residual `git diff --stat` against
  the *wrong* tip is empty, all five harness keys still match, and all three Verify stages stay
  green, because no-op rounds touch only `AUTOPILOT.md`/`SUMMARY.md`. Use `:iso8601` + `head -16`
  and confirm by refname, never by row number.
- ⚠️ **`ds-disabled-hover` reports 1 undecidable rule** (`.pui-menu__item:last-child` — the harness
  cannot read structural pseudo-classes). Its PASS says nothing about that rule; a change confined
  to it computes 0 diff. Identical in both versions this round, but it must be read by hand.
- ⚠️ **Nothing has ever been verified in a real browser** (decision 4). Every parity claim in this
  repo rests on source reading plus the cascade harness. The harness also does not model
  inheritance, and jsdom does no hit testing — so no checker in this repo can see a `:hover` or
  `pointer-events` regression.
- ⚠️ **`main` is still `ef3220e` and nothing has ever been merged.** 57+ `auto/*` branches now
  stack in parallel, each one path-restoring its predecessor. The chain was audited once and is
  sound, but it is a fragile way to carry three weeks of work.
- The stall is now 3+ weeks old and has crossed a month boundary. It will not clear on its own —
  it needs a person to answer `README.md → ## Open decisions`, not another round.
