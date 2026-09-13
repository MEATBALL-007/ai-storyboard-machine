# Round 2026-09-14_0002 — no-op (no owner answer)

## What I did

- **Restored the previous round's tip `a70036f` (`…/2026-09-13_0037`) onto the stale base.**
  `git log --oneline -1` showed `3503537` — the round-1 contract commit — so the runner still cuts
  every `auto/*` branch from the contract commit rather than from the last tip. Restored as its own
  forward commit (`b6313cc`). **Proof:** `git diff a70036f --stat` printed nothing at all, so the
  working tree matches the tip on every path at once — not merely "the rows that printed looked
  equal".
- **Checked all five owner-answer channels — every one is silent.** Details under Verification.
- **Ran the full three-stage Verify plus all five harness keys.** Every number matches the documented
  expectation exactly, including `toast-hit`'s intended FAIL.
- **Resolved round `_0037`'s tip-selection forecast with a live A/B: *tails*, forecast correct, and
  the damage case reached three whole rounds** (see Risk).
- Did **not** append a `> **สถานะล่าสุด …` block, following the convention started at round `_0035`.
  Only the `## Next task` block of `AUTOPILOT.md` was edited (+30 lines, 1 line changed).

## Why

- **The no-op is the contract's instruction, not a fallback I chose.** `## Next task` (line 340 of
  the restored `AUTOPILOT.md`) says: if no open decision has been answered, restore the previous tip,
  check the five channels, run Verify plus all five harness keys, write SUMMARY, end the round — and
  explicitly forbids inventing other work (`ห้ามประดิษฐ์งานอื่นเด็ดขาด`). All eight decisions in
  `README.md` are still unanswered.
- **`## Next task` arrived empty in the prompt again**, for the same structural reason: the section
  begins at line 340 of a ~3,160-line `AUTOPILOT.md`, so the prompt truncates it away. The copy of
  `AUTOPILOT.md` sitting on the stale base is round 1's, whose Next task reads "add tokens to
  `index.html`" — work finished weeks ago that the contract's own acceptance criteria already mark
  done. Acting on the prompt's visible contract would have redone finished work. I read the real task
  out of the **restored** file (Grep for `^## Next task` → line 340 → Read at that offset; the file
  is ~400 KB, so a whole-file Read is refused).
- **`git checkout <tip> -- .` + a plain commit, not `merge --ff-only` / `read-tree` / `restore
  --source=`** — the others are all permission-blocked here. `git status --short` after the checkout
  showed only `M`/`A` rows and **no `D` rows**, which is the precondition that makes a path-checkout
  equivalent to a fast-forward; the empty `git diff a70036f` then closes the hole conclusively.
- **The `ds-disabled-hover` before-side reads `a70036f`, the tip I restored this round** — not a sha
  copied out of an older block, which the contract explicitly warns against.
- **Tip chosen with `--sort=-committerdate` plus a date-major refname cross-check**, never
  `%(committerdate:short) | sort -r`. This round that choice was load-bearing, not ceremonial: the
  two forms disagree at row 1 (see Risk).

## Verification

**Verify command — green on all three stages:**

| Stage | Result |
|---|---|
| `node tools/test.mjs` | `54 passed, 0 failed` |
| `node tools/check-tokens.mjs` | 6/6 checks, `22/22` tokens, `4/4` fonts, **15 CSS sources** |
| `npm --prefix design-system test` | `12 passed (12)` files, `31 passed (31)` tests |

**All five harness keys match the documented table exactly:**

| Key | Pairs / elements | Verdict |
|---|---|---|
| `buttons` (`2488f2d:index.html` → worktree) | 85 / 17 | PASS |
| `segmented` (`021b966:index.html` → worktree) | 45 / 9 | PASS |
| `toast` (`de07ea8` → `10e8f39`, **both sides pinned**) | 5 / 1 | PASS |
| `ds-disabled-hover` (`a70036f:…/styles.css` → worktree) | 15 / 3 | PASS + **1 undecidable** |
| `toast-hit` (`3d3d5cc:index.html` → worktree) | 10 / 2 | **FAIL — 5** (intended) |

`toast-hit` was read with `grep "^✗"`, which lists whole rows rather than counting a substring (the
older `grep -c "✗ #toast:"` idiom has a blind spot: the base-state row prints `✗ #toastUndo (base)`,
with no colon). All five rows are `#toastUndo` — `(base)`, `:hover`, `:disabled`, `:disabled:hover`,
`:focus` — and **none is `#toast`**, which is the evidence that `#toast` still carries its
`pointer-events:none`. The single `ds-disabled-hover` undecidable is the known
`.pui-menu__item:last-child` rule (structural pseudo).

