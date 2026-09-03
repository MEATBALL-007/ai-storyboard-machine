# Round 2026-09-04_0011 — SUMMARY

## What I did

- **Restored the previous round's tree.** The branch was cut from the stale base `3503537`
  again (61st consecutive round), so the working tree lacked `tools/check-tokens.mjs`,
  `docs/btn-parity-proof.mjs` and every token/radius/font change. Restored tip `0c86d72`
  (`…/2026-09-04_0001`) with `git checkout 0c86d72 -- .` as its own commit (`1678112`), so this
  round's real diff stays readable.
- **Checked all five owner-answer channels — nothing has been answered.** All 8 open decisions
  are still open, so no criterion could be unblocked.
- **Ran the full Verify command and all five harness keys.** Everything matches the expected
  table exactly; nothing regressed.
- **Recorded the round in `AUTOPILOT.md`** — added this round's status block and demoted the
  chain of previous labels. `## Next task` needed no rewrite: it already prescribes exactly this
  no-op procedure conditional on there being no owner answer, which is what happened.
- **Touched no code.** `index.html`, `design-system/`, `tools/` and `docs/` are byte-identical
  to the restored tip. Only `AUTOPILOT.md` and `SUMMARY.md` changed.

## Why

**Why a no-op is the correct outcome.** The queued Next task says in terms: if no owner decision
has been answered, restore, check the five channels, run Verify plus the five harness keys, write
SUMMARY, end the round — and explicitly forbids inventing substitute work. The design-system
integration is finished except for 8 decisions that each move pixels or add a file to the repo, so
each is the owner's call. Re-running the survey work would burn a round and find nothing; what is
missing is a choice, not more analysis.

**Why the tip was selected the way it was.** Ranked with
`%(committerdate:iso8601)` + `head -16`, then cross-checked by refname (`_0001` is the highest
round number below my own `_0011`). Both methods agree on `0c86d72`. Note for the next round:
`2026-09-04` currently holds only **one** tip, so day-granularity happened to separate it — this
is the documented "accidentally right" case, **not** evidence the `:short` tie-break trap is
retired. The row directly below is `2026-09-03` with **six** tied tips; the trap returns the
moment a second round lands on `2026-09-04`.

**Why `ds-disabled-hover`'s before-side sha is not copied from the status blocks.** That key takes
the *previous round's tip* as its before side, which changes every round. I used `0c86d72` — the
tip I actually restored this round — read from `git for-each-ref`, not transcribed.

## Verification

Restore preconditions (all pass):

- `git log -1 --format="%h %an <%ae> %ad %s" 0c86d72` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, subject `chore: round 2026-09-04_0001 no-op -- five channels
  checked, no owner answer` → the runner's own commit, **not** an owner answer.
- `git merge-base --is-ancestor 3503537 0c86d72` → `ancestor-ok`.
- `git diff --diff-filter=D --name-only HEAD 0c86d72` → **empty** → the diff deletes no file, so
  path-checkout is tree-equivalent to a fast-forward.
- `git diff --stat 0c86d72 -- .` after the checkout → **empty** → the restore is total, byte for
  byte. (This also closes channel 1: `README.md` is unchanged from the tip.)

Verify command — **all three stages green**:

```
node tools/test.mjs          → 54 passed, 0 failed
node tools/check-tokens.mjs  → 6/6 checks pass:
    tokens in sync: 22/22 from tokens.css present and identical in index.html
    fonts in sync: 4/4 embedded byte-identical
    no derived-colour literals: 15 CSS sources scanned
    font weights available: 15 CSS sources, every weight in {400,500,700,800}
    no radius literals: 15 CSS sources, every border-radius reads a --r-* token
    typeface from one source: 15 CSS sources, every font-family reads var(--mono)
npm --prefix design-system test → 12 files, 31 passed (31)
```

Harness — all five keys, exactly matching the expected table:

```
buttons           2488f2d:index.html  index.html   → PASS, 85 pairs / 17 elements
segmented         021b966:index.html  index.html   → PASS, 45 pairs / 9 elements
toast             de07ea8:index.html  10e8f39:index.html → PASS, 5 pairs / 1 element
ds-disabled-hover 0c86d72:…/styles.css …/styles.css → PASS, 15 pairs / 3 elements
                                                      + 1 undecidable rule
toast-hit         3d3d5cc:index.html  index.html   → FAIL — 5 declaration(s) differ,
                                                      10 pairs / 2 elements,
                                                      0 markup problems, 0 unmatched
```

