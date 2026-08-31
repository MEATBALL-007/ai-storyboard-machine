# SUMMARY — round `2026-09-01_0032`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

The one thing worth reading in this round: **all four round tips now share a calendar day, so the
retired `%(committerdate:short)` key would have ranked `_0001` first and silently reverted three
rounds at once.** Both formulas were run as live commands this round, so this is a reproduction, not
an inference. Details under *Why*.

---

## What I did

- **Restored the previous round's tip** (`2bb9777`, branch `…/2026-09-01_0026`) into the working
  tree and committed it on its own as `2e23ede`. The runner cut this branch from `3503537` again, so
  the tree arrived without any of the design-system integration work.
- **Checked all five owner-answer channels.** None has been answered — table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys.** Every count is identical to the previous round, which is the
  independent confirmation that the restore was complete rather than merely byte-equal to a sha I
  picked.
- **Reproduced the `:short` ranking trap as live output, in its worst recorded form** — this round
  it would have cost three rounds of work, not one. See *Why*.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (on `3503537` the app's `:root` really is byte-identical to that commit's 11-token `tokens.css`).
  An earlier round read files off the stale base and concluded the token task was already done,
  wasting the round. The first action here was `git log --oneline -12`; the first repo file read
  came after the restore commit.
- **🔴 The retired key would have reverted THREE rounds this time.** All four `2026-09-01` tips now
  share a date, so `:short` ties every one of them and `sort -r` falls through to comparing sha
  strings. Both formulas were run as real commands, filtered against this branch's own suffix:

  ```
  :short  (retired key)          :iso8601 (key in use)
  2026-09-01 ec1d48b  _0001  X   2026-09-01 00:30:11 2bb9777  _0026   <- correct
  2026-09-01 3e6cb1a  _0017      2026-09-01 00:23:58 3e6cb1a  _0017
  2026-09-01 2bb9777  _0026      2026-09-01 00:17:00 0b082ed  _0011
  2026-09-01 0b082ed  _0011      2026-09-01 00:07:20 ec1d48b  _0001
  ```

  `ec1d48b` wins the truncated ranking because `e` (0x65) is the highest leading hex digit present —
  three positions above the real tip. Restoring it would have discarded `_0011`, `_0017` and
  `_0026` together. **Nothing downstream would have caught it**: all three were no-op rounds
  touching only `AUTOPILOT.md`/`SUMMARY.md`, so the residual `git diff --stat <wrong-tip> -- .`
  would be empty, all five harness keys would still match, and all three Verify stages would still
  be green. The damage from this trap grows as rounds accumulate on one calendar day.
- **`--diff-filter=D`, not `--stat | tail`.** Path-checkout cannot remove a file the target tip
  deleted, so "the diff deletes nothing" is the precondition that makes `git checkout <tip> -- .`
  tree-equivalent to a fast-forward. `--diff-filter=D --name-only` answers for the whole diff in one
  call, and empty output is the pass.
- **The winner was matched by `refname`, never by row position.** This branch's own suffix
  (`2026-09-01_0032`) was filtered out of the ranking pipeline explicitly, so no row could be my own
  restore commit even after it existed.
- **The tip's author was checked, not its subject.** `%an`/`%ae` on `2bb9777` reads
  `PHANTOM AUTOPILOT <autopilot@phantom.local>` — the runner, i.e. the previous round's own commit,
  not an owner answer landing on that branch. A round that amends its docs after its no-op commit
  leaves a subject matching nothing, so the subject is not a reliable test.
- **The harness was run even though no CSS changed.** An empty `git diff` proves only that bytes
  match the tip I chose. The harness recomputes each element's cascade-winning declaration set from
  the files actually on disk, so a wrong or partial restore shows up as changed counts.
- **No capture artefact was written.** `toast-hit` exits non-zero by design; redirecting its output
  to a file was refused by the permission gate anyway, so I ran it twice (once for the result lines,
  once piped to `grep -c`). Nothing is left behind.

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

