# Round 2026-09-07_0018 — no-op (no owner answer on any of the 8 open decisions)

## What I did

- **Restored the previous round's tip `e9a8ccf` (`…/2026-09-07_0010`) onto the stale base.**
  `git log --oneline -1` showed `3503537` again — the runner still cuts every `auto/*` branch from
  that commit, never from the previous round's tip. Restore commit kept separate so this round's
  real diff stays readable. `git diff --stat e9a8ccf` after the checkout was **empty** = total
  restore (4,757 insertions across 16 files recovered).
- **Checked all five owner-answer channels. Nothing has been answered.** All 8 decisions in
  `README.md → ## Open decisions` still stand unanswered.
- **Ran the full Verify command (3 stages) and all 5 harness keys.** Every number matches the
  expected table in `AUTOPILOT.md`.
- **Wrote this round's status block into `AUTOPILOT.md`** and updated `## Next task` to name
  `2026-09-07_0018` as the tip the next round must restore, with a sharpened tie warning.
- **Resolved round `_0010`'s tip-selection forecast: heads — but by luck, not by construction**
  (see Why).

## Why

**Why the round is a no-op and not "find something useful to do".** `AUTOPILOT.md`'s Next task
block says, in as many words: if no decision has been answered, restore the tip, check the five
channels, run Verify + the 5 harness keys, write SUMMARY, end the round — *ห้ามประดิษฐ์งานอื่น
เด็ดขาด* ("absolutely do not invent other work"). Every remaining acceptance criterion is gated on
a decision that moves pixels or adds a file to the repo, so it is the owner's call, not an
agent's. Fallback work that touches code is exhausted (token tooling is 22/22 with six checks, the
parity table is closed at 11/11), and the last read-only fallback — the retrospective restore
audit — was completed in round `2026-08-31_0023` and is explicitly marked do-not-repeat.

**Why I used path-checkout instead of the fast-forward it qualified for.** `git merge-base
--is-ancestor HEAD e9a8ccf` passed, so a true fast-forward was available and would have been the
cleanest restore — identical history, no new commit object. `git merge --ff-only` was
**permission-blocked**, both chained and as a bare single command. I fell back to
`git checkout e9a8ccf -- .` + commit, which is tree-equivalent here because
`git diff --diff-filter=D --name-only 3503537 e9a8ccf` is empty (no deletions to miss — a
path-checkout cannot remove files the tip dropped, which is the one way this fallback diverges
from a merge). I recorded the block in `AUTOPILOT.md` so the next round does not spend a call
retrying `merge` first.

**Why channel 1 is checked only *after* the restore.** On the stale `3503537` tree `README.md`
has no `## Open decisions` section at all, so the counter returns 0 — which reads as "the owner
deleted the section" when it actually means "you are on the stale tree".

**Why round `_0010`'s forecast resolved heads, and why that is not reassuring.** `_0010` predicted
that `2026-09-07` would hold two tips, so the sha-before-refname formula would be a coin flip
against `c197cda` (leading `c`): a closing sha starting `d`–`f` wins row 1 by accident, `0`–`b`
loses and silently discards the round. The actual tip is `e9a8ccf` — leading `e`, inside the
winning range. So the trap did not fire. **But this is the same accidental survival as rounds
`_0028`/`_0036`, not the structural safety `_0010` itself enjoyed as a single-tip day.** The
correct reading is "the wrong formula got lucky again", not "either formula works".

**Why I did not re-run the `:short` A/B.** `AUTOPILOT.md:363` records that the evidence has been
sufficient since round `2026-09-04_0048` (which caught a real row 3–4 swap) and that future rounds
need not repeat it. The forecast above is resolvable from the leading hex digit of a sha I read out
of the `for-each-ref` this round already runs, so an A/B would add nothing.

## Verification

Verify command (`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`)
— run as three separate invocations because chained commands are permission-blocked in this
environment; **all three stages green**:

- `node tools/test.mjs` → `54 passed, 0 failed`
- `node tools/check-tokens.mjs` → all 6 checks pass at **15 CSS sources**: tokens 22/22, fonts 4/4
  byte-identical, no derived-colour literals, every font-weight ∈ {400,500,700,800}, every
  `border-radius` reads a `--r-*` token, every `font-family` reads `var(--mono)`
- `npm --prefix design-system test` → `12 passed (12)` files, `31 passed (31)` tests

All 5 harness keys (`docs/btn-parity-proof.mjs`), each matching the expected table exactly:

| key | pairs / elements | result |
|---|---|---|
| `buttons 2488f2d:index.html index.html` | 85 / 17 | PASS, markup 7 old gone / 5 new |
| `segmented 021b966:index.html index.html` | 45 / 9 | PASS, markup 0 / 3 |
| `toast de07ea8:index.html 10e8f39:index.html` | 5 / 1 | PASS, markup 0 / 1, **no undecidable** |
| `ds-disabled-hover e9a8ccf:…/styles.css …/styles.css` | 15 / 3 | PASS + **1 undecidable** (`.pui-menu__item:last-child`, `structural pseudo :last-child`), markup `N/A — the source is a stylesheet` |
| `toast-hit 3d3d5cc:index.html index.html` | 10 / 2 | **FAIL — 5 declaration(s) differ** (the correct, expected result), 0 markup problems, 0 unmatched |

`toast-hit`'s five `✗` rows were read in full and are **all `#toastUndo`** (`(base)`, `:hover`,
`:disabled`, `:disabled:hover`, `:focus`) with **none on `#toast`** — confirming the app side was
not touched. I used `grep -E "✗|compared|PASS|FAIL|markup|unmatched|undecidable"`, not
`grep -c "✗ #toast:"`, which has a documented blind spot: the base-state row prints as
`✗ #toast (base)` with no colon, so that pattern returns 0 in exactly the regression case it
exists to catch.

