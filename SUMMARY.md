# Round 2026-09-12_0001 — no-op (no owner answer)

## What I did

- **Restored the previous round's tip `d633d02` (`…/2026-09-11_0036`) onto the stale base.**
  `git log --oneline -1` showed `3503537` again — the runner still cuts every `auto/*` branch from
  the contract commit, never from the previous tip. Restored as its own commit; residual
  `git diff --stat d633d02 -- . ':!design-system/node_modules'` is **empty**, so the tree matches
  the tip byte for byte.
- **Checked all five owner-answer channels — none has been answered.** Details under Verification.
- **Ran the full three-stage Verify plus all five harness keys.** Every number matches the
  documented expectation exactly, including `toast-hit`'s intended FAIL.
- **Resolved round `_0036`'s tip-selection forecast in `AUTOPILOT.md` and wrote this round's.**
  `_0036` predicted ~69.4% tails; it came up **heads** — the ~30.6% branch — because its closing sha
  `d633d02` happens to start with `d` and beat the ratchet comparand `b1977bc`. Resolved with a
  **live A/B**, not inference. Next round's risk is **~0%, for one round only** (see Risk).
- Did **not** append a `> **สถานะล่าสุด …` block — following the convention started at round `_0035`
  (this is the nineteenth round to do so). Only the `## Next task` block was edited.

## Why

- **The task really was a no-op, and that is the contract's own instruction, not a fallback I chose.**
  `## Next task` says: if no owner decision is answered, restore, check five channels, run Verify +
  all five harness keys, write SUMMARY, end — and explicitly forbids inventing other work. All eight
  decisions in `README.md` are still unanswered, so that branch applies.
- **`## Next task` arrived empty in the prompt again** (`AUTOPILOT.md` is now 3,041 lines / 411,975
  bytes). I read the task from the **restored** file — `Grep` for `^## Next task`, then `Read` at that
  offset — as previous rounds instructed. Reading the task from the prompt text would have produced
  a round-1 task.
- **The stale-base tell is cheap and worth doing first.** One `ls` showed `tools/check-tokens.mjs`
  and `docs/btn-parity-proof.mjs` — both cited by path in the contract — absent from the tree. That
  identifies the stale base before any analysis is wasted on a tree ~90 rounds behind the document
  describing it.
- **Ranked candidate tips with `--sort=-committerdate` (full-precision timestamp), cross-checked by
  refname read date-major.** The refname check must be read as "highest round number *on the newest
  date present*", never "highest overall" — round numbers reset across day boundaries.
- **The `ds-disabled-hover` before-side is the tip this round actually restored (`d633d02`), not a
  copied sha.** Since the tree now equals `d633d02`, a PASS here is the correct regression-guard
  result: the design-system styles are untouched.

## Verification

**Three-stage Verify — all green:**

```
node tools/test.mjs         → 54 passed, 0 failed
node tools/check-tokens.mjs → tokens 22/22 · fonts 4/4 byte-identical
                              no derived-colour literals (15 CSS sources)
                              font weights all in {400,500,700,800}
                              every border-radius reads a --r-* token
                              every font-family reads var(--mono)
npm --prefix design-system test → 12 files, 31 passed
```

**Five harness keys — all as documented:**

```
buttons           2488f2d:index.html   index.html            → PASS, 85 pairs / 17 elements
                                                               markup 7 gone / 5 new
segmented         021b966:index.html   index.html            → PASS, 45 pairs /  9 elements
                                                               markup 0 gone / 3 new
toast             de07ea8:index.html   10e8f39:index.html    → PASS,  5 pairs /  1 element
                                                               markup 0 gone / 1 new
ds-disabled-hover d633d02:…/styles.css …/styles.css          → PASS, 15 pairs /  3 elements
                                                               + 1 undecidable; markup N/A
toast-hit         3d3d5cc:index.html   index.html            → FAIL — 5 declarations differ  ← CORRECT
                                                               10 pairs / 2 elements
```

`toast-hit`'s FAIL is its intended result. I listed every `✗` row rather than counting with
`grep -c "✗ #toast:"` — that pattern cannot match the base-state row `✗ #toastUndo (base)` and
returns a misleading count in exactly the regression case it exists to catch. All five rows are
`#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`); **no `#toast` row
appeared**, which is the proof that `#toast` still carries its `pointer-events:none`.
`ds-disabled-hover` reports `markup coverage N/A — the source is a stylesheet`, the correct result
for a key that reads `.css`, and flags its 1 undecidable rule (`.pui-menu__item:last-child`).

