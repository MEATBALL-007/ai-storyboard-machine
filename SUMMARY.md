# SUMMARY — round `2026-09-01_0026`

**No-op round.** All eight owner decisions in `README.md` are still unanswered, so no code work was
available. The tree was restored from the previous round's tip, every check was re-run, and nothing
under `index.html` / `design-system/` / `tools/` / `docs/` moved by a single byte.

The one thing worth reading in this round: the top two tips again share a calendar day, so the
retired `%(committerdate:short)` key would have tied them — but this time its sha-string fallback
happened to land on the **right** tip. That is a coincidence, not a reprieve. Details under *Why*.

---

## What I did

- **Restored the previous round's tip** (`3e6cb1a`, branch `…/2026-09-01_0017`) into the working
  tree and committed it on its own as `955830b`. The runner cut this branch from `3503537` again, so
  the tree arrived without any of the design-system integration work.
- **Checked all five owner-answer channels.** None has been answered — table below.
- **Ran the contract Verify command in full** — all three stages green.
- **Ran all five parity-harness keys.** Every count is identical to the previous round, which is the
  independent confirmation that the restore was complete rather than merely byte-equal to a sha I
  picked.
- **Recorded that a same-day tip tie is not, by itself, a failed restore** — this round is the
  counter-example to the previous round's headline finding. See *Why*.

## Why

- **The restore comes before any Read.** The stale tree does not look broken — it looks *finished*
  (on `3503537` the app's `:root` really is byte-identical to that commit's 11-token `tokens.css`).
  An earlier round read files off the stale base and concluded the token task was already done,
  wasting the round. The first action here was `git log --oneline -3`; the first file read from the
  repo came after the restore commit.
- **🔴 Same-day tie again — but the old key would have got it right this time, by luck.** Round
  `_0017` proved that `:short` *can* restore the wrong tip when two tips share a date. This round
  has the same setup and the opposite outcome:

  ```
  :short  (retired key)          :iso8601 (key in use)
  2026-09-01 3e6cb1a  _0017      2026-09-01 00:23:58 3e6cb1a  _0017   <- correct
  2026-09-01 0b082ed  _0011      2026-09-01 00:17:00 0b082ed  _0011
  ```

  Under `:short` the dates tie and `sort -r` falls through to the sha string, where `3` (0x33) sorts
  above `0` (0x30) — which agrees with the time order purely by accident. **The lesson is that
  "the two formulas agreed this round" is not evidence the old key is safe**, and equally that
  seeing a same-day tie is not evidence a past round restored wrongly. Whether the trap fires is a
  coin flip on the first hex digit. `:iso8601` remains the only key that is correct by construction.
  I did not run the retired formula as a live command this round — the ordering above is read off
  the `:iso8601` output I did run, whose first two rows carry the same date and therefore tie under
  truncation. That is a weaker basis than round `_0017`'s side-by-side run; treat it as an
  illustration of this round's refs, not as an independent reproduction.
- **`--diff-filter=D`, not `--stat | tail`.** Path-checkout cannot remove a file the target tip
  deleted, so "the diff deletes nothing" is the precondition that makes `git checkout <tip> -- .`
  tree-equivalent to a fast-forward. `--diff-filter=D --name-only` answers for the whole diff in one
  call, and empty output is the pass.
- **The winner was matched by `refname`, never by row position.** I filtered this branch's own
  suffix (`2026-09-01_0026`) out of the ranking pipeline explicitly, so no row could be my own
  restore commit even after it existed.
- **The harness was run even though no CSS changed.** An empty `git diff` proves only that bytes
  match the tip I chose. The harness recomputes each element's cascade-winning declaration set from
  the files actually on disk, so a wrong or partial restore shows up as changed counts.
- **No capture artefact was written.** `toast-hit` exits non-zero by design; I ran it twice (once
  for the result lines, once piped to `grep -c`) rather than redirecting to a file, so nothing can
  be left behind.

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

- `git for-each-ref … %(committerdate:iso8601) … | grep -v 2026-09-01_0026 | sort -r | head -6`
  (run **before** the restore) ranked `3e6cb1a` (`2026-09-01 00:23:58`) above `0b082ed`
  (`2026-09-01 00:17:00`) and `ec1d48b` (`2026-09-01 00:07:20`). The winner was confirmed by
  `refname`, not by row number.
- Local and `origin/` refs both point at `3e6cb1a`.
- `git merge-base --is-ancestor 3503537 3e6cb1a` → `ancestor-ok`.
- `git diff --diff-filter=D --name-only HEAD 3e6cb1a` → empty, so the path-checkout is
  tree-equivalent to a fast-forward.
- `git log -1 --format="%h %an <%ae> %ad %s" 3e6cb1a` → author `PHANTOM AUTOPILOT
  autopilot@phantom.local`, subject `chore: round 2026-09-01_0017 no-op -- five channels checked,
  no owner answer` — the runner's own commit, not an owner answer committed onto the old branch.
- `git diff --stat 3e6cb1a -- .` after the checkout → empty, so the restore is total. That also
  closes channel 1 directly: `README.md` is byte-identical to the live tip.

Five owner-answer channels, all still unanswered:

| # | Channel | Result this round |
|---|---------|-------------------|
| 1 | `README.md → ## Open decisions` | `\| Option \| Cost \|` = **8** — every decision still shows its option table; plus the empty `git diff --stat 3e6cb1a -- .` proves `README.md` is unchanged from the live tip |
| 2 | `jspdf.umd.min.js` in the repo | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` | `ef3220e` (2026-06-27), unmoved |
| 4 | Uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c` (2026-07-20); `hardening-pass` exists only as `origin/`+`mac/` = `592e7c3` (2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27). Nothing newer than 2026-08-13, which predates all this work. |

## What I did NOT do

- **Did not answer any of the eight open decisions.** Every one moves pixels or adds a file to the
  repo; that is the owner's call, and answering one would be the single most damaging thing an
  unattended round could do here.
- **Did not invent substitute work.** Code-touching fallback work was exhausted at round `_0102`,
  and the last read-only fallback (the retrospective restore audit) was completed and closed in
  round `2026-08-31_0023`. Re-running either burns a round and finds nothing.
- **Did not restore `docs/design-parity.md`** from `c3351fc`. That is decision 8 and is unanswered.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying needs a permission change, not another attempt.
- **Did not add a seventh token check, touch the Verify command, or add the harness to it.**
- **Did not run the retired `:short` formula as a live command.** Round `_0017` already did that
  side by side; repeating it would not have added information, and I have said plainly above that
  this round's ordering claim is therefore weaker than that round's.

## Risk

- **Nothing in the repo changed this round except `SUMMARY.md`, `AUTOPILOT.md` and the restore
  commit.** A reviewer diffing this branch against `3e6cb1a` should see exactly those two files.
- **The `:short`-agrees-this-round result is the kind of observation that invites the wrong
  conclusion.** It does not rehabilitate the retired key. If a future round sees the two formulas
  agree and reads that as "the trap is gone", it will eventually restore over a whole round with
  every downstream check still green. The only safe reading is the one stated above: agreement is a
  coin flip, `:iso8601` is correct by construction.
- **`toast-hit` exits non-zero by design.** Anything that chains the harness keys with `&&` will
  truncate; use `;`. Its FAIL is the recorded expected state, not a regression.
- **The stall is now well past a calendar-month boundary** and will not clear without a person.
  Every further round is a no-op until an owner answers something. That is the honest status, not a
  tooling problem to be worked around.
