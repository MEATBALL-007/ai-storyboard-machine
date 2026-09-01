# Round 2026-09-02_0036 — SUMMARY

## What I did

- **Restored the previous round's tip `e66cdf6`** (branch `…/2026-09-02_0029`) onto the stale base
  `3503537` the runner cut this branch from, as its own commit (`30d49b8`, 13 `M` + 3 `A`, no `D`).
  `git diff --stat e66cdf6 -- .` is empty afterwards → the tree matches byte for byte.
- **Checked all five owner-answer channels. None has been answered — all 8 open decisions stand.**
  This is therefore a no-op round: I did not touch `index.html`, `design-system/`, `tools/` or
  `docs/` by a single byte. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full three-stage Verify plus all five `btn-parity-proof.mjs` keys**, every number
  matching the expected table (details under Verification).
- **Established that the two `:short` formulas tie-break differently, and recorded both.** The
  pipeline form resolved *correctly by luck* at position 1 this round; the native
  `--sort=-committerdate:short` form sank the real tip to **4th** — the worst case recorded so far.

## Why

The queued Next task says plainly: if no owner decision has been answered, check the five channels,
write SUMMARY, and end the round — do not invent substitute work. Code-touching fallback work was
exhausted at round `_0102`, and the last read-only fallback (the retrospective restore audit) was
closed at `2026-08-31_0023`. Every remaining acceptance criterion is gated on a decision that moves
pixels or adds a file to the repo, which is the owner's call and not an agent's.

The thing worth writing down this round concerns the `:short` restore trap. **There are two
different `:short` commands in circulation in this repo, and they tie-break differently.** I ran the
native form; rounds `_0022`/`_0029` ran the pipeline form. All three rankings, run live this round:

```
(a) pipeline: --format='%(committerdate:short) …' | sort -r   ← what _0022/_0029 ran
2026-09-02 e66cdf6 _0029   ← lands on the CORRECT tip, by luck
2026-09-02 b791ace _0015
2026-09-02 98e4380 _0002
2026-09-02 3716e2b _0022

(b) native: --sort=-committerdate:short                        ← what I ran
2026-09-02 98e4380 _0002   ← wrong
2026-09-02 b791ace _0015
2026-09-02 3716e2b _0022
2026-09-02 e66cdf6 _0029   ← the real tip, 4th

(c) :iso8601 (used)
2026-09-02 00:34:05 e66cdf6 _0029   ← correct
2026-09-02 00:27:22 3716e2b _0022
2026-09-02 00:20:38 b791ace _0015
2026-09-02 00:12:43 98e4380 _0002
```

**I initially misread (b) against `_0029`'s recorded (a) output and concluded the sort was unstable
and that the earlier rounds' stated mechanism was wrong. That conclusion was incorrect and I have
removed it.** Form (a) is exactly sha-descending as those rounds described (`e` 0x65 > `b` 0x62 >
`9` 0x39 > `3` 0x33); the disagreement is because (a) and (b) are different commands, not because
either is nondeterministic. Form (b) tie-breaks by **refname ascending**, which for this repo's
`_NNNN` branch names is precisely reverse-chronological.

Both are unsafe, for opposite reasons this round: (a) happened to put the real tip first only
because `e` is the highest leading hex digit in the set, and (b) put it **4th** — the worst case
recorded. Restoring position 1 of (b) would have reverted **three** rounds (`_0015`, `_0022`,
`_0029`) in one step, and nothing downstream would have caught it: all three were no-ops touching
only `AUTOPILOT.md`/`SUMMARY.md`, so the residual `git diff --stat` against the wrong tip would
also be empty, and all three Verify stages and all five harness keys would still be green.

The operational rule is unchanged and is the reason I did not rely on either: use a key precise
enough that ties never form (`:iso8601`), then confirm the winner against a second independent
signal.

I picked the tip by `:iso8601` **and** independently by refname (`_0029` is the highest round number
below my own `_0036`). Both agree on `e66cdf6`.

## Verification