- `git for-each-ref … %(committerdate:iso8601) … | grep "auto/deep_dive" | sort -r | head -8`
  (run **before** the restore) ranked `2bb9777` (`2026-09-01 00:30:11`) above `3e6cb1a`
  (`00:23:58`), `0b082ed` (`00:17:00`) and `ec1d48b` (`00:07:20`) — agreeing with branch-name
  order. The winner was confirmed by `refname`, not by row number.
- Local and `origin/` refs both point at `2bb9777`.
- `git merge-base --is-ancestor 3503537 2bb9777` → `ancestor-ok`.
- `git diff --diff-filter=D --name-only HEAD 2bb9777` → **empty** (no deletions; restore stage was
  13 `M` + 3 `A`). `git diff --stat HEAD 2bb9777` = 16 files, 3149+/162−.
- `git log -1 --format="%h %an <%ae> %ad %s" 2bb9777` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, subject `chore: round 2026-09-01_0026 no-op -- five channels checked,
  no owner answer`.
- `git diff --stat 2bb9777 -- .` after the restore → **empty**, i.e. the tree matches the tip byte
  for byte. This doubles as channel 1: `README.md` is unchanged from the tip.

Five owner-answer channels, all from this round's output:

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `grep -c "\| Option \| Cost \|"` = **8** — all eight still unanswered |
| 2 | `jspdf.umd.min.js` at repo root | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` | still `ef3220e` (2026-06-27, *Add README*) |
| 4 | uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` (only `origin/`+`mac/`) = `592e7c3` (2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — nothing newer than this work |

## What I did NOT do

- **Did not answer any of the eight open decisions.** Every one moves pixels or adds a file to the
  repo; they are the owner's call, and the contract forbids inventing a substitute task.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`.** The empty
  `git diff --stat 2bb9777 -- .` is the proof.
- **Did not restore `docs/design-parity.md`** (still reachable at `c3351fc:docs/design-parity.md`).
  That is open decision 8 and blocks no acceptance criterion.
- **Did not re-run the retrospective restore audit** — completed in round `2026-08-31_0023`, which
  explicitly forbids repeating it.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying without a permission change burns the round.
- **Did not tick any acceptance-criteria box.** Nothing was completed this round.
- **Did not add a seventh token check.** All 22 tokens already have checker coverage; `AUTOPILOT.md`
  states there is nothing left to enforce.

## Risk

- **The reviewer should confirm the restored tip is the one they expect** (`2bb9777` = `_0026`).
  If the runner ever cuts branches from a real chain instead of `3503537`, the restore commit
  becomes redundant and would need removing. It is deliberately a separate commit (`2e23ede`) so it
  can be dropped without touching this round's other work.
- **`toast-hit` reports FAIL by design.** It is not in the Verify command and does not gate the PR,
  but an automated reader scanning for the word FAIL will trip on it. The `grep -c "✗ #toast:"` = 0
  line is the discriminator: it proves the app side of that pair is untouched and only the
  intentional `#toastUndo` `pointer-events` change shows.
- **The `ds-disabled-hover` PASS excludes one rule** (`.pui-menu__item:last-child`) that the harness
  reports as undecidable — it cannot read structural pseudo-classes. A change confined to that rule
  computes zero diff. Unchanged this round, but the PASS says nothing about it.
- **The `:short` trap is now costlier than it has ever been.** Four tips share `2026-09-01`; a round
  that regresses to the truncated key would revert three rounds and leave every downstream check
  green. Any future round must keep using `%(committerdate:iso8601)`.
- **`AUTOPILOT.md` keeps growing** (now well past 1,100 lines of status history; a plain `Read` of
  the whole file exceeds the tool's token ceiling). It is still navigable via `Grep` for
  `^## Next task` plus an offset `Read`, but it is heading toward being unreadable and could use an
  owner-sanctioned trim of the older per-round status blocks.