- The first three keys report **0 undecidable rules** — confirmed by running
  `grep -ci "undecidable"` on each (`0`, `0`, `0`), not inferred from `tail` not printing that
  block.
- `ds-disabled-hover`'s single undecidable rule is `.pui-menu__item:last-child`
  (`unreadable because: structural pseudo :last-child`; subject matches `.pui-menu__item`,
  `.pui-menu__item--danger`) — identical in both versions, as expected.
- **`toast-hit`'s FAIL is the expected, correct result**, not a regression: it pins the deliberate
  2026-08-24 `pointer-events:auto` behaviour change. I read all five `✗` rows with `grep "✗"`
  (not `grep -c "✗ #toast:"`, which has a documented blind spot on the `(base)` row that prints
  without a colon). All five are `#toastUndo` — `(base)`, `:hover`, `:disabled`,
  `:disabled:hover`, `:focus` — and **no `#toast` row appears**, which is the proof the app side
  was not touched.

Five channels, all negative:

1. `grep -c "| Option | Cost |" README.md` = **8** and `grep -c "If you answer:" README.md` = **8**
   (both run *after* the restore) → the two counters agree, so no decision was answered.
2. `git ls-files | grep -i jspdf` → empty; no `jspdf*` at the repo root.
3. `main` / `mac/main` / `origin` / `origin/main` = `ef3220e` (2026-06-27) — unmoved.
4. `git status --untracked-files=all --short` → empty.
5. Non-`auto/*` refs: newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13);
   `mac`/`mac/design-system` = `e3a355c`, `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3`
   (both 2026-07-20). Nothing newer than this work.

## What I did NOT do

- **Did not answer, apply, or work around any of the 8 open decisions.** Decisions 2, 5 and 6 are
  the last three gaps in the element-parity criterion; 1 and 4 each gate another criterion; 7 is
  the `:disabled:hover` cascade repair; 8 is whether to restore `docs/design-parity.md`. Each moves
  pixels or adds a file — owner's call, not an agent's.
- **Did not touch `Button.css`, `Menu.css` or `index.html`.** Worth stating plainly: if I had, the
  Verify command would still be green, because jsdom does no hit testing and no checker inspects
  `:hover`. Green is not evidence of restraint here — the empty diff is.
- **Did not tick any acceptance-criterion box.** No criterion advanced; ticking one would be false.
- **Did not add a seventh token check** (22/22 tokens are already covered by six checks — nothing
  left to enforce), **did not add the harness to the Verify command** (it is a per-round proof
  tool, not a must-stay-green checker), and **did not implement `:last-child`/combinator matching**
  in the harness. All three are on the explicit do-not-pick-up list.
- **Did not re-run the retrospective restore audit** (completed and closed in `2026-08-31_0023`).
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying without a permission change wastes a round. This is decision 4.
- **Did not trim `AUTOPILOT.md`**, now 1,843 lines. Its size is why the contract text reaches the
  agent truncated with an empty `## Next task`, but deleting round history is discarding evidence
  and is an owner decision.

## Risk

- **Nothing in this round changes behaviour**, so the blast radius is limited to two markdown
  files. The reviewer's cheapest check is `git diff --stat 1678112 HEAD` — it should show only
  `AUTOPILOT.md` and `SUMMARY.md`.
- **The real standing risk is the runner bug, not this round.** Every branch is still cut from
  `3503537`; 61 rounds have now had to hand-restore. A round that reads files *before* restoring
  sees a tree that does not look broken — it looks *finished* — and that has already caused
  permanent loss once (`2026-08-19_0022` dropped `docs/design-parity.md`, 44,376 bytes, still
  reachable at `c3351fc:docs/design-parity.md`). This will keep costing rounds until someone
  fixes the runner or merges to `main`.
- **`main` is still `ef3220e` with none of this work merged**, so 61+ `auto/*` branches now stack
  in parallel, each rebuilding the last. That is the structural problem behind everything above.
- **The `toast-hit` FAIL will keep looking like a failure to anyone skimming CI.** It is expected
  and pinned; the distinguishing detail is that all five differing rows are `#toastUndo` and none
  is `#toast`. If a `#toast` row ever appears, or the count is not 5, someone has touched the app.
- **No browser has ever verified this app**, across every round. All parity claims rest on source
  reading, CSS spec reasoning, and the cascade harness — which explicitly does **not** model
  inheritance. That gap is decision 4 and cannot be closed by an agent under current permissions.
