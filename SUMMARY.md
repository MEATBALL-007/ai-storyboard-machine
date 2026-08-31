# SUMMARY — round `2026-09-01_0017`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

The one thing that makes this round worth reading: it is the **first recorded round where the
retired `%(committerdate:short)` ranking key would actually have restored the wrong tip.** Both
candidate tips share a calendar day, so the trap fires at position 1. Details under *Why*.

---

## What I did

- **Restored the previous round's tip** (`0b082ed`, branch `…/2026-09-01_0011`) into the working
  tree and committed it on its own as `21d12c9`. The runner cut this branch from `3503537` again,
  so the tree arrived without any of the design-system integration work — `ls tools` showed only
  `test.mjs` (no `check-tokens.mjs`), and `docs/` held only `superpowers/`.
- **Checked all five owner-answer channels.** None has been answered — table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys.** Every count is identical to the previous round, which is the
  independent confirmation that the restore was complete rather than merely byte-equal to a sha I
  picked.
- **Demonstrated the `:short`-vs-`:iso8601` ranking divergence on this round's own refs** (two
  commands, no files touched) — see *Risk*. This is a documentation finding, not a code change.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (on `3503537` the app's `:root` really is byte-identical to that commit's 11-token `tokens.css`).
  An earlier round read files off the stale base and concluded the token task was already done,
  wasting the round. So the first action was `git log --oneline -8`, with `ls tools` in the same
  call confirming the stale base; the first file read after that came from the restored tree.
- **🔴 This round IS a discriminating test of the ranking formula — unlike the previous two.**
  Rounds `_0001` and `_0011` both recorded that their top two tips fell on different calendar days,
  so `:short` would have ranked them correctly too and neither round separated the formulas. That
  is **not** the case here. Both newest tips are dated `2026-09-01`:

  ```
  :short  (retired key)          :iso8601 (key in use)
  2026-09-01 ec1d48b  _0001      2026-09-01 00:17:00 0b082ed  _0011   <- correct
  2026-09-01 0b082ed  _0011      2026-09-01 00:07:20 ec1d48b  _0001
  ```

  Under `:short` the dates tie, `sort -r` falls through to comparing the **sha string**, and
  `ec1d48b` wins because `e` (0x65) sorts above `0` (0x30). The old key would have restored
  `_0001`'s tip and **silently reverted round `_0011`** — and nothing downstream would have caught
  it, because `_0011` was itself a no-op that touched only `AUTOPILOT.md` and `SUMMARY.md`: the
  residual `git diff --stat <tip> -- .` would be empty against the wrong tip, all five harness keys
  would still match, and all three Verify stages would still be green. I reproduced both orderings
  as live command output rather than reasoning about ASCII; both are quoted verbatim above.
- **`--diff-filter=D`, not `--stat | tail`.** Path-checkout cannot remove a file the target tip
  deleted, so "the diff deletes nothing" is the precondition that makes `git checkout <tip> -- .`
  tree-equivalent to a fast-forward. `--stat | tail -15` answers only for the rows that happened to
  print and would clip a 16-file diff; `--diff-filter=D --name-only` answers for the whole diff in
  one call, and empty output is the pass.
- **The winner was matched by `refname`, never by row position.** This branch fell outside `head -8`
  entirely because it still pointed at `3503537` (2026-08-13) — but the rule applied was the name
  match, not the absence.
- **The harness was run even though no CSS changed.** An empty `git diff` proves only that bytes
  match the tip I chose. The harness recomputes each element's cascade-winning declaration set from
  the files actually on disk, so a wrong or partial restore shows up as changed counts.
- **No capture artefact was written.** `toast-hit` exits non-zero by design, so earlier rounds
  redirected it to `.toast-hit.out` inside the repo and deleted it after. I ran it twice instead
  (once for the result lines, once piped to `grep -c`), which needs no cleanup and cannot leave a
  stray file behind. `git status --untracked-files=all --short` after the harness runs was empty.

## Verification

```
node tools/test.mjs             -> 54 passed, 0 failed
node tools/check-tokens.mjs     -> tokens in sync 22/22 · fonts in sync 4/4 ·
                                   no derived-colour literals · font weights available
                                   (400/500/700/800) · no radius literals ·
                                   typeface from one source
                                   (15 CSS sources scanned per check)
npm --prefix design-system test -> Test Files 12 passed (12) / Tests 31 passed (31)
```

Parity harness, all five keys — every count read from this round's own output:

```
buttons            2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements,
                                                            markup coverage OK
                                                            (7 old class tokens gone,
                                                             5 new class attributes)
segmented          021b966:index.html index.html         -> PASS, 45 pairs / 9 elements,
                                                            markup coverage OK (0 gone, 3 new)
toast              bb10dd9:index.html 10e8f39:index.html -> PASS, 5 pairs / 1 element,
                                                            markup coverage OK (0 gone, 1 new)
ds-disabled-hover  HEAD:design-system/src/styles.css design-system/src/styles.css
                                                         -> PASS, 15 pairs / 3 elements,
                                                            1 undecidable rule
                                                            (.pui-menu__item:last-child),
                                                            markup coverage N/A (stylesheet)
toast-hit          3d3d5cc:index.html index.html         -> FAIL - 5 declaration(s) differ,
                                                            0 markup problems, 0 unmatched,
                                                            10 pairs / 2 elements;
                                                            grep -c "✗ #toast:" = 0
```

