# SUMMARY — round 2026-11-02_0027

## What I did
- Restored the previous round's tip `bda6403` (`2026-11-02_0017`; the local and `origin/` refs agree)
  onto this branch. The runner had cut this branch from the stale `3503537` again. The restore is its
  own commit.
- Checked all five owner-answer channels. None has an answer, so this round is a planned **no-op**,
  as the restored `AUTOPILOT.md` Next task says.
- Ran the Verify command and all five parity-harness keys. Every result matches the previous round.
- Added this round's entry to the `## Next task` block in `AUTOPILOT.md`. The "tip to restore" line
  now points at `2026-11-02_0027`.

## Why
- The prompt's Next task was **empty**, so I followed the Next task in the restored repo file
  instead of making one up (hard rule 5).
- All remaining acceptance-criterion work waits on eight owner decisions in `README.md → ## Open
  decisions`. Each one either moves pixels or adds a file, so the agent must not answer any of them.
- `_0017` predicted a real tiebreak for this round, and it happened. After I dropped my own ref
  (`1515029`), `2026-11-02` held 2 tips. Ranking by `--sort=-committerdate` correctly put `bda6403`
  in row 1. Ranking by sha with `| sort -r` would have put `ccba208` in row 1 and thrown away `_0017`
  (`node -e "console.log('bda6403'<'ccba208')"` → `true`). That makes this round **TAILS**, and the
  count of rounds where the sha ranking picks the wrong tip goes to **104/159 (104/155)**.

## Verification
- `git rev-parse HEAD^{tree} bda6403^{tree}` printed the same sha twice
  (`49a106ab8058411a3184bc9ec8bac27df58e327d`), so the restore matches on every path.
- Channels:
  - `grep -c "| Option | Cost |" README.md` → 8, and `grep -c "If you answer:"` → 8.
  - No `jspdf` file is tracked or on disk.
  - `git status --short --untracked-files=all` printed nothing.
  - `main` / `origin/main` / `mac/main` are still `ef3220e`.
  - The newest non-`auto/*` ref is 2026-08-13 (`design-system` `3503537`).
- Verify (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`),
  run without filtering:
  - `54 passed, 0 failed`
  - check-tokens: all 6 lines OK (22/22 tokens, 4/4 fonts, 15 CSS sources)
  - vitest: `12 passed (12)` files, `31 passed (31)` tests
- Harness (`docs/btn-parity-proof.mjs`):
  - `buttons` `2488f2d:index.html index.html`: 85 pairs / 17 elements, PASS, markup OK
  - `segmented` `021b966:index.html index.html`: 45 / 9, PASS
  - `toast` `de07ea8:index.html 10e8f39:index.html`: 5 / 1, PASS
  - `ds-disabled-hover` `bda6403:design-system/src/styles.css design-system/src/styles.css`: 15 / 3,
    PASS + `1 undecidable rule(s)`
  - `toast-hit` `3d3d5cc:index.html index.html`: 10 pairs, `FAIL — 5 declaration(s) differ`. All five
    `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`, `:disabled:hover`, `:focus`) and none
    is `#toast`. This FAIL-5 is the expected result.

## What I did NOT do
- I answered none of the eight open decisions and made no change to `index.html`, the design-system
  CSS, or the tests. Without an owner answer, any of those would be an invented task.
- I did not try the browser MCPs. Decision 4 says they are permission-blocked.

## Risk
- Low. The branch diff is a byte-for-byte restore of `bda6403` plus a documentation-only edit to
  `AUTOPILOT.md` and this file.
- The runner still cuts every branch from `3503537`, and nothing has been merged to `main`, so the
  stall continues. It needs a person to answer `README.md → ## Open decisions` (or merge a branch).
  Another round won't clear it.
- The next round is another real tiebreak if it runs on 11-02. There will be 3 tips and the comparand
  stays `ccba208`. The sha ranking would discard `_0017`+`_0027` if this round's closing sha < `ccba208`.
