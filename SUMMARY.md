# Round 2026-09-14_0012 — no-op (no owner answer)

## What I did

- **Restored the previous round's tip `989c1e8` (`…/2026-09-14_0002`) onto the stale base.**
  `git log --oneline -1` showed `3503537` — the round-1 contract commit — so the runner still cuts
  every `auto/*` branch from the contract commit rather than from the last tip. Restored as its own
  forward commit (`0b474f7`). **Proof:** `git diff --stat 989c1e8 0b474f7` printed nothing at all —
  a commit-to-commit comparison, so the restored tree matches the tip on every tracked path at once,
  not merely "the rows that printed looked equal". (`design-system/node_modules` is untracked —
  `git ls-files` on it returns nothing — so no pathspec exclusion was needed.)
- **Checked all five owner-answer channels — every one is silent.** Details under Verification.
- **Ran the full three-stage Verify plus all five harness keys.** Every number matches the documented
  expectation exactly, including `toast-hit`'s intended FAIL.
- **Resolved round `_0002`'s tip-selection forecast with a live A/B: *heads*, forecast correct, and
  for once the head is *structural* rather than lucky** (see Risk).
- Only the `## Next task` block of `AUTOPILOT.md` was edited (`git diff --numstat` = `26 1`); no
  `> **สถานะล่าสุด …` block was appended, following the convention started at round `_0035`.

## Why

- **The no-op is the contract's instruction, not a fallback I chose.** `## Next task` (line 340 of
  the restored `AUTOPILOT.md`) says: if no open decision has been answered, restore the previous tip,
  check the five channels, run Verify plus all five harness keys, write SUMMARY, end the round — and
  explicitly forbids inventing other work (`ห้ามประดิษฐ์งานอื่นเด็ดขาด`). All eight decisions in
  `README.md` are still unanswered.
- **`## Next task` arrived empty in the prompt again**, for the same structural reason: the section
  begins at line 340 of the restored `AUTOPILOT.md`, which `wc -l` puts at 3,218 lines, so the
  prompt truncates it away. The copy of
  `AUTOPILOT.md` sitting on the stale base is round 1's, whose Next task reads "add tokens to
  `index.html`" — work finished weeks ago that the contract's own acceptance criteria already mark
  done. Acting on the prompt's visible contract would have redone finished work. I read the real task
  out of the **restored** file (Grep for `^## Next task` → line 340 → Read at that offset; the file
  is ~400 KB, so a whole-file Read is refused).
- **`git checkout <tip> -- .` + a plain commit, not `merge --ff-only` / `read-tree` / `restore
  --source=`** — the others are all permission-blocked here. `git status --short` after the checkout
  showed only `M`/`A` rows and **no `D` rows**, which is the precondition that makes a path-checkout
  equivalent to a fast-forward; the empty `git diff 989c1e8` then closes the hole conclusively.
- **The `ds-disabled-hover` before-side reads `989c1e8`, the tip I restored this round** — not a sha
  copied out of an older block, which the contract explicitly warns against.
- **Tip chosen with `--sort=-committerdate` plus a date-major refname cross-check**, never
  `%(committerdate:short) | sort -r`. This round the two forms happen to agree at row 1, but only
  because the top day-group has a single member — the same output still shows the broken form
  mis-ordering the `2026-09-13` group (see Risk).

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
| `ds-disabled-hover` (`989c1e8:…/styles.css` → worktree) | 15 / 3 | PASS + **1 undecidable** |
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
correct  --sort=-committerdate          → row 1 = 989c1e8  _0002  ✓ (restored)
wrong    %(committerdate:short)|sort -r → row 1 = 989c1e8  _0002  ✓ (agrees — no tie to mis-break)
```

The broken form still mis-orders the group below: `2026-09-13` comes out `e693761` → `a70036f` →
`6b787ea` → `459dd24`, i.e. sha-descending, with that day's real tip (`a70036f`, `_0037`) in row 3.

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

## Risk

- ✅ **The tip-selection bug came up heads this round — but structurally, not because the broken
  formula works.** Measured, not inferred: `2026-09-14` had exactly one tip (`989c1e8`) when this
  round started, so there was no tie for a sha-descending secondary sort to mis-break, and both
  forms return the same row 1. The same command output still shows the bug alive one group down (the
  `2026-09-13` block is sorted by sha, putting `_0006` above `_0037`). Cumulative record of the wrong
  formula: **tails 15 of 26**, with 4 of the heads won by luck and 3 (including this one) by
  structure.
- 🔴 **The ratchet returns next round, at ~59.6%.** When this round closes, `2026-09-14` will hold two
  tips, so the comparand becomes `989c1e8` and the next round's closing sha must exceed it lexically:
  `0x989c1e8 / 0x10000000` ≈ 0.596 tails. **Do not read the drop from 90.1% as improvement** — the
  comparand fell only because the day rolled over and `e693761` sank into the second group. Damage if
  the wrong formula is used next round is 1 round (`AUTOPILOT.md` + `SUMMARY.md`), not code.
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
