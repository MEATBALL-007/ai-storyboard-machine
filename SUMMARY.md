# Round 2026-09-11_0036 — no-op (no owner answer)

## What I did

- **Restored the previous round's tip `1c3e39b` (`…/2026-09-11_0026`) onto the stale base.**
  `git log --oneline -1` showed `3503537` again — the runner still cuts every `auto/*` branch from
  the contract commit, never from the previous tip. Restored as its own commit; residual
  `git diff 1c3e39b -- . ':!design-system/node_modules'` is **empty**, so the tree matches the tip exactly.
- **Checked all five owner-answer channels — none has been answered.** Details under Verification.
- **Ran the full three-stage Verify plus all five harness keys.** Every number matches the
  documented expectation exactly.
- **Resolved round `_0026`'s tip-selection forecast in `AUTOPILOT.md` and wrote this round's.**
  `_0026` predicted ~69.4% tails and it came up **tails**. Unlike the last two rounds I resolved it
  with a **live A/B**, not inference. Next round's risk is again **~69.4% tails**.
- Did **not** append a `> **สถานะล่าสุด …` block — following the convention started at round `_0035`
  (this is the eighteenth round to do so). Only the `## Next task` block was edited.

## Why

- **The task really was a no-op, and that is the contract's own instruction, not a fallback I chose.**
  `## Next task` says: if no owner decision is answered, restore, check five channels, run Verify +
  all five harness keys, write SUMMARY, end — and explicitly forbids inventing other work. All eight
  decisions in `README.md` are still unanswered, so that branch applies.
- **`## Next task` arrived empty in the prompt again** (`AUTOPILOT.md` is ~400 KB). I read the task
  from the **restored** file — `Grep` for `^## Next task`, then `Read` at that offset — as the last
  round instructed. Reading the task from the prompt text would have produced a round-1 task.
- **The stale-base tell is cheap and worth doing first.** The contract cites `tools/check-tokens.mjs`
  and `docs/btn-parity-proof.mjs` by path; one `ls` showed both absent, which identifies the stale
  base before any analysis is wasted on a tree ~50 rounds behind the document describing it.
- **Ranked candidate tips with `--sort=-committerdate` (full-precision timestamp), cross-checked by
  refname read date-major.** The refname check must be read as "highest round number *on the newest
  date present*", never "highest overall" — round numbers reset across day boundaries.
- **The `ds-disabled-hover` before-side is the previous round's tip, not a fixed sha.** Since the tree
  now equals `1c3e39b`, a PASS here is the correct regression-guard result: DS styles are untouched.

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
buttons           2488f2d:index.html  index.html          → PASS, 85 pairs / 17 elements
segmented         021b966:index.html  index.html          → PASS, 45 pairs /  9 elements
toast             de07ea8:index.html  10e8f39:index.html  → PASS,  5 pairs /  1 element
                                                            markup coverage OK
ds-disabled-hover 1c3e39b:…/styles.css …/styles.css       → PASS, + 1 undecidable
                                                            (.pui-menu__item:last-child)
toast-hit         3d3d5cc:index.html  index.html          → FAIL — 5 declarations differ  ← CORRECT
```

`toast-hit`'s FAIL is its intended result. I listed every `✗` row rather than counting with
`grep -c "✗ #toast:"` — that pattern cannot match the base-state row `✗ #toastUndo (base)` and
returns a misleading count in exactly the regression case it exists to catch. All five rows are
`#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), each showing
`pointer-events (unset) → auto <- .toast-act`; **no `#toast` row appeared**, which is the proof that
`#toast` still carries its `pointer-events:none`.

**Five channels — no owner answer:**

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `grep -c "\| Option \| Cost \|"` = **8**, `grep -c "If you answer:"` = **8** — agree, so nothing answered (run *after* the restore; on the stale tree it reads 0) |
| 2 | `jspdf.umd.min.js` at repo root | `git ls-files` → 76 files, no jsPDF |
| 3 | `main` | still `ef3220e` (2026-06-27) |
| 4 | uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` at **2026-08-13**; `hardening-pass` 2026-07-20, `mac*` 2026-07-20, `main` 2026-06-27 — all older than this work |

**Tip-selection A/B — run live this round** (own branch excluded to simulate the pre-restore state):

```
buggy:   --format='%(committerdate:short) %(objectname:short) %(refname:short)' | sort -r
         row 1 = b1977bc  _0016   ← WRONG tip
         row 2 = 1c3e39b  _0026   ← the correct tip, demoted
correct: --sort=-committerdate
         row 1 = 1c3e39b  _0026   ← restored this
```

Damage the buggy formula would have done: `git log b1977bc..1c3e39b` = **2 commits**;
`git diff --stat` = **2 files (`AUTOPILOT.md`, `SUMMARY.md`), 131+/120-** — no code.
The trap is still fully alive in the same listing: inside the `2026-09-10` group it lifts `b2a5815`
(`_0013`) into the top 5 while the real tip `0d08961` (`_0035`) does not appear there at all.

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
- Did not add a seventh token check — token tooling is 22/22 with six checks and there is nothing
  left to enforce.
- Did not trim `AUTOPILOT.md`, though its size is what breaks the prompt. Deleting round history is
  an owner decision (8); this round only avoided adding to it.

## Risk

- **Nothing in the app or the library changed this round, so there is no pixel risk.** The reviewer's
  attention is better spent on the two structural risks below.
- 🔴 **The stall is the real risk, and it is now ~4 weeks old across 89+ rounds cut from the stale
  base.** Every remaining acceptance criterion is blocked on a person. No further agent round can
  clear it; more rounds only add restore commits and SUMMARY churn.
- 🔴 **Next round's tip-selection risk is ~69.4% — read `AUTOPILOT.md`'s Next task block before
  ranking.** After this round closes, `2026-09-11` holds four tips (`1a30454`, `b1977bc`, `1c3e39b`,
  this round's sha) tied at day granularity, and the ratchet comparand stays `b1977bc`. A ranking of
  the form `--format='%(committerdate:short) %(objectname:short) %(refname:short)' | sort -r` breaks
  the tie on the **random sha** and would restore `b1977bc`, silently discarding both this round and
  `_0026`. The failure is undetectable downstream: the residual diff against the wrong tip is empty,
  all five harness keys still match, and all three Verify stages stay green. Use
  `--sort=-committerdate` (native, full precision) and cross-check the refname **date-major**.
- ⚠️ **This round's tails outcome is now measured, not inferred** — but that cuts both ways: the two
  rounds before it recorded *inferred* resolutions, so the running tally (**tails 11 of 16**) mixes
  measured and inferred flips. Treat the rate as indicative, not as a clean experiment.
- ⚠️ **`ds-disabled-hover` cannot see `.pui-menu__item:last-child`** (structural pseudo-class) and
  says so itself. A change confined to that rule computes 0 diff. It must be read by hand; this
  round did not change it.
- ⚠️ **Still no browser verification, ever** — `index.html` has never been opened in a real browser
  across this whole effort. Everything is argued from source and CSS spec.
- ⚠️ **Any future round must read the task from the restored `AUTOPILOT.md`**, never from the prompt
  text: at ~400 KB the `## Next task` section is truncated away before the prompt is assembled, and
  the stale base's own `AUTOPILOT.md` contains a *round-1* task that looks plausible and is wrong.
