# Round 2026-09-02_0047 — SUMMARY

## What I did

- **Restored the previous round's tip `facbf71`** (branch `…/2026-09-02_0036`) onto the stale base
  `3503537` the runner cut this branch from, as its own commit (`79dd843`, 13 `M` + 3 `A`, no `D`).
  `git diff --stat facbf71 -- .` is empty afterwards → the tree matches byte for byte.
- **Checked all five owner-answer channels. None has been answered — all 8 open decisions stand.**
  This is therefore a no-op round: I did not touch `index.html`, `design-system/`, `tools/` or
  `docs/` by a single byte. Only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Ran the full three-stage Verify plus all five `btn-parity-proof.mjs` keys**, every number
  matching the expected table (details under Verification).
- **Found a new failure mode in the tip-ranking command that is *not* the `:short` trap:**
  `| sort -r | head -8` can now clip the real tip out of view, because `for-each-ref refs/heads
  refs/remotes` emits **two rows per tip** (local + `origin/`). Recorded in `AUTOPILOT.md`.
- **Corrected a stale secondary counter**: `grep -c "If you answer:" README.md` is **8**, not the
  7 the standing notes claim. Both channel-1 counters now agree at 8.

## Why

The queued Next task says plainly: if no owner decision has been answered, check the five channels,
write SUMMARY, and end the round — do not invent substitute work. Code-touching fallback work was
exhausted at round `_0102`, and the last read-only fallback (the retrospective restore audit) was
closed at `2026-08-31_0023`. Every remaining acceptance criterion is gated on a decision that moves
pixels or adds a file to the repo, which is the owner's call and not an agent's.

The finding worth writing down this round is about **result truncation, not sort order**. The
standing guidance is to rank round tips with:

```
git for-each-ref --format="%(committerdate:iso8601) %(objectname:short) %(refname:short)" \
  refs/heads refs/remotes | grep "auto/deep_dive" | sort -r | head -8
```

`:iso8601` makes the sort a total order, so the *ranking* is correct by construction. But the query
scans `refs/heads` **and** `refs/remotes`, and every round tip exists in both — so each tip consumes
two output rows. With `head -8` that is a window of only **four distinct tips**. Five rounds now
share `2026-09-02`, so my own output already could not show them all: `_0002` was clipped off the
bottom. Verbatim, exactly as it printed:

```
2026-09-02 00:46:25 +0700 facbf71 origin/auto/…/2026-09-02_0036   ← real tip
2026-09-02 00:46:25 +0700 facbf71 auto/…/2026-09-02_0036          ← same tip, second row
2026-09-02 00:34:05 +0700 e66cdf6 origin/auto/…/2026-09-02_0029
2026-09-02 00:34:05 +0700 e66cdf6 auto/…/2026-09-02_0029
2026-09-02 00:27:22 +0700 3716e2b origin/auto/…/2026-09-02_0022
2026-09-02 00:27:22 +0700 3716e2b auto/…/2026-09-02_0022
2026-09-02 00:20:38 +0700 b791ace origin/auto/…/2026-09-02_0015
2026-09-02 00:20:38 +0700 b791ace auto/…/2026-09-02_0015
                                        (_0002 clipped — window exhausted)
```

This round was safe because the real tip happened to sit in rows 1–2. It would **not** have been
safe had I run the command *after* committing the restore: my own branch would then hold the newest
`committerdate` and eat two more rows, pushing the window down to three prior tips. As same-day
round counts keep growing, this will bite. Use `head -16` or higher, or filter with
`grep -v "^origin/"` first. This is a distinct trap from the `:short` tie-break: there the ranking
is wrong; here the ranking is right and the answer is simply cut off the bottom of the output.

I did **not** run either `:short` formula this round, so this round contributes no new evidence
about the tie-break either way — I have said so explicitly in `AUTOPILOT.md` so a later round does
not mine it for a conclusion it cannot support. I selected the tip by `:iso8601` and cross-checked
it against the refname (`_0036` is the highest round number below my own `_0047`); the two methods
agree.

## Verification

Restore preconditions, all run before touching the tree:

- `git log --oneline -1` → `3503537` (stale base confirmed, as every round so far)
- `git log -1 --format="%h %an <%ae> %ad %s" facbf71` → `PHANTOM AUTOPILOT
  <autopilot@phantom.local> Wed Sep 2 00:43:46 2026 +0700 chore: round 2026-09-02_0036 no-op --
  five channels checked, no owner answer` → the runner's own commit, not an owner answer
- `git merge-base --is-ancestor 3503537 facbf71` → `ancestor-ok`
- `git diff --diff-filter=D --name-only HEAD facbf71` → **empty** (path-checkout is equivalent to a
  fast-forward; nothing can be stranded)
- after `git checkout facbf71 -- .`: `git diff --stat facbf71 -- .` → **empty**, tree identical

Verify command, all three stages green:

```
node tools/test.mjs         → 54 passed, 0 failed
node tools/check-tokens.mjs → 6/6 checks pass:
    tokens in sync: 22/22 … present and identical in index.html
    fonts in sync: 4/4 … embedded byte-identical in index.html
    no derived-colour literals: 15 CSS source(s) scanned
    font weights available: 15 CSS source(s) scanned (400, 500, 700, 800)
    no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
    typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)
npm --prefix design-system test → 12 test files, 31 passed (31)
```

