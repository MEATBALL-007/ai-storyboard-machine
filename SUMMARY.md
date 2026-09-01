# Round 2026-09-02_0029 — SUMMARY

## What I did

- **Restored the previous round's tip `3716e2b`** (branch `…/2026-09-02_0022`) onto the stale base
  `3503537` the runner cut this branch from, as its own commit (`2908ddc`, 13 `M` + 3 `A`, no `D`).
  `git diff --stat 3716e2b -- .` is empty afterwards → the tree matches byte for byte.
- **Checked all five owner-answer channels. None has been answered — all 8 open decisions stand.**
  This is therefore a no-op round: I did not touch `index.html`, `design-system/`, `tools/` or
  `docs/` by a single byte. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full three-stage Verify plus all five `btn-parity-proof.mjs` keys**, every number
  matching the expected table (details under Verification).
- **Recorded a new, materially worse instance of the `:short` ranking trap** in `AUTOPILOT.md`:
  this round the retired formula not only tied at position 1, it resolved **wrongly**, and the real
  tip sank *two* places rather than one. Both formulas were run as live commands, not inferred.

## Why

The queued Next task says plainly: if no owner decision has been answered, check the five channels,
write SUMMARY, and end the round — do not invent substitute work. Code-touching fallback work was
exhausted at round `_0102`, and the last read-only fallback (the retrospective restore audit) was
closed at `2026-08-31_0023`. Every remaining acceptance criterion is gated on a decision that moves
pixels or adds a file to the repo, which is the owner's call and not an agent's.

The one thing worth writing down this round is the ranking evidence. Earlier rounds observed the
`:short` tiebreak firing and *happening to agree* with the clock, and warned that this must never be
read as the trap being gone. This round settles that argument with a counter-example: it fired and
disagreed. Live output, my own branch filtered out:

```
:short (retired)                    :iso8601 (used)
2026-09-02 b791ace _0015   ← wrong  2026-09-02 00:27:22 3716e2b _0022   ← correct
2026-09-02 98e4380 _0002            2026-09-02 00:20:38 b791ace _0015
2026-09-02 3716e2b _0022   ← real   2026-09-02 00:12:43 98e4380 _0002
2026-09-01 ec1d48b _0001      tip   2026-09-01 00:47:10 460f6e2 _0042
```

Three tips now share `2026-09-02`, so day granularity ties all three and `sort -r` falls through to
the opaque sha string, where `b`(0x62) and `9`(0x39) both outrank `3`(0x33). Restoring line 1 would
have reverted round `_0022` — silently, since `_0022` was itself a no-op touching only
`AUTOPILOT.md`/`SUMMARY.md`, so the residual `git diff --stat` against the wrong tip would be empty
and all three Verify stages and all five harness keys would still be green.

## Verification

Verify command (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`)
— **all three stages green**:

- `54 passed, 0 failed`
- `check-tokens` 6/6 checks: tokens 22/22 in sync · fonts 4/4 byte-identical · no derived-colour
  literals · every font-weight one of 400/500/700/800 · every `border-radius` reads a `--r-*` token
  · every `font-family` reads `var(--mono)` — all at **15 CSS sources**
- `Test Files 12 passed (12) · Tests 31 passed (31)`

Harness, sha pairs copied from `AUTOPILOT.md:1318-1322` (never guessed); counts read from **this
round's own output**, not transcribed:

| key | pair pinning | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | PASS — 85 pairs / 17 elements, markup 7 gone / 5 new |
| `segmented` | `021b966:index.html index.html` | PASS — 45 / 9, markup 0 gone / 3 new |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | PASS — 5 / 1, markup 0 / 1 |
| `toast-hit` | `3d3d5cc:index.html index.html` | `FAIL — 5 declaration(s) differ`, 10 / 2, 0 markup problems, 0 unmatched |
| `ds-disabled-hover` | `3716e2b:…/styles.css …/styles.css` | PASS — 15 / 3 from 14 assembled files, + 1 undecidable rule |

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

- `git merge-base --is-ancestor 3503537 3716e2b` → `ancestor-ok`
- `git diff --diff-filter=D --name-only HEAD 3716e2b` → **empty** (path-checkout is equivalent to a
  fast-forward only when the diff deletes no file)
- `git log -1 --format="%h %an <%ae> %ad %s" 3716e2b` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, subject `chore: round 2026-09-02_0022 no-op -- five channels checked,
  no owner answer` → the runner wrote this tip, not the owner
- local and `origin/` both point at `3716e2b`

Five channels, all negative:

1. `grep -c "| Option | Cost |" README.md` = **8** (run *after* the restore) — all 8 decisions still
   carry their option table, i.e. none answered
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

## Risk

- **Nothing in this round changes what a user sees.** A reviewer should expect the diff to be
  exactly two files (`AUTOPILOT.md`, `SUMMARY.md`) on top of the restore commit, and should be
  suspicious if it is not.
- **The restore commit `2908ddc` is large and is not this round's work** — it is round `_0022`'s
  tree replayed onto the stale base the runner keeps cutting from. Review the round's *second*
  commit, not the first.
- **`toast-hit` exits non-zero by design.** Any automation that treats a non-zero harness exit as a
  gate will hold this PR back incorrectly. The harness is deliberately *not* part of the Verify
  command for this reason.
- **The underlying stall is now a calendar month old and will not clear on its own.** It needs a
  person to answer at least one decision in `README.md → ## Open decisions`. Rounds will keep
  producing correct, green, empty results until then.
- **The `:short` near-miss documented above is the standing hazard in this repo's process**, not a
  code risk. Any future round that ranks round tips by `%(committerdate:short)` — or picks a tip by
  *row position* rather than by matching the refname — can silently revert completed work with every
  downstream check still passing.
