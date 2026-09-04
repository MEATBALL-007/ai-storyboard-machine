# Round 2026-09-05_0020 — SUMMARY

**Result: no-op round.** All eight owner decisions in `README.md → ## Open decisions` are still
unanswered, so there was no unblocked work to do. Not a single byte of `index.html`,
`design-system/`, `tools/` or `docs/` was touched.

## What I did

- **Restored the previous round's tip** (`0b1e5a0` = branch `…/2026-09-05_0013`) onto the stale
  base `3503537` the runner cut this branch from. Restore commit `7286818`.
- **Checked all five owner-answer channels.** None has moved:
  1. `README.md → ## Open decisions` — 8 option tables, 8 `If you answer:` lines, counters agree
  2. no `jspdf` file anywhere in the index
  3. `main` still `ef3220e` (2026-06-27)
  4. `git status --untracked-files=all` empty
  5. no non-`auto/*` ref newer than 2026-08-13
- **Ran the full three-stage Verify** and **all five `btn-parity-proof` harness keys**; every
  number matches the expected table.
- Recorded this round's status block in `AUTOPILOT.md` and demoted the three previous labels.

## Why

The queued Next task says explicitly: if no decision has been answered, do a no-op round —
restore, check the five channels, run Verify plus all five harness keys, write SUMMARY, stop.
Inventing substitute work is forbidden, and the remaining fallback work is genuinely exhausted
(token tooling is 22/22 across six checks, the parity table is closed at 11/11, and the last
read-only fallback — the retrospective restore audit — was completed in round `2026-08-31_0023`).

Decisions 2, 5, 6 and 7 each move visible pixels; decision 1 needs a file the machine does not
have and cannot fetch; decision 4 needs a permission change; decision 8 is a git-history call.
Every one of them is the owner's to make, so none can be closed from inside a round.

The harness keys were run even though no CSS changed, because an empty `git diff --stat` only
proves bytes match — the harness recomputes each element's cascade-winning declaration set from
the files actually standing, so a wrong or partial restore shows up as changed counts.

## Verification

Tip selection — `:iso8601` + `head -16`, cross-checked by refname (`_0013` is the highest round
number below my own `_0020`; both methods agree). 16 rows = 8 distinct tips, the real tip in
rows 1–2, nothing clipped.

Restore preconditions, all run before touching the tree:

```
git merge-base --is-ancestor 3503537 0b1e5a0   → ancestor-ok
git diff --diff-filter=D --name-only HEAD 0b1e5a0  → empty (path-checkout == fast-forward)
git log -1 --format="%h %an <%ae> %ad %s" 0b1e5a0
  → PHANTOM AUTOPILOT <autopilot@phantom.local> Sat Sep 5 00:19:22 2026 +0700
    chore: round 2026-09-05_0013 no-op -- five channels checked, no owner answer
git diff --stat 0b1e5a0 -- .                   → empty (tree byte-identical to the tip)
```

Verify command — green on all three stages:

```
node tools/test.mjs            → 54 passed, 0 failed
node tools/check-tokens.mjs    → 6/6 checks, 15 CSS sources
                                 tokens 22/22 · fonts 4/4 · no derived-colour literals ·
                                 font weights 400/500/700/800 · no radius literals ·
                                 every font-family reads var(--mono)
npm --prefix design-system test → 12 files, 31 passed
```

Harness — all five keys, full output read (no `tail`):

```
node docs/btn-parity-proof.mjs buttons           2488f2d:index.html  index.html
  → PASS, 85 pairs / 17 elements, markup coverage OK (7 old class tokens gone, 5 new)
node docs/btn-parity-proof.mjs segmented         021b966:index.html  index.html
  → PASS, 45 pairs / 9 elements, markup coverage OK (0 old, 3 new)
node docs/btn-parity-proof.mjs toast             de07ea8:index.html  10e8f39:index.html
  → PASS, 5 pairs / 1 element, no undecidable block
node docs/btn-parity-proof.mjs ds-disabled-hover 0b1e5a0:design-system/src/styles.css design-system/src/styles.css
  → PASS, 15 pairs / 3 elements, + 1 undecidable rule `.pui-menu__item:last-child`
    (structural pseudo :last-child; subject matches .pui-menu__item, .pui-menu__item--danger)
node docs/btn-parity-proof.mjs toast-hit         3d3d5cc:index.html  index.html
  → FAIL — 5 declaration(s) differ, 0 markup problems, 0 unmatched, 10 pairs / 2 elements
```

**That `toast-hit` FAIL is the expected result, not a regression.** It pins the pre-fix
`index.html` against the live one and reports the deliberate 2026-08-24 `pointer-events:auto`
fix. What matters is *which* rows print: I read all five `✗` rows and every one is `#toastUndo`
(`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`), each `before: (unset)` →
`after : auto <- .toast-act`. **No `#toast` row appeared**, which is the proof that the parent's
`pointer-events:none` is still in place. I used `grep "✗"` / full output rather than
`grep -c "✗ #toast:"`, which has a documented blind spot (the base-state row prints
`✗ #toast (base)` with no colon, so that pattern returns 0 even when it should fire).

The `ds-disabled-hover` before-side sha is the tip **this round actually restored**, read from
`git for-each-ref`, not copied from an older status block.

## What I did NOT do

- **Did not answer, reword, reorder or delete any of the eight open decisions.** Each one moves
  pixels, adds a file, or decides git history; all are the owner's call.
- **Did not run the `:short` vs `:iso8601` A/B.** `AUTOPILOT.md` lines 355–356 record that round
  `2026-09-04_0048` measured it live and caught a real inversion at rows 3–4, and instructs later
  rounds not to repeat it. Skipping it is compliance, not an omission.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying burns a round and changes nothing (decision 4).
- **Did not restore `docs/design-parity.md`** from `c3351fc` — that is decision 8, unanswered.
- Did not trim `AUTOPILOT.md`, now 2,163 lines (`wc -l`, after this round's block). Deleting round history is discarding evidence and
  is an owner decision; it is deliberately not a ninth open decision because it blocks no
  acceptance criterion.

## Risk

- **Nothing in this round changes program behaviour.** The only files touched are `AUTOPILOT.md`
  and `SUMMARY.md`. A reviewer should confirm exactly that with
  `git diff --stat 7286818 HEAD` — anything beyond those two files would be a mistake.
- 🔴 **The `:short` tie-break trap is live again today, exactly as round `_0013` predicted.**
  `2026-09-05` now holds two tips (`0b1e5a0` = `_0013` at 00:19:22, `304cd2d` = `_0003` at
  00:09:30). They tie at day granularity, so the retired pipeline form
  `--format='%(committerdate:short) …' | sort -r` falls through to sha-descending, and `3` (0x33)
  beats `0` (0x30) — it would pick `304cd2d` and silently revert a whole round. **I did not run
  `:short` live**, so this is inference from the `:iso8601` output, *not* a measurement; do not
  cite it as a reproduction. Round `_0042` showed the `:short` winner can be a row `head` already
  clipped, invisible from the other list.
- The `ds-disabled-hover` undecidable rule (`.pui-menu__item:last-child`) is unchanged and still
  outside the harness's diff. A change confined to that rule would compute 0 diff. It has to be
  read by hand; I did not modify it, but the harness cannot vouch for it either way.
- **The stall is now 3+ weeks old and has crossed a month boundary.** Every round from
  `2026-08-29_0026` onward has produced this same no-op. It will not clear on its own — it needs
  a person to answer at least one decision in `README.md → ## Open decisions`, or to drop
  `jspdf.umd.min.js` at the repo root (decision 1's answer is a file drop, not text).