`ds-disabled-hover`'s before side was read from the tip I actually restored (`e9a8ccf`), not
copied from an older status block.

Restore preconditions:

- `git merge-base --is-ancestor HEAD e9a8ccf` → ancestor-ok (HEAD was exactly `3503537`)
- `git diff --diff-filter=D --name-only 3503537 e9a8ccf` → **empty** (no deletions, so
  path-checkout is tree-equivalent to a fast-forward)
- `git diff --stat e9a8ccf` after checkout, before commit → **empty** = byte-identical tree
- `git log -1 --format="%h %an <%ae> %ad %s" e9a8ccf` → author `PHANTOM AUTOPILOT
  <autopilot@phantom.local>`, subject `chore: round 2026-09-07_0010 no-op -- five channels
  checked, no owner answer` = the runner's own commit, **not** an owner answer
- local and `origin/` both point at `e9a8ccf`
- tip chosen with `git for-each-ref --sort=-committerdate` (full resolution) and cross-checked by
  refname: `_0010` is the highest round number below my own `_0018`. Never by row number.

Five channels:

1. `grep -c "| Option | Cost |" README.md` = **8**; `grep -c "If you answer:" README.md` = **8**
   → both counters agree, so nobody answered (them disagreeing is itself the signal)
2. `git ls-files | grep -i jspdf` → empty
3. `main` = `ef3220e` (2026-06-27), unmoved
4. `git status --porcelain --untracked-files=all` → empty
5. non-`auto/*` refs: `design-system`/`origin/design-system` = `3503537` (2026-08-13, newest of the
   group), `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — nothing newer than the work

## What I did NOT do

- **Did not answer, or act on, any of the 8 open decisions.** Each moves pixels or adds a file;
  they are the owner's call. In particular I left decisions 2 / 5 / 6 (chip padding, segmented
  padding, input sizes) and 7 (`:disabled:hover` guards lost to the cascade) untouched.
- **Did not restore `docs/design-parity.md`** (decision 8) — still reachable at
  `c3351fc:docs/design-parity.md`, but reinstating it is a git-history judgement call.
- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte. This
  round's diff is `AUTOPILOT.md` + `SUMMARY.md` plus the separate restore commit.
- **Did not trim `AUTOPILOT.md`** (2,804 lines / 375,254 bytes before this round's edit).
  Its size is why `## Next task` reaches the agent empty in the prompt, but deleting round history
  is discarding evidence and is an owner decision.
- **Did not rename the older status-block headers** even though two now read `สถานะรอบก่อน`.
  Duplicate labels are already the established pattern further down the file (`สถานะก่อนหน้านั้น`
  and `สถานะเก่ากว่านั้น` each appear twice); every block is disambiguated by its round number,
  and a cascading rename of 70+ blocks would bury this round's real diff.
- **Did not re-run the `:short` A/B** (evidence sufficient since `2026-09-04_0048` — see Why) or
  the retrospective restore audit (completed `2026-08-31_0023`, marked do-not-repeat).
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools are *permission*-blocked, not
  merely headless; retrying burns a round without a permission change (decision 4).

## Risk

- 🔴 **The runner bug is unfixed and the stall is now ~3 weeks old.** Every `auto/*` branch is
  still cut from `3503537`, and nothing has ever been merged to `main` (`ef3220e`, 2026-06-27).
  ~76 branches now stack in parallel. No round can fix this; it needs a person.
- 🔴 **Next round the tie is the tightest yet recorded.** After this round's commits, `2026-09-07`
  holds **three** tips (`c197cda` = `_0000`, `e9a8ccf` = `_0010`, and mine). A truncated-date sort
  ties all three. The `refname`-before-`sha` form is safe by construction (`_0018` > `_0010` >
  `_0000`, zero-padded); the `sha`-before-`refname` form must now beat **both** `e9a8ccf` (leading
  `e`) and `c197cda`, so only a closing sha starting `f` survives — **~1/16, down from 3/16 last
  round**. Anything `0`–`d` restores `_0010` and silently discards this whole round. Use
  `--sort=-committerdate`. This round cannot resolve its own forecast (writing its sha changes its
  sha); the next round resolves it from the `for-each-ref` it already runs.
- ⚠️ **A wrong-tip restore is undetectable downstream in a no-op round.** Because no-op rounds
  touch only `AUTOPILOT.md`/`SUMMARY.md`, restoring the wrong sibling leaves an empty
  `git diff --stat` against that wrong tip, all five harness keys matching, and all three Verify
  stages green. The refname cross-check is the only cheap guard — never pick by row number.
- ⚠️ **The restore was a path-checkout, not a fast-forward** (`git merge --ff-only` is
  permission-blocked). It is tree-equivalent *only because* the deletion check came back empty; a
  reviewer should confirm that check rather than assume path-checkout is always safe. The
  branch therefore carries an extra restore commit instead of sharing `_0010`'s history.
- ⚠️ **Nothing here was verified in a real browser** (decision 4). The green result covers the
  node test suite, the token checker and the cascade harness; it says nothing about how the page
  actually renders or responds to a click.
- ⚠️ **`ds-disabled-hover`'s 1 undecidable rule (`.pui-menu__item:last-child`) is genuinely not
  covered** by its PASS. The harness reports it honestly; it is identical in both versions, but
  the PASS makes no claim about it.
