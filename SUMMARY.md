# SUMMARY — round `2026-09-01_0042`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

The one thing worth reading in this round: **a fifth tip landed on `2026-09-01`, and the retired
`%(committerdate:short)` key now ranks the *oldest* of the five first — restoring it would discard
four rounds at once.** Both formulas were run as live commands, so this is a reproduction, not an
inference. Details under *Why*.

---

## What I did

- **Restored the previous round's tip** (`42f34bd`, branch `…/2026-09-01_0032`) into the working
  tree and committed it on its own as `72e24db`. The runner cut this branch from `3503537` again, so
  the tree arrived without any of the design-system integration work.
- **Checked all five owner-answer channels.** None has been answered — table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys.** Every count is identical to the previous round, which is the
  independent confirmation that the restore was complete rather than merely byte-equal to a sha I
  picked.
- **Reproduced the `:short` ranking trap as live output, in its worst recorded form yet** — this
  round it would cost four rounds of work, up from three. See *Why*.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (on `3503537` the app's `:root` really is byte-identical to that commit's 11-token `tokens.css`).
  An earlier round read files off the stale base and concluded the token task was already done,
  wasting the round. The first action here was `git log --oneline -5`; the first repo file read came
  after the restore commit. Note that `grep -c "| Option | Cost |" README.md` run *before* the
  restore returns **0**, not 8 — the stale `README.md` has no `## Open decisions` section at all, so
  channel 1 is only meaningful post-restore. It was re-run afterwards.
- **🔴 The retired key would now revert FOUR rounds.** All five `2026-09-01` tips share a date, so
  `:short` ties every one of them and `sort -r` falls through to comparing sha strings — a
  uniformly random key with no temporal meaning. Both formulas were run as real commands, with this
  branch's own suffix filtered out:

  ```
  :short  (retired key)          :iso8601 (key in use)
  2026-09-01 ec1d48b  _0001  X   2026-09-01 00:37:41 42f34bd  _0032   <- correct
  2026-09-01 42f34bd  _0032      2026-09-01 00:30:11 2bb9777  _0026
  2026-09-01 3e6cb1a  _0017      2026-09-01 00:23:58 3e6cb1a  _0017
  2026-09-01 2bb9777  _0026      2026-09-01 00:17:00 0b082ed  _0011
  2026-09-01 0b082ed  _0011      2026-09-01 00:07:20 ec1d48b  _0001
  ```

  `ec1d48b` wins the truncated ranking because `e` (0x65) is the highest leading hex digit present.
  It is also the **oldest** of the five — the truncated key inverts the ordering completely at the
  top, not by one position. Restoring it would discard `_0011`, `_0017`, `_0026` and `_0032`
  together. **Nothing downstream would catch it**: all four were no-op rounds touching only
  `AUTOPILOT.md`/`SUMMARY.md`, so the residual `git diff --stat <wrong-tip> -- .` would be empty,
  all five harness keys would still match, and all three Verify stages would still be green.
- **Running the old formula for real mattered this round.** Looking only at the top two `:iso8601`
  rows (`42f34bd` 00:37:41 vs `2bb9777` 00:30:11, both `2026-09-01`) would suggest `:short` gets it
  right, since `4` (0x34) > `2` (0x32) happens to agree with the time order. That inference is
  wrong — the actual `:short` winner is a row that `head -8` had clipped out of the earlier
  `:iso8601` output entirely. Reasoning from the `:iso8601` list is not a substitute for running
  `:short`.
- **`--diff-filter=D`, not `--stat | tail`.** Path-checkout cannot remove a file the target tip
  deleted, so "the diff deletes nothing" is the precondition that makes `git checkout <tip> -- .`
  tree-equivalent to a fast-forward. `--diff-filter=D --name-only` answers for the whole diff in one
  call, and empty output is the pass.
- **The winner was matched by `refname`, never by row position.** This branch (`2026-09-01_0042`)
  still pointed at `3503537` when the ranking ran, so it fell outside the window; in the
  two-formula comparison it was filtered out explicitly.
- **The tip's author was checked, not its subject.** `%an`/`%ae` on `42f34bd` reads
  `PHANTOM AUTOPILOT <autopilot@phantom.local>` — the runner, i.e. the previous round's own commit,
  not an owner answer landing on that branch. A round that amends its docs after its no-op commit
  leaves a subject matching nothing, so the subject is not a reliable test.
