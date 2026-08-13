# Round summary — 2026-08-14

## What I did

- Added a **token-parity assertion** to `tools/test.mjs` (`tools/test.mjs:22-45`): it reads
  `design-system/src/tokens.css`, extracts the `:root{…}` block from both that file and
  `index.html`, strips the one extra indent level `index.html` adds, and compares line by line.
  On mismatch it fails and prints the tokens.css line, the index.html line, and the fix.
  Suite is now **55 assertions**.
- Updated `AUTOPILOT.md`: criterion 5 renumbered 54 → 55 and ticked, criterion 6 ticked
  (re-verified this round), criterion 7 ticked with a one-line description of how it is enforced.
- Wrote a **"Design tokens"** section in `README.md`: `tokens.css` is the single source of truth,
  `index.html` holds a verbatim copy, why it is a copy and not `@import`, the 3-step procedure for
  changing a value, and the rule that you never edit the `index.html` copy first.
- Fixed a stale number in the same README block: the dev-test line said "42 assertions", now 55.
- Rewrote `## Next task` in `AUTOPILOT.md` to the next single step (a no-code parity report,
  `docs/design-parity.md`) — see "What I did NOT do".

## Why

- **The check lives outside every marker.** `tools/test.mjs` already reads `index.html` as a
  string at line 4, and the parity check needs nothing from the sandboxed VM context, so it sits
  after `ctx.__TESTS(...)` and touches none of the `==PURE-LOGIC==` / `==TESTS==` markers. No new
  dependency, no build step.
- **Copy, not `@import`.** Keeping `index.html` double-clickable from `file://` is the project's
  stated selling point, so the duplication is deliberate. The point of this round was to make the
  duplication *enforced* instead of merely true-by-historical-accident.
- **Line-by-line, not `===` on the whole string.** A byte comparison can only say "different";
  the acceptance criterion asks for the differing line, and a failure that names the line is the
  difference between a 10-second fix and a hunt.
- **Trailing `\r` is normalised before comparing.** The working tree is CRLF here. A CR-only
  difference is not a token drift, and a spurious red build on a different platform would be worse
  than the (very small) laxity. Everything else — values, spacing, ordering, comments — is exact.

## Verification

Ran the Verify command from `AUTOPILOT.md`:

```
$ node tools/test.mjs && npm --prefix design-system test
55 passed, 0 failed

 Test Files  12 passed (12)
      Tests  31 passed (31)
```

I also ran a **negative test** to prove the new assertion actually bites: I temporarily changed
`--accent:#FFC72C` to `#FF0000` in `design-system/src/tokens.css` and re-ran:

```
54 passed, 1 failed
  ✗ token drift at :root line 4
      tokens.css : "  --accent:#FF0000; --secondary:#FA4616;"
      index.html : "  --accent:#FFC72C; --secondary:#FA4616;"
      fix: copy the :root block from design-system/src/tokens.css into index.html (README → Design tokens)
```

Exit code 1. I then restored `tokens.css` with `git checkout --` and confirmed
`git status --porcelain` showed only `tools/test.mjs` modified.

## What I did NOT do

- **Did not change a single colour value or any visual property.** `index.html` and `tokens.css`
  are byte-identical to their state at the start of the round (`git diff` on both is empty) — the
  only code change is in `tools/test.mjs`.
- **Did not start criterion 2** (button / chip / badge / modal / empty state parity). It is the
  named next task in the plan but it is a *different* task, and it needs owner decisions first.
- **Did not add spacing / radius / type-scale tokens**, and did not touch the ~29
  `rgba(255,199,44,α)` call sites or the untokenised green `#7ac87a`. Choosing between "move the
  app's colour" and "move the token" is a design decision, not an agent's.

## Risk

- **Finding a reviewer should know: last round's `SUMMARY.md` was never committed.** `HEAD` at the
  start of this round was `3503537` and the repo contained no `SUMMARY.md` at all, while the
  round's own `AUTOPILOT.md` still carried the *old* "Next task" text. So the inventory of
  non-matching values that the 2026-08-13 round says it produced does not exist in the repo. I
  have made re-producing it the next task. If the runner is dropping uncommitted output between
  rounds, that is worth looking at — this round's work is committed, so it should survive.
- The parity check assumes the `index.html` copy is indented exactly **two** spaces deeper than
  `tokens.css`. Re-indent the `<style>` block and the check fails with a confusing message even
  though no token drifted. This is documented in the README procedure but is a real sharp edge.
- `rootBlock()` finds the block by the first `:root{` and the first `}` after it. That is correct
  today (both files have exactly one, with no nested braces) but would silently pick the wrong
  block if a second `:root` were ever added above the token block in `index.html`.
- The check is one-directional in spirit only: it proves the two blocks are equal, not that
  `tokens.css` is the one that was edited. The README states the ordering rule; nothing enforces
  it, and nothing can.
