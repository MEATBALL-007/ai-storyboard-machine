# Round 2026-09-08_0036 — no-op (blocked on owner decisions)

## What I did

- **Detected the stale base and restored the previous round's tip.** The runner cut this branch from
  `3503537` (the original contract commit), so the tree was missing every round of prior work —
  no `tools/check-tokens.mjs`, no `docs/btn-parity-proof.mjs`, `index.html` back at 191 KB with 3
  live CDN/font references, and no `## Open decisions` in `README.md`. Ranked tips date-major with
  `for-each-ref --sort=-committerdate` and restored `22c8aea` (`_0026`) as its own commit.
  Residual `git diff 22c8aea --stat` is **empty**, and `ls tools` shows `check-tokens.mjs` present —
  the one-call tell that the tree is the real one and not the stale base.
- **Checked all five owner-answer channels — none has been answered.** Details below.
- **Ran the full three-stage Verify plus all five harness keys.** All green / all at expected counts.
- **Resolved round `_0026`'s ranking forecast as TAILS** from this round's own `for-each-ref` output,
  and wrote the next forecast (damage case now **3 rounds**) into `AUTOPILOT.md`'s Next task block.
- **Did nothing else.** No `.css`, no `.html`, no `.mjs` touched. Only `AUTOPILOT.md` and `SUMMARY.md`.

## Why

The queued Next task says explicitly: if no owner decision has been answered, do a no-op round —
restore, check five channels, run Verify + the five harness keys, write SUMMARY, stop, and **do not
invent other work**. All eight decisions in `README.md → ## Open decisions` are still unanswered, so
that is the whole round. Fallback work that touches code is genuinely exhausted (token tooling is
22/22 across six checks, the parity table is closed at 11/11), and every remaining item moves pixels,
adds a file to the repo, or rewrites history — none is an agent's call.

The restore used a **path checkout** (`git checkout 22c8aea -- .`) rather than a reset or a
fast-forward merge. That was not a preference: `git reset --hard` was denied by permission and
`git merge --ff-only` requires approval in this environment. The path checkout reproduces the same
tree as a new commit, which is also what round `_0026` did (`49e92c9`). I confirmed ancestry first
with `git merge-base --is-ancestor 3503537 <tip>` — had that been false, a checkout would have
silently mixed two lineages.

## Verification

Three-stage Verify, run from the restored tree:

```
node tools/test.mjs               → 54 passed, 0 failed
node tools/check-tokens.mjs       → tokens in sync: 22/22 identical in index.html
                                    fonts in sync: 4/4 embedded byte-identical
                                    no derived-colour literals: 15 CSS source(s)
                                    font weights available: 15 CSS source(s), all of 400/500/700/800
                                    no radius literals: 15 CSS source(s), every border-radius reads --r-*
                                    typeface from one source: 15 CSS source(s), every font-family var(--mono)
npm --prefix design-system test   → 12 test files, 31 passed
```

**All five harness keys, at their expected counts** (independent evidence the restore was complete —
an empty diff only proves bytes match a ref, whereas the harness recomputes each element's
cascade-winning declaration set from the files actually standing):

```
node docs/btn-parity-proof.mjs buttons           2488f2d:index.html index.html
  → PASS, compared 85 (element,state) pairs across 17 elements
    markup coverage OK — 7 old class tokens gone, 5 new class attributes
node docs/btn-parity-proof.mjs segmented         021b966:index.html index.html
  → PASS, compared 45 pairs across 9 elements; markup 0 old gone, 3 new
node docs/btn-parity-proof.mjs toast             de07ea8:index.html 10e8f39:index.html
  → PASS, compared 5 pairs across 1 element; markup 0 old gone, 1 new  (both sides pinned)
node docs/btn-parity-proof.mjs ds-disabled-hover 775deb2:design-system/src/styles.css design-system/src/styles.css
  → PASS, compared 15 pairs across 3 elements, + 1 undecidable rule (.pui-menu__item:last-child)
node docs/btn-parity-proof.mjs toast-hit         3d3d5cc:index.html index.html
  → FAIL — 5 declaration(s) differ, 0 markup problems, 0 unmatched   ← the CORRECT result for this key
```