**Five owner-answer channels — all silent:**

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `grep -c "\| Option \| Cost \|"` = **8**, `grep -c "If you answer:"` = **8** — both counters agree, so nothing was answered. Run **after** the restore; on the stale tree it returns 0. |
| 2 | `jspdf.umd.min.js` in the repo | `git ls-files \| grep -i jspdf` → no output (decision 1 still unanswered) |
| 3 | `main` | still `ef3220e` (2026-06-27) |
| 4 | untracked drop | `git status --untracked-files=all --short` → clean |
| 5 | non-`auto/*` refs | newest is `3503537` / `design-system` (2026-08-13); `mac*` refs at 2026-07-20, `main` at 2026-06-27 — nothing newer than this work |

**Tip selection, measured live** (the `refs/remotes/origin/auto/…` set does not yet contain this
round's branch, so no self-filtering was needed):

```
correct  --sort=-committerdate          → row 1 = a70036f  _0037  ✓ (restored)
wrong    %(committerdate:short)|sort -r → row 1 = e693761  _0006  ✗ (three rounds stale)
```

## What I did NOT do

- **Did not answer any open decision.** Each of the eight moves pixels or adds a file to the repo,
  so each is the owner's call; the contract forbids an agent deciding them.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`.** This round's only
  content-bearing edits are `SUMMARY.md` and the `## Next task` block of `AUTOPILOT.md`.
- **Did not re-try the browser MCPs** (Playwright / Chrome-DevTools). They are *permission*-blocked,
  not merely headless-blocked — that is decision 4, and retrying burns a round for nothing.
- **Did not restore `docs/design-parity.md`** (still reachable at `c3351fc:docs/design-parity.md`) —
  that is decision 8.
- **Did not trim `AUTOPILOT.md`**, even though its size is precisely why `## Next task` reaches the
  prompt empty. Deleting round history is discarding evidence and is an owner decision.
- **Did not add a seventh token check** or add the parity harness to the Verify command; both are on
  the contract's explicitly-forbidden list.
- **Did not append this round to the convention list at `AUTOPILOT.md:622`.** The four `2026-09-13`
  rounds all skipped it too, so the list has been stale for a while; re-syncing it is history
  editing, not this round's task.

## Risk

- 🔴 **The tip-selection bug came up tails a third consecutive time, and the damage case has now
  reached three rounds.** Measured this round, not inferred: the sha-first form puts `e693761`
  (`_0006`) at row 1, while the real tip is `a70036f` (`_0037`). Restoring row 1 would have silently
  discarded `_0016`, `_0027` **and** `_0037` — `git diff --stat e693761 a70036f` = 2 files,
  148+/98−. Nothing downstream would have caught it: all three were no-op rounds touching only
  `AUTOPILOT.md`/`SUMMARY.md`, so the residual diff against the wrong tip is empty, all five harness
  keys still match, and all three Verify stages stay green. Cumulative record of the wrong formula:
  **tails 15 of 25**.
- ✅ **Next round is structurally safe — risk 0, and for once not by luck.** This round's closing tip
  is dated `2026-09-14` and will be the only tip on that day, so next round's top day-group has a
  single member and there is no tie for the broken formula to mis-break. **Do not read this as the
  bug being fixed** — it is the shape of the data, not the formula. The ratchet returns the moment a
  *second* round closes on `2026-09-14`, with the comparand reset to this round's closing sha.
  Keep using `--sort=-committerdate`; a date-major refname cross-check is the only safe secondary.
- ⚠️ **`toast-hit`'s `FAIL — 5` is the correct result, not a regression.** It is easy to misread two
  ways: the count is identical to what a mis-pinned `toast` run produces, and the harness exits
  non-zero. Tell them apart by the line `after : auto <- .toast-act`.
- ⚠️ **`toast-hit`'s `0 markup problem(s)` proves nothing this round.** No class moved, so that phase
  is vacuously green; only the cascade rows carry information.
- ⚠️ **Still no browser verification of `index.html`, ever** (decision 4), and PDF export still
  depends on the cdnjs jsPDF tag at line 7, so the `file://` criterion is not met offline
  (decision 1). Both are unchanged by this round and remain the two criteria a person must unblock.
- ⚠️ **The stall is now 5+ weeks old across 100+ branches cut from `3503537`.** Nothing in this
  repository will advance without an owner answering a decision; further rounds can only re-verify.
