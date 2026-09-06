# Round 2026-09-07_0027 — no-op (no owner answer on any of the 8 open decisions)

## What I did

- **Restored the previous round's tip `375e0f5` (`…/2026-09-07_0018`) onto the stale base.**
  `git log --oneline -1` showed `3503537` again — the runner still cuts every `auto/*` branch from
  that commit, never from the previous round's tip. Restore kept as its own commit so this round's
  real diff stays readable. `git diff --stat 375e0f5 -- .` after the checkout was **empty** = total
  restore.
- **Checked all five owner-answer channels. Nothing has been answered.** All 8 decisions in
  `README.md → ## Open decisions` still stand.
- **Ran the full Verify command (3 stages) and all 5 harness keys.** Every number matches the
  expected table in `AUTOPILOT.md`.
- **Resolved round `_0018`'s tip-selection forecast: TAILS — the damage case would have been real,
  and it is now a 2-round damage case going forward** (see Why).
- **Wrote this round's status block into `AUTOPILOT.md`** and updated `## Next task` to name
  `2026-09-07_0018` → `2026-09-07_0027` as the tip the next round must restore.

## Why

**Why a no-op is the correct outcome.** The queued `## Next task` (read from the *restored*
`AUTOPILOT.md`, line 340 — the prompt's copy arrives truncated and empty because the file is now
2,864 lines / 383,912 bytes) says: check `## Open decisions` first; if nothing is answered, restore
the tip, check the five channels, run Verify + the five harness keys, write SUMMARY, end. Inventing
a substitute task is explicitly forbidden, and the two fallback pools are both closed — token
tooling is 22/22 across six checks, the element-parity table is closed at 11/11, and the last
read-only fallback (the retrospective restore audit) was finished in round `2026-08-31_0023`. What
is missing is a decision, not more analysis.

**Why the restore had to come before reading anything.** On the stale `3503537` tree the app's
`:root` really is byte-identical to `tokens.css`, so the tree *looks finished* rather than broken —
round `2026-08-28_0004` lost a whole round to exactly that. The one-call tell is `ls tools`: it
showed `check-tokens.mjs` next to `test.mjs` only *after* the restore.

**Why `git checkout <tip> -- .` is safe here.** A path checkout cannot remove a file the tip
deleted, so it is only tree-equivalent to a fast-forward when the diff deletes nothing.
`git diff --diff-filter=D --name-only HEAD 375e0f5` was empty, and
`git merge-base --is-ancestor 3503537 375e0f5` passed. Per `AUTOPILOT.md:457–459` I did **not**
spend a call trying `git merge --ff-only` first — it is permission-blocked here.

**Resolution of round `_0018`'s forecast — TAILS.** `_0018` predicted that with three tips on
`2026-09-07` a *sha-before-refname* pipeline would have to beat both `e9a8ccf` (leading `e`) and
`c197cda` (leading `c`), so only a closing sha leading `f` would land accidentally right (~1/16).
Its closing sha is **`375e0f5`, leading `3`** — inside the `0`–`d` branch. So that formula would
have picked `e9a8ccf` (`_0010`) and **discarded all of `_0018`**. This round selected with
`%(committerdate:iso8601)` (full second precision, no tie to break) and cross-checked by refname
(`_0018` is the highest round number below my own `_0027`); both methods agreed on `375e0f5`.