`toast-hit` is **supposed** to fail: its before-side is pinned prior to the deliberate
`pointer-events:auto` fix on `.toast-act`, so 5 differing declarations is the fix being visible.
I read it by listing the `✗` rows, not by exit code. All five are `#toastUndo` (`(base)`, `:hover`,
`:disabled`, `:disabled:hover`, `:focus`) and **none is `#toast`** — which is what proves `#toast`
still carries `pointer-events:none`. (Per the prior round's warning I did **not** use
`grep -c "✗ #toast:"`; the base row prints `✗ #toast (base)` with no colon, so that pattern returns
0 in exactly the regression case it exists to catch. I listed all `✗` rows instead.)

**Five channels, all negative:**

| # | Channel | Result |
|---|---|---|
| 1 | `README.md → ## Open decisions` | `grep -c "If you answer:"` = **8**, `grep -c "\| Option \| Cost \|"` = **8** — agree, so no answer appended |
| 2 | `jspdf.umd.min.js` at repo root | `git ls-files \| grep -i jspdf` → empty |
| 3 | `main` | still `ef3220e` (2026-06-27 "Add README"), unmoved |
| 4 | uncommitted drop | `git status --untracked-files=all --short` → empty |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` at **2026-08-13** — older than all this work; `mac/*`, `hardening-pass`, `main` older still |

Channel 1 was run **after** the restore. On the stale base that section does not exist and the count
returns 0, which would misread as "the owner deleted the decisions".

## What I did NOT do

- **Did not answer any of the eight open decisions.** Decisions 2/5/6 are the last three gaps in the
  element-parity criterion, 1 and 4 each gate another criterion, and 7 would change visible hover
  colours in both `Button.css` and the app's own `.menu-pop button.danger:hover`. All owner calls.
- **Did not restore `docs/design-parity.md`** (decision 8). Still reachable at
  `c3351fc:docs/design-parity.md`; it blocks no acceptance criterion.
- **Did not re-run the `:short` vs `:iso8601` A/B.** `2026-09-04_0048` measured it live and
  `AUTOPILOT.md` records the evidence as sufficient.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying without a permission change burns the round.
- **Did not append a `> **สถานะล่าสุด …` block to `AUTOPILOT.md`.** Per the convention started in
  `_0035` (this is the sixth round following it), a no-op round edits only the Next task block — the
  file is ~2,900 lines / ~392 KB and its size *is* why `## Next task` reaches the prompt empty.
  Nothing was deleted; trimming old blocks remains an owner decision.
- **Did not tick any acceptance criterion.** None advanced.
- **Did not trim, reorder or delete anything in `README.md`.**

## Risk

- **Nothing in the repo changed except two docs files**, so functional risk this round is nil. The
  only reviewable question is whether the tip selection was right — see below.
- 🔴 **The wrong-tip trap is now a 3-round damage case, and it is silent.** After this round
  `2026-09-08` holds four tips (`_0006` `81af905`, `_0016` `775deb2`, `_0026` `22c8aea`, and this
  round's). They tie at *day* granularity, so any ranking that sorts on a truncated date and breaks
  the tie on the **sha** picks `81af905` (`_0006`) and discards `_0016`, `_0026` **and** this round
  at once. `_0026`'s forecast called this correctly: its tip `22c8aea` starts with `2` ∈ `0`–`7`,
  so the wrong formula lost again — **6 of 7**. The fix is unchanged and one flag:
  always rank with `--sort=-committerdate` (full resolution), never a `| sort -r` pipeline.
- ⚠️ **A reviewer should not read the empty `git diff` as proof the restore was faithful** on its own.
  It proves the tree matches `22c8aea`; it does not prove `22c8aea` was the right tip. The refname
  check (`_0026` is the highest round number on the newest date, below my own `_0036`) is the part
  that establishes that, and I ran it from `for-each-ref` output rather than copying a sha.
- ⚠️ **`toast-hit` exits non-zero by design.** A runner that gates on exit codes across all five keys
  will see a failure here. That is expected and documented above; it is not a regression.
- ⚠️ **The project has now spent six consecutive rounds producing no product change.** Every
  acceptance-criterion-advancing path is gated on the eight decisions. This is correct behaviour
  under the contract, but the honest read is that **the loop cannot make progress until the owner
  answers at least one decision** — more rounds will not change that.