`toast-hit`'s FAIL is the expected, recorded result of the intentional behaviour change made in
round `2026-08-24_0003` (`.toast-act` gained `pointer-events:auto`). The zero `✗ #toast` lines are
the proof the app side of that pair was not touched.

Restore correctness, from this round's own output:

- `git for-each-ref … %(committerdate:iso8601) … | sort -r | head -8` (run **before** the restore)
  ranked `0b082ed` (`2026-09-01 00:17:00`) above `ec1d48b` (`2026-09-01 00:07:20`), `e9cf110`
  (`2026-08-31 01:01:36`) and `919574c` (`00:54:25`). This branch (`2026-09-01_0017`) still pointed
  at `3503537` (2026-08-13) and fell outside `head -8`; the winner was confirmed by `refname`.
- Local and `origin/` refs both point at `0b082ed`.
- `git merge-base --is-ancestor 3503537 0b082ed` → `ancestor-ok`.
- `git diff --diff-filter=D --name-only HEAD 0b082ed` → empty, so the path-checkout is
  tree-equivalent to a fast-forward. The restore staged 13 `M` + 3 `A` (`SUMMARY.md`,
  `docs/btn-parity-proof.mjs`, `tools/check-tokens.mjs`), no `D`.
- `git log -1 --format="%h %an <%ae> %ad %s" 0b082ed` → author `PHANTOM AUTOPILOT
  autopilot@phantom.local`, subject `chore: round 2026-09-01_0011 no-op -- five channels checked,
  no owner answer` — the runner's own commit, not an owner answer committed onto the old branch.
- `git diff --stat 0b082ed -- .` after the checkout → empty, so the restore is total. That also
  closes channel 1 directly: `README.md` is byte-identical to the live tip.

Five owner-answer channels, all still unanswered:

| # | Channel | Result this round |
|---|---------|-------------------|
| 1 | `README.md → ## Open decisions` | `\| Option \| Cost \|` = **8**, `If you answer:` = 8, `^### [1-8]\.` = 8 — every decision still shows its option table |
| 2 | `jspdf.umd.min.js` at repo root | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` moved | still `ef3220e` (2026-06-27) |
| 4 | uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` (only `origin/`+`mac/`) = `592e7c3` (2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27). Nothing newer than 2026-08-13. |

## What I did NOT do

- **Did not answer, edit, reorder or delete any of the eight open decisions.** Each one moves pixels
  or adds a file to the repo; all eight are the owner's call, not an agent's.
- **Did not invent substitute work.** Both the contract's Next task block and the project memory
  state that code-touching fallback work is exhausted (token tooling 22/22 across six checks, parity
  table closed at 11/11) and that the last read-only fallback — the retrospective restore audit —
  was completed in round `2026-08-31_0023` and must not be re-run.
- **Did not restore `docs/design-parity.md`** from `c3351fc`. That is open decision 8 and blocks no
  acceptance criterion; the file predates the radius tokens, the font inlining and the `.btn`
  refactor, so reconciling it is a content judgement.
- **Did not apply decisions 2 / 5 / 6 / 7** (chip padding, segmented padding, input sizes,
  `:disabled:hover` guards), and did not add the parity harness to the Verify command or implement
  `:last-child` matching in it. The Next task block forbids all of these explicitly.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying burns a round without a permission change (decision 4).
- **Did not tick any acceptance-criterion box.** No criterion advanced — none can, without an owner
  answer.

## Risk

- **The headline risk this round is historical, not in the diff: `%(committerdate:short)` would have
  picked the wrong tip today.** The retired formula ranks `ec1d48b` (`_0001`) above `0b082ed`
  (`_0011`) because the two share a calendar day and `sort` falls back to the sha string. A round
  still using it would have reverted `_0011` with an empty residual diff, five matching harness keys
  and a fully green Verify — no signal anywhere. This round used `:iso8601` and restored `0b082ed`.
  **A reviewer should treat any round whose SUMMARY does not name `:iso8601` as unproven**, and note
  that same-day round pairs are now the norm rather than the exception (two on 2026-09-01, four on
  2026-08-31).
- **Nothing in this round's diff is load-bearing.** It contains the restore commit plus `SUMMARY.md`
  and the `AUTOPILOT.md` Next-task block. No `.css`, no `index.html`, no `tools/`, no `docs/`.
- **The `ds-disabled-hover` PASS still says nothing about `.pui-menu__item:last-child`.** The
  harness reports it as undecidable (structural pseudo-class it cannot evaluate); a change confined
  to that rule computes zero diff. Unchanged from previous rounds, and no round has touched it.
- **The `toast-hit` FAIL is expected and must not be "fixed".** It records the deliberate
  `pointer-events:auto` change from round `2026-08-24_0003`. A future round that makes this key PASS
  has reverted a real bug fix — the dead Undo button in the toast.
- **Browser verification has still never happened.** Every claim about rendering rests on source
  reading and the CSS cascade spec, not on a real engine. The acceptance criterion that requires
  opening `index.html` over `file://` remains unverified, and jsPDF is still loaded from `cdnjs`, so
  PDF export is still broken offline.
- **The stall is now 50+ rounds long and has crossed a calendar-month boundary.** It will not clear
  without a person answering at least one decision in `README.md`.
