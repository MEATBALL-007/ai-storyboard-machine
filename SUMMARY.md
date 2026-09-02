# Round 2026-09-03_0025 — no-op (no owner answer on any of the 8 open decisions)

## What I did

- **Restored the previous round's tree.** The branch was cut from the stale base `3503537`
  again (58th round running). Path-restored tip `8cc03f4` (`…/2026-09-03_0017`) as its own
  commit `bf994c1` (13 `M` + 3 `A`, no `D`); residual `git diff --stat 8cc03f4` is empty.
- **Checked all five owner-answer channels — nothing has been answered.** Both README counters
  read 8 and agree, no `jspdf` file, no untracked drop, `main` still `ef3220e`, and no non-`auto/*`
  ref newer than 2026-08-13.
- **Ran the full Verify (3 stages) and all five harness keys.** Every number matches the expected
  table exactly. No source file was touched.
- **Corrected the previous round's 🔴 `:short` risk note, with a live A/B.** The trap is *not* in
  the `:short` token as such — it is in using the truncated date as the **sort key** in a shell
  pipeline. `--sort=-committerdate` with `:short` as a *display* format is exact. Details below.
- Updated `AUTOPILOT.md` (new status block + corrected tip-selection guidance) and overwrote this
  file. Nothing else changed: `index.html`, `design-system/`, `tools/` and `docs/` are
  byte-identical to `8cc03f4`.

## Why

The queued Next task is explicit: if no decision has been answered, restore the tip, check the five
channels, run Verify plus the five harness keys, write SUMMARY, end the round — and invent nothing
else. Fallback work that touches code is exhausted (token tooling is 22/22 across six checks, the
parity table is closed at 11/11), and the last read-only fallback closed in `2026-08-31_0023`.

The one judgement call: I spent two extra Bash calls on the `:short` question. The previous round
raised it to 🔴 and predicted it would start firing invisibly *this* round, and my very first
command of the round was a `--sort=-committerdate` + `:short`-display listing — exactly the shape
the note appeared to condemn. I could not both follow that warning and use the command I had
already run, so I resolved it with evidence instead of leaving a contradiction in the record. The
result changes the guidance for every future round, so it was worth the calls.

## Verification

Verify command — all three stages green:

```
node tools/test.mjs          -> 54 passed, 0 failed
node tools/check-tokens.mjs  -> tokens 22/22 · fonts 4/4 · no derived-colour literals ·
                                font weights available · no radius literals ·
                                typeface from one source   (6/6 checks, 15 CSS sources)
npm --prefix design-system test -> 12 test files, 31 passed
```

`docs/btn-parity-proof.mjs` — all five keys, exact commands run, counts read from this run:

| key | command | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | PASS — 85 pairs / 17 elements |
| `segmented` | `021b966:index.html index.html` | PASS — 45 pairs / 9 elements |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | PASS — 5 pairs / 1 element |
| `ds-disabled-hover` | `8cc03f4:design-system/src/styles.css design-system/src/styles.css` | PASS — 15 pairs / 3 elements, **+1 undecidable** (`.pui-menu__item:last-child`) |
| `toast-hit` | `3d3d5cc:index.html index.html` | `FAIL — 5 declaration(s) differ, 0 markup problem(s), 0 unmatched` — 10 pairs / 2 elements |

`toast-hit`'s FAIL-5 is the expected, correct result (the deliberate 2026-08-24 `pointer-events`
fix), not a regression: `grep -c "✗ #toast:"` = **0**, so the app-side `#toast` rule has no diff at
all. `ds-disabled-hover`'s before-side was read from the tip I actually restored this round
(`8cc03f4`), not copied from an older status block.

Restore preconditions, run before touching the tree:

```
git log -1 --format="%h %s" 8cc03f4
  -> 8cc03f4 chore: round 2026-09-03_0017 no-op -- five channels checked, no owner answer
git merge-base --is-ancestor 3503537 8cc03f4    -> ancestor-ok (YES)
git diff --name-status HEAD 8cc03f4             -> 13 M + 3 A, no D
git diff --stat 8cc03f4                         -> (empty, after restore)
```

Author is the runner, so this tip is the previous round's own commit, not an owner answer.

Five channels:

1. `grep -c "| Option | Cost |" README.md` = **8**, `grep -c "If you answer:" README.md` = **8**
   — the two counters agree, which is the "nobody answered" signal. Run *after* the restore.
   All 8 headings still present and unedited (`### 1.` … `### 8.`).