- **The harness was run even though no CSS changed.** An empty `git diff` proves only that bytes
  match the tip I chose. The harness recomputes each element's cascade-winning declaration set from
  the files actually on disk, so a wrong or partial restore shows up as changed counts.
- **No capture artefact was written.** `toast-hit` exits non-zero by design; I ran it twice (once
  for the result line, once piped to `grep -c`) rather than redirecting to a file. Nothing is left
  behind.

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
  (run **before** the restore) ranked `42f34bd` (`2026-09-01 00:37:41`) above `2bb9777`
  (`00:30:11`), `3e6cb1a` (`00:23:58`) and `0b082ed` (`00:17:00`) — agreeing with branch-name
  order. The winner was confirmed by `refname`, not by row number.
- Local and `origin/` refs both point at `42f34bd`.
- `git merge-base --is-ancestor 3503537 42f34bd` → `ancestor-ok`.
- `git diff --diff-filter=D --name-only HEAD 42f34bd` → **empty** (no deletions; restore stage was
  13 `M` + 3 `A`).
- `git log -1 --format="%h %an <%ae> %ad %s" 42f34bd` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, subject `chore: round 2026-09-01_0032 no-op -- five channels checked,
  no owner answer`.
- `git diff --stat 42f34bd -- .` after the restore → **empty**, i.e. the tree matches the tip byte
  for byte. This doubles as channel 1: `README.md` is unchanged from the tip.

Five owner-answer channels, all from this round's output (channels 1, 2 and 4 re-run **after** the
restore):

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `grep -c "\| Option \| Cost \|"` = **8**; `If you answer:` = 8; `^### [1-8]\.` = 8 — all eight still unanswered |
| 2 | `jspdf.umd.min.js` at repo root | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` | still `ef3220e` (2026-06-27) |
| 4 | uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` (only `origin/`+`mac/`) = `592e7c3` (2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — nothing newer than this work |

## What I did NOT do

- **Did not answer any of the eight open decisions.** Every one moves pixels or adds a file to the
  repo; they are the owner's call, and the contract forbids inventing a substitute task.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`.** The empty
  `git diff --stat 42f34bd -- .` is the proof.
- **Did not restore `docs/design-parity.md`** (still reachable at `c3351fc:docs/design-parity.md`).
  That is open decision 8 and blocks no acceptance criterion.
- **Did not re-run the retrospective restore audit** — completed in round `2026-08-31_0023`, which
  explicitly forbids repeating it.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying without a permission change burns the round.
- **Did not tick any acceptance-criteria box.** Nothing was completed this round.
- **Did not trim `AUTOPILOT.md`.** It keeps growing and the previous round flagged it; trimming
  status history is an owner-sanctioned edit, not something to do unilaterally in a no-op round.

## Risk

- **The reviewer should confirm the restored tip is the one they expect** (`42f34bd` = `_0032`).
  If the runner ever cuts branches from a real chain instead of `3503537`, the restore commit
  becomes redundant and would need removing. It is deliberately a separate commit (`72e24db`) so it
  can be dropped without touching this round's other work.
- **`toast-hit` reports FAIL by design.** It is not in the Verify command and does not gate the PR,
  but an automated reader scanning for the word FAIL will trip on it. The `grep -c "✗ #toast:"` = 0
  line is the discriminator: it proves the app side of that pair is untouched and only the
  intentional `#toastUndo` `pointer-events` change shows.
- **The `ds-disabled-hover` PASS excludes one rule** (`.pui-menu__item:last-child`) that the harness
  reports as undecidable — it cannot read structural pseudo-classes. A change confined to that rule
  computes zero diff. Unchanged this round, but the PASS says nothing about it.
- **The `:short` trap is worse than it has ever been: four rounds of damage, and the top of its
  ranking is now exactly inverted** (oldest tip first). Any future round must keep using
  `%(committerdate:iso8601)`, and must not conclude from a favourable-looking top pair that the old
  key is safe — this round is a live demonstration that the top pair can agree while the actual
  winner is wrong.
- **`AUTOPILOT.md` keeps growing** (a plain `Read` of the whole file exceeds the tool's token
  ceiling; this round it needed `Grep` for `^## Next task` plus an offset `Read` with an explicit
  `limit`). It is heading toward being unreadable and could use an owner-sanctioned trim of the
  older per-round status blocks.
