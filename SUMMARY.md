# SUMMARY — 2026-08-20

Branch: `auto/deep_dive_AI_Storyboard_Machine/2026-08-20_0025`
Commits this round: `f82f59b`, `5769e23`, plus this summary commit.

## What I did

- **Added channel tokens** `--accent-rgb:255,199,44` and `--secondary-rgb:250,70,22` to
  `design-system/src/tokens.css` (the single source), and mirrored the whole `:root` block
  into `index.html`. Values are the exact hex conversions of `--accent` `#FFC72C` and
  `--secondary` `#FA4616` — `FF/C7/2C = 255/199/44`, `FA/46/16 = 250/70/22`. No colour moved.
- **Collapsed all 18 hard-coded `rgba()` literals inside `<style>`** to
  `rgba(var(--accent-rgb), X)` / `rgba(var(--secondary-rgb), X)`. Verified afterwards that
  **0** such literals remain in the style block and that exactly **9** remain in the JS canvas
  code — untouched on purpose.
- **Wrote `tools/check-tokens.mjs`**, which the round's Verify command calls but which did not
  exist in the repo. It parses the `:root` block out of both `tokens.css` and `index.html`,
  compares custom properties by name and value (ignoring indentation, comments, line breaks),
  and exits non-zero on drift.
- **Added the README section "Design tokens — single source of truth"** — the three-step edit
  procedure (edit `tokens.css` → copy `:root` into `index.html` → run `check-tokens.mjs`), why
  the app mirrors rather than imports, the alpha/channel-token rule, and the canvas exception.
- **Rewrote `AUTOPILOT.md`** to match reality: ticked the three criteria that now genuinely
  hold, annotated the four that don't, added the canvas-`var()` ban to Out of scope, recorded
  the near-miss colours as an explicit owner decision, and set the next task.

## Why

**Why channel tokens at all.** CSS resolves `var()` by textual substitution *before* the value
is parsed, so `rgba(var(--accent-rgb), .4)` works while `rgba(var(--accent), .4)` cannot — a hex
string is not a valid first argument to `rgba()`. Shipping the channel form next to the hex form
is the standard way to make an alpha variant of a token without a preprocessor. It keeps the
"one file, no build step" constraint intact.

**Why the canvas literals stay.** `ctx.fillStyle`/`ctx.strokeStyle` are parsed by the 2D context,
which has no access to the CSSOM cascade. A `var()` there is not an error — it is an unparseable
colour, and the spec says an unparseable assignment is *ignored*, so the previous fill colour or
the default black persists. That failure is silent and would only show up as a visually wrong
storyboard render, which no test in this repo would catch.

**Why I created `check-tokens.mjs` and the README section rather than reporting them missing.**
The round's plan listed "single source of truth, with README procedure and `check-tokens.mjs`
enforcing it" as an already-completed criterion. It was not: `tools/` contained only `test.mjs`,
and the README had no such section. But the task's own step 2 says "copy the `:root` block per
the procedure in the README" and step 4 says "run all three Verify commands" — neither is
possible without them, and the Verify command could never go green. I treated them as
prerequisites of the named task, not as a second task. Everything else in the plan's next-round
list was left alone.

**Why `#0a0a0a`, `#161616`, `#151515`, `#222`, `#333` were not collapsed.** They are close to
`--panel`/`--line`/`--dim` but not equal. Collapsing them changes rendered colour, which is a
design decision, and the plan explicitly reserves it for the owner. They are tabulated in
`AUTOPILOT.md` under "Open decision" with both options spelled out.

## Verification

Ran the full Verify command from the plan:

```
$ node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
54 passed, 0 failed
tokens in sync: 14 custom properties match between tokens.css and index.html
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

Additional checks:

- Replacement counting, printed by the throwaway script that did the rewrite (removed afterwards;
  it is not in any commit): `replacements inside <style>: 18`, `literals remaining in <style>: 0`,
  `literals in JS tail (must stay): 9`. The rewrite operated only on the substring between
  `<style>` and `</style>`, so the canvas code was structurally out of reach, not just avoided.
- **Negative test of the new checker** — a checker that cannot fail proves nothing. Perturbed
  `--accent-rgb` to `255,199,45` in `index.html` and re-ran it:
  `✗ value drift: --accent-rgb is "255,199,44" in tokens.css but "255,199,45" in index.html`,
  exit 1. Restored with `git checkout index.html`; the check went green again.
- Re-grepped `index.html` for external references: still exactly the 4 pre-existing ones
  (3 × `fonts.googleapis`/`fonts.gstatic`, 1 × `cdnjs` jsPDF). Nothing added.

## What I did NOT do

- **Did not touch the 9 `rgba()` literals in the canvas drawing code** (lines ~1605–3193). See Why.
- **Did not resolve the near-miss colours.** Owner decision; tabulated in `AUTOPILOT.md`.
- **Did not add spacing/radius/type tokens.** That is the next task, deliberately not started.
- **Did not verify `file://` behaviour.** This is a headless server with no browser; I can assert
  that nothing I changed requires a server, but I did not open the file, so I left that
  acceptance box unticked rather than tick it on reasoning alone.
- **Did not fix the README's stale "42 assertions"** (the suite has 54). Pre-existing, unrelated
  to this task, and I did not want to bury a real change under drive-by edits.

## Risk

- **Highest-value thing to review: the 18 rewritten lines.** Read `git show f82f59b -- index.html`.
  The failure mode of a bad channel token is not a crash — it is a slightly wrong or fully
  transparent colour that no test in this repo asserts on. The values are arithmetically correct
  and the diff is mechanical, but nothing here proves the *rendered* result; only a human looking
  at the app can. In particular check `@keyframes editPulse`, where two `rgba()` calls sit inside
  one keyframe block, and `box-shadow:0 0 0 rgba(var(--accent-rgb),0)` on `#genBtn`, where the
  alpha is `0`.
- **`rgba(var(--x-rgb), a)` needs the browser to substitute `var()` before parsing the function.**
  Every current browser does; anything predating CSS Custom Properties Level 1 does not, and would
  drop those declarations entirely (shadows and tints simply vanish — the layout survives). The app
  already requires modern browsers, so this does not narrow support in practice.
- **`check-tokens.mjs` is new and I wrote both it and the thing it checks.** Its `:root` matcher is
  `/:root\s*\{([^}]*)\}/` — it takes the *first* `:root` block and cannot handle a nested brace
  inside one. That is fine for both files today, and it would fail loudly (`No :root block found`)
  rather than silently pass if that changed. Its negative test above is what makes it credible;
  re-run that if you distrust it.
- **The plan I was given asserted three finished criteria that were not finished.** I filled in two
  of them (`check-tokens.mjs`, README section) because the task could not run otherwise, and
  corrected `AUTOPILOT.md` to stop repeating the claim. Worth a glance to confirm you agree that
  was the right call rather than stopping the round.
- **Acceptance criterion "opens over `file://` and works fully" is in tension with the pre-existing
  CDN loads.** jsPDF comes from `cdnjs`, so PDF export already fails offline. Not caused by this
  round, but it will block that box from ever being ticked honestly. Flagged in `AUTOPILOT.md`.