2. `git ls-files | grep -i jspdf` — empty.
3. `main` / `mac/main` / `origin` / `origin/main` = `ef3220e` (2026-06-27) — unmoved.
4. `git status --untracked-files=all --short` — empty.
5. Non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest of
   the group), `mac`/`mac/design-system` = `e3a355c` (2026-07-20), `mac/hardening-pass`/
   `origin/hardening-pass` = `592e7c3` (2026-07-20). Nothing newer than 2026-08-13.

### Tip selection, and the `:short` correction

Selected `8cc03f4` by `:iso8601` full-precision rank, cross-checked by refname (`_0017` is the
highest round number below my own `_0025`). Both agree. As the previous round predicted, the
day-rollover no longer separates the candidates — `2026-09-03` now holds two tips pre-restore
(`8cc03f4`, `2eda89e`) and three post-restore.

The previous round recorded a 🔴 claiming `:short` inverted `2026-09-02` by five places. **That
inversion is real, but the cause was misattributed.** Both variants run live this round, with my
own branch excluded to reconstruct the pre-restore state:

```
A: git for-each-ref --sort=-committerdate --format='%(committerdate:short) …'
   2026-09-03 8cc03f4 _0017      <- correct
   2026-09-02 75f48e3 _0047      <- correct, 00:52:48 really is that day's tip
   2026-09-02 facbf71 _0036
   2026-09-02 e66cdf6 _0029
   2026-09-02 3716e2b _0022
   2026-09-02 b791ace _0015

B: git for-each-ref --format='%(committerdate:short) …' | sort -r
   2026-09-03 8cc03f4 _0017
   2026-09-02 facbf71 _0036
   2026-09-02 e66cdf6 _0029
   2026-09-02 b791ace _0015
   2026-09-02 98e4380 _0002
   2026-09-02 75f48e3 _0047      <- sunk 5 places, exactly as recorded
```

`--sort=-committerdate` sorts on the **real timestamp value**; `:short` in `--format` only
truncates what is *printed*. Variant A is therefore exact at full precision and is safe. The trap
lives only in variant B, where the truncated string becomes the actual sort key, ties six tips, and
falls back to sha order (`f` > `e` > `b` > `9` > `7` > `3`). The distinguisher is **sort key vs.
display format**, not the `:short` token. Guidance in `AUTOPILOT.md` updated accordingly.

Note both variants still ranked `_0017` first this round, so the trap did not fire at position 1 —
but in B that is now pure sha luck (`8` > `2`), no longer day granularity.

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
- **Did not re-audit past rounds' tip choices** in light of the `:short` correction. The audit in
  `2026-08-31_0023` compared tree shas directly and found every restore correct, so its conclusion
  does not depend on which ranking formula was used.
- **Did not trim `AUTOPILOT.md`**, now ~1,600 lines. Deleting round history is discarding
  evidence, so it is an owner decision. Recorded as a note, not a 9th decision.

## Risk

- ⚠️ **The `:short` correction narrows the danger but does not remove it.** Any round that ranks
  tips through a shell `sort` on a truncated date is still exposed, and the failure is silent:
  restoring the wrong sibling leaves an empty residual `git diff --stat` against that wrong tip,
  all five harness keys still match, and all three Verify stages stay green, because no-op rounds
  touch only `AUTOPILOT.md`/`SUMMARY.md`. Always confirm by refname.
- ⚠️ **After the restore commit, this branch sorts to row 1** under either variant. Never select a
  tip by row number — the top row is your own branch.
- ⚠️ **`ds-disabled-hover` reports 1 undecidable rule** (`.pui-menu__item:last-child` — the harness
  cannot read structural pseudo-classes). Its PASS says nothing about that rule; a change confined
  to it computes 0 diff. Identical in both versions this round, but it must be read by hand.
- ⚠️ **Nothing has ever been verified in a real browser** (decision 4). Every parity claim in this
  repo rests on source reading plus the cascade harness. The harness also does not model
  inheritance, and jsdom does no hit testing — so no checker in this repo can see a `:hover` or
  `pointer-events` regression.
- ⚠️ **`main` is still `ef3220e` and nothing has ever been merged.** 58+ `auto/*` branches now
  stack in parallel, each one path-restoring its predecessor. The chain was audited once and is
  sound, but it is a fragile way to carry three weeks of work.
- The stall is now 3+ weeks old and has crossed a month boundary. It will not clear on its own —
  it needs a person to answer `README.md → ## Open decisions`, not another round.