**Forecast for the next round — the damage case grows to 2 rounds.** After this round's commit,
`2026-09-07` holds **four** tips (`c197cda` `_0000`, `e9a8ccf` `_0010`, `375e0f5` `_0018`, and this
round's). Under a truncated-date key they all tie, and `e9a8ccf` still leads the set:
- refname-before-sha → tie falls to the refname, `_0027` > `_0018` > `_0010` > `_0000`
  (zero-padded) = **correct by construction, whatever the sha**.
- sha-before-refname → a closing sha leading `f` is accidentally right; `0`–`d` hands row 1 to
  `e9a8ccf` and discards **both `_0018` and this round**; exactly `e` is decided against `9a8ccf`.

A round cannot resolve its own forecast (writing its sha changes that sha), so this stays
conditional — the next round resolves it from the `for-each-ref` call it already makes. The
permanent fix is unchanged: always `--sort=-committerdate` or `:iso8601`, never a truncated date as
a shell sort key.

## Verification

**Verify command — all three stages green:**

```
node tools/test.mjs        → 54 passed, 0 failed
node tools/check-tokens.mjs → tokens 22/22 · fonts 4/4 · no derived-colour literals (15 CSS sources)
                              · font weights 400/500/700/800 · no radius literals · font-family 1 source
npm --prefix design-system test → 12 test files, 31 passed (31)
```

**All 5 harness keys, every number matching the expected table:**

| key | command | result |
|---|---|---|
| `buttons` | `2488f2d:index.html index.html` | PASS — 85 pairs / 17 elements, markup 7 gone / 5 new |
| `segmented` | `021b966:index.html index.html` | PASS — 45 pairs / 9 elements, markup 0 gone / 3 new |
| `toast` | `de07ea8:index.html 10e8f39:index.html` | PASS — 5 pairs / 1 element, markup 0 / 1, **no undecidable** |
| `ds-disabled-hover` | `375e0f5:design-system/src/styles.css design-system/src/styles.css` | PASS + 1 undecidable rule; markup `N/A — the source is a stylesheet` |
| `toast-hit` | `3d3d5cc:index.html index.html` | FAIL — 5 declarations differ, 10 pairs / 2 elements, 0 markup problems, 0 unmatched |

`toast-hit`'s FAIL-5 is its **correct** result — it measures the deliberate 2026-08-24
`pointer-events:auto` fix. Read with `grep -E "✗|compared|PASS|FAIL|markup|unmatched|undecidable"`
as round `_0043` requires: all five `✗` rows are `#toastUndo` (`(base)`, `:hover`, `:disabled`,
`:disabled:hover`, `:focus`) and **none is `#toast`** — which is the proof `#toast` still carries
its `pointer-events:none`. The old `grep -c "✗ #toast:"` shortcut cannot see the `✗ #toast (base)`
row (no colon) and returns 0 in exactly the regression case it exists to catch.

**Five owner-answer channels, all negative:**

1. `grep -c "| Option | Cost |" README.md` = **8** and `grep -c "If you answer:" README.md` = **8**
   — the two counters **agree**, which is the signal that nobody answered (both run *after* the
   restore; on the stale tree the section does not exist and the count is 0).
2. `git ls-files | grep -i jspdf` → empty (decision 1's artefact never dropped).
3. `main` / `mac/main` / `origin` / `origin/main` = `ef3220e` (2026-06-27) — unmoved.
4. `git status --untracked-files=all --short` → empty.
5. Non-`auto/*` refs: `design-system` + `origin/design-system` = `3503537` (2026-08-13, newest in
   the group), `mac` + `mac/design-system` = `e3a355c` (2026-07-20), `mac/hardening-pass` +
   `origin/hardening-pass` = `592e7c3` (2026-07-20). Nothing newer than 2026-08-13.

**Restore preconditions:** `git merge-base --is-ancestor 3503537 375e0f5` → ancestor-ok;
`git diff --diff-filter=D --name-only HEAD 375e0f5` → empty; local and `origin/` both point at
`375e0f5`; `git log -1 --format="%h %an <%ae> %ad %s" 375e0f5` → author
`PHANTOM AUTOPILOT <autopilot@phantom.local>`, subject
`chore: round 2026-09-07_0018 no-op -- five channels checked, no owner answer` — the runner's own
commit, not an owner answer.

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/` or `docs/`** — not one byte. This round's
  non-restore diff is `AUTOPILOT.md` + `SUMMARY.md` only.
- **Did not answer any of the 8 open decisions**, and did not apply decisions 2 / 5 / 6 / 7
  unilaterally. Each moves pixels a user sees; that is the owner's call, not an agent's.
- **Did not restore `docs/design-parity.md`** (decision 8) — still reachable at
  `c3351fc:docs/design-parity.md`, still not an agent's call.
- **Did not re-run the `:short` A/B.** `AUTOPILOT.md:364–365` records that the evidence has been
  sufficient since round `2026-09-04_0048`; `_0018`'s forecast is resolvable from the
  `for-each-ref` output this round already needed.
- **Did not re-run the retrospective restore audit** (closed in `2026-08-31_0023`, explicitly
  marked do-not-repeat).
- **Did not trim `AUTOPILOT.md`** despite it now being 2,864 lines / 383,912 bytes, which is *why*
  `## Next task` reaches the agent empty. Deleting round history is discarding evidence — an owner
  decision.
- **Did not retry the browser MCPs.** Playwright and Chrome-DevTools MCP are *permission*-blocked,
  not merely headless (decision 4).

## Risk

- **Nothing shipped this round, by design.** The single durable risk is the one no round can fix:
  the runner bug is ~3.5 weeks old, `main` is still `ef3220e` (2026-06-27), and 80+ `auto/*`
  branches now stack in parallel with nothing merged. Every round's work survives only because the
  next round path-restores it. **A reviewer should treat that as the actual blocker**, not the
  contents of any individual round.
- **The next round's tip selection is at its second-widest recorded risk** (see Forecast above): a
  sha-before-refname pipeline would discard two rounds at once. Mitigation is one flag —
  `--sort=-committerdate` — and it is written into `## Next task`.
- **`ds-disabled-hover` reports 1 undecidable rule** (`.pui-menu__item:last-child`, a structural
  pseudo the harness does not model). Its PASS says nothing about that rule. This is the expected,
  long-standing result, not a regression — but it is a real blind spot in the parity evidence.
- **The harness does not model inheritance and jsdom does no hit testing**, so no check in this repo
  can see a `:hover`/`pointer-events` regression. Verify would stay green through one. This is why
  decision 7 must be answered rather than guessed at.
- **No browser has ever opened `index.html`** in any round. Every parity claim rests on source
  analysis plus the CSS cascade spec, never on a rendered pixel.
