# Round summary — 2026-08-15_0003

Task: criterion 7 — make `design-system/src/tokens.css` the single enforced source of truth
for the app's design tokens.

## What I did

- **Added assertion #55 to `tools/test.mjs`** (commit `e5a1925`): it parses the `:root{…}` block
  out of both `index.html` and `design-system/src/tokens.css` and compares them **declaration by
  declaration, in both directions** — a token whose value differs, a token missing from
  `index.html`, and a token declared only in `index.html` each fail the run. Whitespace and
  indentation are normalized, so the 4-space vs 2-space difference is irrelevant and a pasted
  block passes whatever shape the editor leaves it in. It sits in `tools/test.mjs` outside every
  marker (the `vm` sandbox has no `fs`); **all four markers are untouched**.
- **Added a `## Design tokens` section to `README.md`** stating that `tokens.css` is the source of
  truth, why it is an inlined copy rather than an `@import` (the file:// no-build constraint), and
  the three-step procedure: edit `tokens.css` → paste the block over `index.html`'s `:root` →
  `node tools/test.mjs` fails if you forgot. Also corrected the stale "42 assertions" line to 55.
- **Found that this task had already been done on a branch that was never merged**, and recorded
  the underlying problem in `AUTOPILOT.md` under a new "⚠️ ปัญหาเชิงโครงสร้าง" heading. See Risk.
- Ticked acceptance criteria 5, 6, 7 in `AUTOPILOT.md` and rewrote **Next task** to branch
  reconciliation instead of design work.

## Why

- **Bidirectional, per-token comparison rather than line-by-line.** A positional line diff (what the
  earlier unmerged attempt did) fails spuriously the moment someone re-wraps or reorders
  declarations — both are meaning-preserving CSS edits. Comparing parsed maps only fails when the
  *tokens* actually differ. The reverse direction matters too: without it `index.html` could
  accumulate private tokens the design system never learns about, which is exactly how a
  "single source of truth" rots.
- **Structural problems throw, value mismatches assert.** This mirrors the existing `extract()`,
  which throws on a missing marker. A missing `tokens.css` is a broken checkout, not a failed test.
- **Next task changed to branch reconciliation** rather than the planned design work, because
  proceeding to criterion 2 would have repeated the same waste a third time (see Risk).

## Verification

Ran the Verify command myself, unmodified:

```
$ node tools/test.mjs && npm --prefix design-system test
55 passed, 0 failed
...
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

The assertion is not vacuous — I mutated the inputs three ways and confirmed each fails with
exit code 1, then reverted all three (`git diff --stat` afterwards showed only `tools/test.mjs`
changed, i.e. `index.html` and `tokens.css` were byte-identical to HEAD):

| Mutation | Output |
|---|---|
| `--accent` changed to `#FF0000` in `tokens.css` | `✗ … --accent is #FFC72C in index.html but #FF0000 in tokens.css` |
| `--newtoken` added to `tokens.css` only | `✗ … index.html :root is missing --newtoken:#123456` |
| `--stray` added to `index.html` only | `✗ … index.html :root declares --stray which tokens.css does not` |

No pixel changed: `index.html` is untouched by this round's commits.

## What I did NOT do

- **Did not touch the remaining hard-coded values** (accent-alpha, raw `#FFC72C`, greens, spacing,
  font sizes). Criterion 1 stays unticked. Those are design decisions and outside this task.
- **Did not cherry-pick the missing work from the sibling branches** — that is a second task, and
  hard rule 1 says one task per round. It is now the Next task.
- **Did not link `docs/design-parity.md` from the README.** I initially did, then removed it: that
  file does not exist on this branch (see Risk), so the link would have been broken.
- Did not touch `index.html`, `storyboard-simulator.html`, or any marker.

## Risk

**The most important thing in this summary is not the code — it is that this round duplicated work
that already existed.**

- `main` is still at `ef3220e "Add README"`. **No autopilot branch has ever been merged.** There are
  four of them: `2026-08-13_1633`, `2026-08-14_0008`, `2026-08-14_0023`, and this one.
- Every round is cut from the same base commit `3503537`, *not* from the previous round's tip. So
  each round starts blind to the last one's work.
- Commit `75c38ae` on `auto/…/2026-08-14_0008` is **criterion 7, already implemented** — token
  parity assertion plus a README "Design tokens" section. I found it only after finishing. My
  version is more robust (order- and formatting-independent, bidirectional), so I kept it, but the
  round was still largely redundant.
- `docs/design-parity.md` (`a1c6348`) and the annotated AUTOPILOT.md with the §8 decision list
  (`972502b`) live on `auto/…/2026-08-14_0023` and are **absent here** — which is why this branch's
  `AUTOPILOT.md` was the older, unannotated version. The task brief for this round quoted the
  annotated one and referenced `docs/design-parity.md` §8 as if it were present; it is not.
- The warning in round 0023's brief — that the 2026-08-13 work "was never committed" — is **wrong**.
  It was committed, on a branch nobody merged. Future rounds should check `git log --all` before
  concluding that prior work is missing.

**This cannot be fixed from inside the repo alone.** The runner must merge the PRs into `main`, or
cut each round's branch from the previous round's tip. Until then, expect every round to repeat
work and re-derive false status.

Two smaller things for a reviewer:

- The `:root` parser splits on `;`, which would mis-handle a `;` inside a quoted CSS value. No such
  value exists in either file today (`--mono` is the only quoted one), but a future token like
  `content:'a;b'` would confuse it.
- It matches the **first** `:root{…}` block in each file. Both files have exactly one today; a
  `:root` inside a future `@media` block would be ignored, silently.
