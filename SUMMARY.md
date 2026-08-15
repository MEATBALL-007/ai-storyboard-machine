# Round 2026-08-16_0002 — `--accent-rgb` (design-parity §8 item 3, option A′)

## What I did

- **Re-consolidated the branch first** (`b02577c`). The runner cut this round's branch from
  `3503537` again instead of the previous round's tip `6a4b9d7`, so rounds 0003/0013/0025/0036
  were invisible from HEAD — including `docs/design-parity.md` and the token assertion this
  round's task depends on. Third round running that this has happened.
- **Added `--accent-rgb:255,199,44` to `design-system/src/tokens.css`**, then mirrored it into
  `index.html`'s `:root`. Design-system side first, as the task specified.
- **Converted all 15 `rgba(255,199,44,α)` sites in `index.html`'s `<style>` block** to
  `rgba(var(--accent-rgb),α)`. Every alpha preserved byte-for-byte:
  `.4 .45 0 .5 .07 .4 .16 .85 .32 .6 0 .35 .05 .5 .9`. **Zero pixels change.**
- **Added assertion 62** pinning `--accent-rgb` to `--accent`'s channels — parses `--accent` as
  hex, compares against the three components of `--accent-rgb`.
- Updated `docs/design-parity.md` (§7.1 and §8 row 3) and `AUTOPILOT.md` to record what is done
  and what §7.1 says is deliberately left.

## Why

**Why A′ and not A.** §7.1 lists 18 distinct alphas across 23 sites. Option A (a set of
`--accent-aNN` tokens) forces a decision about whether `.4`/`.45`/`.5` collapse into one step —
that is a visible change, and §8 reserves visible changes for the owner. A′ needs one token and
zero decisions about the α scale, so it was the only variant of item 3 this round could complete
unattended.

**Why the substitution was scoped to `<style>…</style>` rather than pattern-matched.** The 15 CSS
sites happen to spell alpha bare (`.4`) while the 8 canvas sites spell it `0.4`, so a naive regex
would have looked correct. But that is a coincidence of formatting, not a rule — it would silently
break the first time someone wrote `rgba(255,199,44,0.4)` in CSS. I sliced the file at the style
block, which is the real boundary (CSS cascade vs. canvas 2D), and asserted **exactly 15
replacements inside and exactly 8 literals left outside**; the script throws on any other count.

**Why the new assertion checks `tokens.css` and not both files.** `tokens.css` is the declared
source of truth and assertion 55 already forces `index.html`'s `:root` to match it in both
directions. Checking both would produce two failures for one fault and point at the wrong file.

## Verification

Baseline on the consolidated tree, before any edit:

```
node tools/test.mjs   →  61 passed, 0 failed
```

Confirmed the token guard is genuinely bidirectional — after adding `--accent-rgb` to
`tokens.css` only:

```
60 passed, 1 failed
  ✗ index.html :root is out of sync ... is missing --accent-rgb:255,199,44
```

**Mutation-tested the new assertion in both directions** (each mutation applied to *both* files so
that `diffTokens` stayed green and only the new check could fire; restored via `git checkout` after
each):

| mutation | result |
|---|---|
| `--accent-rgb:255,199,44` → `255,199,45` | `61 passed, 1 failed` — `expected [255,199,44] got [255,199,45]` |
| `--accent:#FFC72C` → `#FF0000` | `61 passed, 1 failed` — `expected [255,0,0] got [255,199,44]` |

In both cases exactly one assertion failed, and it was the new one. The second mutation is the
real scenario the token exists for: rebrand the accent, and without this check 15 glows and tints
would silently stay yellow.

Full Verify command on the final tree:

```
node tools/test.mjs                 →  62 passed, 0 failed
npm --prefix design-system test     →  Test Files 12 passed (12) / Tests 31 passed (31)
```

`git diff` on `index.html` is 15 insertions + 15 deletions plus the one `:root` line — I read every
changed line to confirm no alpha moved and no canvas line was touched.

## What I did NOT do

- **The 10 canvas accent sites** (8 `rgba(...)`, 2 `'#FFC72C'`). §7.1 is explicit that canvas 2D has
  no CSS cascade, so these need `getComputedStyle` with the value cached once — a different kind of
  change, in draw functions called on every re-render. Task said separate round; I agree.
- **The 2 hard-coded accent literals inside the design system itself** —
  `Badge.css:8` (`.pui-badge--note`, α `.16`) and `Button.css:9` (`.pui-btn--primary:hover`, α `.4`).
  These are the exact counterparts of two app rules I *did* convert. It is a 2-line, zero-visual
  change and I was tempted, but the task scoped this round to the app's 15 CSS sites. I've written
  it into §7.1 and made it step 1 of the next task so it is not lost.
- **No guard forbidding new `rgba(255,199,44,…)` literals in the CSS block.** Step 4 of the task
  specified exactly one assertion and I stayed inside that. Worth considering later — nothing
  currently stops the literal being reintroduced.
- **Did not tick acceptance criterion 1.** The app still hard-codes `#7ac87a` in 5 places (§7.2)
  and has no spacing/type tokens at all (§7.3), so "uses custom properties instead of hard-coded
  color/spacing" is not honestly true yet. Added a progress note instead.

## Risk

- **Highest-value thing for a reviewer to check: the 15 alphas.** Collapsing or rounding even one
  would be a visual change smuggled in under a "no pixels change" claim. The full changed-line diff
  is in the commit message for `5d3ef0c` and every alpha is listed above.
- `rgba(var(--accent-rgb),α)` requires the browser to substitute a custom property inside a colour
  function. Supported everywhere `var()` is (all evergreen browsers, Safari 9.1+), and this project
  already depends on `var()` heavily for `--accent` itself — so no new floor. **Not verified in a
  real browser this round**; the test harness is Node-only and cannot render. Purely mechanical
  substitution, but it is a CSS-parse-level change and no automated test covers rendering.
- The consolidation commit `b02577c` squashes four rounds of history into one snapshot, because
  `git merge --ff-only` is refused by the sandbox even though `3503537` is a strict ancestor of
  `6a4b9d7`. Content is identical (`git diff --cached 6a4b9d7` was empty before committing), but the
  individual commit messages from rounds 0003–0036 are now only reachable from those old branches.
- **Unrelated pre-existing issue, not touched:** `index.html:10` loads jsPDF from
  `cdnjs.cloudflare.com`. That sits against acceptance criteria 3 and 4 (`file://` must work, no
  external references). It predates this work and is outside this round's scope, but neither of
  those boxes can be honestly ticked while it is there.