**Five channels — no owner answer:**

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `grep -c "\| Option \| Cost \|"` = **8**, `grep -c "If you answer:"` = **8** — the two counters agree, so nothing was answered (run *after* the restore; on the stale tree both read 0) |
| 2 | `jspdf.umd.min.js` vendored | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` | still `ef3220e` (2026-06-27) — unmoved for ~2.5 months |
| 4 | uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` at **2026-08-13** (`3503537`); `mac`/`mac/design-system` `e3a355c` 2026-07-20; `hardening-pass` `592e7c3` 2026-07-20; `main`/`mac/main`/`origin/main` `ef3220e` 2026-06-27 — every one older than this work |

**Tip-selection A/B — run live this round** (own branch excluded to simulate the pre-restore state):

```
buggy:   --format='%(committerdate:short) %(objectname:short) %(refname:short)' | sort -r
         row 1 = d633d02  _0036   ← the correct tip, but only because 'd' > 'b'
correct: --sort=-committerdate
         row 1 = d633d02  _0036   ← restored this
```

The two formulas agreed this round, so the damage was zero — but the bug is fully alive in the very
same listing, in two places: inside the `2026-09-11` group the buggy sort lifts `b1977bc` (`_0016`)
**above** the newer `1c3e39b` (`_0026`), and inside the `2026-09-10` group it still puts `b2a5815`
(`_0013`) ahead of `4401534` (`_0024`) and of `0d08961` (`_0035`), the real tip of that day.

## What I did NOT do

- **Did not answer, edit, or reorder any of the eight open decisions.** Each moves pixels or adds a
  file; all eight are the owner's call. Decisions 2, 5 and 6 are the last three gaps in the
  element-parity criterion; 1 and 4 each gate one further criterion.
- **Did not touch any CSS, `index.html`, or the design system.** This round's diff is
  `AUTOPILOT.md` + `SUMMARY.md` only, on top of the mechanical restore commit.
- **Did not restore `docs/design-parity.md`** (recoverable at `c3351fc:docs/design-parity.md`) —
  that is open decision 8.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; decision 4 has to be answered first. Retrying burns a round.
- Did not add a seventh token check — token tooling is 22/22 across six checks and there is nothing
  left to enforce.
- Did not trim `AUTOPILOT.md`, though its size is what breaks the prompt. Deleting round history is
  an owner decision (8); this round only added ~20 lines to it.

## Risk

- **Nothing in the app or the library changed this round, so there is no pixel risk.** The reviewer's
  attention is better spent on the two structural risks below.
- 🔴 **The stall is the real risk, and it is now ~4.5 weeks old across 90+ rounds cut from the stale
  base.** Every remaining acceptance criterion is blocked on a person. No further agent round can
  clear it; more rounds only add restore commits and SUMMARY churn.
- 🟢 / ⚠️ **Next round's tip-selection risk is ~0% — but for one round only, and not because the bug
  was fixed.** This round is the first of `2026-09-12`, so after it closes that date holds exactly
  **one** tip; with no tie in the newest-date group, even the buggy ranking lands on it. The ratchet
  resets at every day boundary and climbs again *within* the day: the **second** round of
  `2026-09-12` will face comparand = this round's closing sha and a risk of `0x<sha>/0x10000000`
  again. Do not read this round's agreement as "the formula is safe". Keep using
  `--sort=-committerdate` (native, full precision) and cross-check the refname **date-major**.
- ⚠️ **The running tally (tails 11 of 17) mixes measured and inferred flips** — this round's and
  `_0026`'s were measured by live A/B, `_0016`'s and `_0035`'s were inferred. Treat the rate as
  indicative, not as a clean experiment.
- ⚠️ **`ds-disabled-hover` cannot see `.pui-menu__item:last-child`** (structural pseudo-class) and
  says so itself. A change confined to that rule computes 0 diff. It must be read by hand; this
  round did not change it.
- ⚠️ **Still no browser verification, ever** — `index.html` has never been opened in a real browser
  across this whole effort. Everything is argued from source and CSS spec.
- ⚠️ **Any future round must read the task from the restored `AUTOPILOT.md`**, never from the prompt
  text: at ~412 KB the `## Next task` section is truncated away before the prompt is assembled, and
  the stale base's own `AUTOPILOT.md` contains a *round-1* task that looks plausible and is wrong.