All five harness keys, run with the sha pairs recorded in `AUTOPILOT.md`'s `**Verify:**` block
(never guessed), separated by `;` because `toast-hit` exits non-zero by design:

| key | command | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | 85 pairs / 17 elements — **PASS**, no undecidable |
| `segmented` | `021b966:index.html index.html` | 45 / 9 — **PASS**, no undecidable |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | 5 / 1 — **PASS**, no undecidable |
| `ds-disabled-hover` | `facbf71:…/styles.css …/styles.css` | 15 / 3 — **PASS** + 1 undecidable rule |
| `toast-hit` | `3d3d5cc:index.html index.html` | `FAIL — 5 declaration(s) differ, 0 markup problem(s), 0 unmatched` at 10 pairs / 2 elements |

`toast-hit`'s FAIL-5 is the **expected** result, not a regression: it measures the deliberate
`pointer-events:auto` fix from round `2026-08-24_0003`. The confirmation that the app side was not
touched is `grep -c "✗ #toast:"` → **0** (only `#toastUndo` rows differ, all five reading
`before: (unset) → after: auto <- .toast-act`). `ds-disabled-hover`'s single undecidable rule is
`.pui-menu__item:last-child` (structural pseudo, identical in both versions) — the harness reports
it itself, and the PASS says nothing about it.

Five owner-answer channels, all run **after** the restore where it matters:

1. `grep -c "| Option | Cost |" README.md` → **8** — all decisions still unanswered
   (secondary: `grep -c "If you answer:" README.md` → **8**, see the correction below)
2. `git ls-files | grep -i jspdf` → empty; `ls jspdf.umd.min.js` → `No such file or directory`
3. `main` = `ef3220e` (2026-06-27) — unmoved
4. `git status --untracked-files=all --short` → empty
5. non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest in the
   group), `mac`/`mac/design-system` = `e3a355c` (2026-07-20), `hardening-pass` (only as `origin/`
   and `mac/`) = `592e7c3` (2026-07-20), `main`/`mac/main`/`origin`/`origin/main` = `ef3220e`
   (2026-06-27). Nothing newer than 2026-08-13, i.e. older than all of this work.

## What I did NOT do

- **Did not answer, reword, reorder or delete any of the 8 open decisions.** Each moves pixels or
  adds a file; that is the owner's call. Decisions 2, 5 and 6 are the last three gaps in the
  element-parity criterion; 1 and 4 each gate one further criterion; 8 gates no criterion.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`.** `git status` for this
  round shows `AUTOPILOT.md` and `SUMMARY.md` only.
- **Did not pick up anything from the explicitly-forbidden list** in Next task: no `:last-child`/
  combinator matching in the harness, no adding the harness to Verify, no unilateral application of
  decisions 2/5/6/7.
- **Did not re-run the retrospective restore audit** (closed at `2026-08-31_0023`) and did not
  restore `docs/design-parity.md` from `c3351fc` — that is decision 8, unanswered.
- **Did not retry Playwright or Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying costs a round and changes nothing until decision 4 is answered.
- **Did not fix the `head -8` clipping in any committed command line** beyond documenting it — no
  script in the repo hardcodes that pipeline; it lives in the notes and in each round's own shell
  call, so the correction belongs in `AUTOPILOT.md`, which is where I put it.

## Risk

- **Nothing in this round can regress the product** — no source file changed. The harness keys and
  Verify were run to prove the *restore* was faithful, not to clear new work.
- **The `head -8` clipping I documented is a live, unfixed hazard for the next round**, and it is
  more dangerous than it looks because it is silent: the command succeeds, the ranking is correct,
  and the wrong tip simply appears at the top of a truncated list. A round that restores from it
  reverts every round in between, and *nothing downstream catches that* — the residual
  `git diff --stat <wrong-tip> -- .` is empty against the wrong tip, all five harness keys still
  match (no-op rounds touch only `AUTOPILOT.md`/`SUMMARY.md`, never CSS), and all three Verify
  stages stay green. The next round should use `head -16` or `grep -v "^origin/"`.
- **This round adds no evidence about the `:short` tie-break** because I did not run either form.
  A later round must not read this round's clean restore as support for any ranking formula.
- **The stall itself is the real risk, and it is not an agent-fixable one.** Every acceptance
  criterion that is still open is gated on decisions 1–7; no further analysis will move them. The
  repo has now produced consecutive no-op rounds across a calendar-month boundary. This needs a
  person to answer `README.md → ## Open decisions`.
- **`AUTOPILOT.md` is at 1,526 lines with 28 append-only historical status blocks** (`wc -l`,
  `grep -c` run after my edit). I followed the
  established convention and appended rather than trimming, but the file is now large enough that
  reading it costs real context, and its `## Next task` block can no longer be read with a single
  unbounded `Read`. Compacting the history is itself a judgment call about what evidence to discard,
  so I left it — but it is worth an owner's attention before it degrades a round's ability to read
  its own contract.