Verify command (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`)
— **all three stages green**:

- `54 passed, 0 failed`
- `check-tokens` 6/6 checks: tokens 22/22 in sync · fonts 4/4 byte-identical · no derived-colour
  literals · every font-weight one of 400/500/700/800 · every `border-radius` reads a `--r-*` token
  · every `font-family` reads `var(--mono)` — all at **15 CSS sources**
- `Test Files 12 passed (12) · Tests 31 passed (31)`

Harness, sha pairs read from the table at `AUTOPILOT.md:1360-1364` (never guessed); every count
below was read from **this round's own output**, including the markup-coverage lines:

| key | pair pinning | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | PASS — 85 pairs / 17 elements, markup 7 gone / 5 new |
| `segmented` | `021b966:index.html index.html` | PASS — 45 / 9, markup 0 gone / 3 new |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | PASS — 5 / 1, markup 0 gone / 1 new |
| `toast-hit` | `3d3d5cc:index.html index.html` | `FAIL — 5 declaration(s) differ`, 10 / 2, 0 markup problems, 0 unmatched |
| `ds-disabled-hover` | `e66cdf6:…/styles.css …/styles.css` | PASS — 15 / 3 from 14 assembled files, + 1 undecidable rule |

Two of those need reading correctly:

- **`toast-hit`'s FAIL-5 is the expected result, not a regression.** It records the deliberate
  2026-08-24 `pointer-events:auto` fix. The check that it is still *only* that fix is
  `grep -c "✗ #toast:"` = **0** — i.e. `#toast` itself shows no diff, proving `pointer-events:none`
  was never removed from the container. All 5 differing declarations are on `#toastUndo`
  (`pointer-events (unset) → auto <- .toast-act`) across its 5 states.
- **`ds-disabled-hover`'s PASS excludes `.pui-menu__item:last-child`**, which the harness reports as
  undecidable (structural pseudo it cannot read). A change confined to that rule would compute 0
  diff. Unchanged this round, since no `.css` was touched.

Restore preconditions, all run before touching the tree:

- `git merge-base --is-ancestor 3503537 e66cdf6` → `ancestor-ok`
- `git diff --diff-filter=D --name-only HEAD e66cdf6` → **empty** (path-checkout is equivalent to a
  fast-forward only when the diff deletes no file)
- `git log -1 --format="%h %an <%ae> %ad %s" e66cdf6` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, subject `chore: round 2026-09-02_0029 no-op -- five channels checked,
  no owner answer` → the runner wrote this tip, not the owner
- local and `origin/` both point at `e66cdf6`

Five channels, all negative:

1. `grep -c "| Option | Cost |" README.md` = **8** (run *after* the restore) — all 8 decisions still
   carry their option table. Cross-checked: all 8 still read `**If you answer:**` in the future
   tense, and no `answered`/`decided`/`resolved` marker appears anywhere in the file.
2. `git ls-files | grep -i jspdf` empty; `ls jspdf.umd.min.js` → no such file
3. `main` = `ef3220e` (2026-06-27), unmoved
4. `git status --untracked-files=all --short` empty
5. non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest of the
   group) · `mac`/`mac/design-system` = `e3a355c` (2026-07-20) · `hardening-pass` exists only as
   `origin/`+`mac/` = `592e7c3` (2026-07-20) · `main`/`mac/main`/`origin`/`origin/main` = `ef3220e`
   (2026-06-27). Nothing newer than 2026-08-13, i.e. older than all of this work.

## What I did NOT do

- **Did not answer, reword, reorder or delete any of the 8 open decisions.** Each moves visible
  pixels or adds a file; that is the owner's call.
- **Did not restore `docs/design-parity.md`** (still reachable at `c3351fc:docs/design-parity.md`,
  44,376 bytes). That is decision 8 itself.
- **Did not re-run the retrospective restore audit** — completed and closed at `2026-08-31_0023`.
- **Did not touch the three items Next task explicitly forbids**: implementing `:last-child` /
  combinator matching in the harness, adding the harness to the Verify command, or applying
  decisions 2/5/6/7 unilaterally.
- **Did not retry Playwright or Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless-blocked; retrying burns a round and changes nothing. That is decision 4.
- **Did not edit the `_0022`/`_0029` reference blocks' sha-byte explanation.** Having checked it
  against form (a), it is correct as written; my first reading that it was wrong did not survive
  running the pipeline command myself.

## Risk

- **Nothing in this round changes what a user sees.** A reviewer should expect the diff to be
  exactly two files (`AUTOPILOT.md`, `SUMMARY.md`) on top of the restore commit, and should be
  suspicious if it is not.
- **The restore commit `30d49b8` is large and is not this round's work** — it is round `_0029`'s
  tree replayed onto the stale base the runner keeps cutting from. Review the round's *second*
  commit, not the first.
- **`toast-hit` exits non-zero by design.** Any automation that treats a non-zero harness exit as a
  gate will hold this PR back incorrectly. The harness is deliberately *not* part of the Verify
  command for this reason.
- **The `_0022`/`_0029` reference blocks in `AUTOPILOT.md` describe form (a) without naming it as
  form (a).** Their sha-byte mechanism is correct, but a round that reads one of those blocks and
  then runs the *native* `:short` command will get an output that appears to contradict it — which
  is the trap I fell into for part of this round. This round's block names all three commands
  explicitly; earlier blocks do not.
- **The underlying stall is now a calendar month old and will not clear on its own.** It needs a
  person to answer at least one decision in `README.md → ## Open decisions`. Rounds will keep
  producing correct, green, empty results until then.
- **The restore-tip hazard is now materially worse than when it was first recorded.** With four tips
  on one day, one mis-ranked restore silently deletes three rounds, and every automated check in
  this repo still passes afterwards. Any future round that ranks tips by `%(committerdate:short)`,
  or picks a tip by *row position* rather than by matching the refname, can trigger it.
