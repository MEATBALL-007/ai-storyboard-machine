# Round summary — 2026-08-20

Task: make the last acceptance criterion (*tokens have a single source*) **enforceable**
rather than conventional. Tooling + docs only — no visual change.

## What I did

- **Added `tools/check-tokens.mjs`** — parses the single `:root{…}` block out of
  `design-system/src/tokens.css` and out of `index.html`, then asserts the two declare the
  same custom properties with the same values. Exits `0` in sync; exits `1` naming every
  property that is missing, extra, or differing. Kept deliberately out of `tools/test.mjs`
  so the advertised 54/54 assertion count is untouched.
- **Updated the Verify command** in `AUTOPILOT.md` to
  `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`.
- **Documented the sync procedure** in `README.md` under *"Design tokens — single source of
  truth"*: edit values only in `tokens.css`, paste the whole `:root` block over the one in
  `index.html`, run `node tools/check-tokens.mjs`.
- **Added a 3-line CSS comment** above `:root` in `index.html` pointing at `tokens.css` as
  the source of truth and naming the checker — so the rule is visible at the point of the
  copy, not only in the README.
- **Ticked the last acceptance criterion** (plus the two test-suite criteria, both green)
  and wrote the next task: channel tokens (`--accent-rgb` / `--secondary-rgb`).

## Why

The `:root` block in `index.html` is a hand-made copy of `tokens.css` — it has to be, since
the app must open from `file://` with no build step and so cannot `@import`. A copy is fine;
an *unwatched* copy is not. Before this round a one-character edit to either file would have
diverged the design language silently. The point of this round is that such an edit now
fails a command.

Two deliberate structural choices:

- **Separate script, not a new test in `tools/test.mjs`.** `test.mjs` extracts JS out of
  `index.html` via the `==PURE-LOGIC==` / `==TESTS==` markers and runs it in a VM — it
  asserts *app logic*. Token drift is a *file-consistency* fact. Folding it in would both
  change the `54 passed` number that the acceptance criteria pin, and conflate two failure
  meanings in one exit code.
- **The checker refuses to guess.** If either file ever grows a second `:root` block, it
  throws instead of silently checking the wrong one.

## Verification

Ran the full new Verify chain myself:

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```

```
54 passed, 0 failed
12 tokens in sync between design-system/src/tokens.css and index.html
Test Files  12 passed (12)
     Tests  31 passed (31)
```

**I also proved the checker actually goes red**, since a guard that has never failed is not a
guard. I temporarily mutated `index.html` and confirmed all three branches, then restored the
file (`git checkout -- index.html`, `git status` clean before re-applying the comment):

| Injected drift | Output | Exit |
|---|---|---|
| `--dim:#2E2E2F` | `✗ value differs for --dim: … has "#2E2E2E", index.html has "#2E2E2F"` | 1 |
| added `--bogus:1px` | `✗ extra in index.html (not in …tokens.css): --bogus: 1px` | 1 |
| deleted `--line` | `✗ missing in index.html: --line: #1c1c1c` | 1 |

Confirmed the app is untouched visually: the only change inside `index.html` is a CSS comment.

## What I did NOT do

- **No colour/spacing values changed anywhere.** Explicitly out of scope this round.
- **Did not add the near-miss values as tokens.** `#0a0a0a` vs `--panel:#0C0C0C`, and
  `#161616`/`#151515` vs `--line:#1c1c1c`, are close but not equal. Snapping them is a design
  decision for the owner, so it stays queued and flagged as *needs owner input*.
- **Did not add spacing/radius/type tokens.** `tokens.css` currently has none; adding them is
  its own round.
- **Did not wire the checker into a git hook or CI.** There is no CI config in this repo and
  adding one is beyond the named task; the runner executes the Verify command, which now
  includes it.
- One incidental correction: `README.md` said the headless suite had *42 assertions*; it has
  54. I fixed that number because I was editing the same code block, not as separate work.

## Risk

Points a reviewer should look at closely:

1. **The checker's parser is intentionally naive.** It takes the first `:root`, then the first
   `{` and the first `}` after it, and splits on `;`. That is correct for both files as they
   stand (verified: exactly one `:root` in each, no nested braces, no `;` inside any value),
   but it would mis-parse a value legitimately containing `;` or `}`. It strips `/* … */`
   comments and rejects a second `:root`, so the realistic failure modes are guarded — but it
   is a line-oriented parser, not a CSS parser.
   *Note the ordering constraint this creates:* the comment I added to `index.html`
   deliberately avoids the literal string `:root`, because a mention of it above the block
   would be found first by `indexOf`. If someone rewrites that comment to say ":root", the
   checker breaks. This is the sharpest edge introduced this round.
2. **The checker proves the copy matches; it does not prove the app *uses* the tokens.**
   Hard-coded colour literals equal to a token value elsewhere in `index.html` are still
   invisible to it. That gap is exactly what the next task starts closing.
3. **Next-task hazard, verified and written into `AUTOPILOT.md`:** of the 27 occurrences of
   `rgba(255,199,44,…)` / `rgba(250,70,22,…)` in `index.html`, **18 are in CSS and 9 are in
   canvas JS** (`ctx.fillStyle` / `ctx.strokeStyle`, lines ~1608–3196). `var(--accent-rgb)`
   only resolves through the CSS cascade — the Canvas 2D API would fail to parse it and paint
   transparent black with no error. A blind find-and-replace next round would silently damage
   the storyboard renderer.
