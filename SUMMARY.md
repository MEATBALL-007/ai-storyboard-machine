# Round 2026-09-12_0021 — no-op (no owner answer)

## What I did

- **Restored the previous round's tip `e24daee` (`…/2026-09-12_0011`) onto the stale base.**
  `git log --oneline -1` showed `3503537` — the contract commit — again, so the runner still cuts
  every `auto/*` branch from the contract rather than from the last tip. Restored as its own
  forward commit (`767baef`); `git diff --stat auto/…/2026-09-12_0011` run afterwards is **empty**,
  so the tree matches the tip byte for byte.
- **Checked all five owner-answer channels — every one is silent.** Details under Verification.
- **Ran the full three-stage Verify plus all five harness keys.** Every number matches the
  documented expectation exactly, including `toast-hit`'s intended FAIL.
- **Resolved round `_0011`'s tip-selection forecast with a live A/B and wrote this round's.**
  `_0011` came up **heads — but by luck, not by structure**, and this round's output shows the bug
  is fully intact in two other day-groups. Next round's risk is **~88.4%**, the highest yet (see Risk).
- Did **not** append a `> **สถานะล่าสุด …` block, following the convention started at round `_0035`.
  Only the `## Next task` block was edited (plus the convention roster, which two prior rounds had
  silently stopped updating).

## Why

- **The no-op really is the contract's instruction, not a fallback I picked.** `## Next task` says:
  if no open decision has been answered, restore the previous tip, check the five channels, run
  Verify plus all five harness keys, write SUMMARY, end the round — and explicitly forbids inventing
  other work (`ห้ามประดิษฐ์งานอื่นเด็ดขาด`). All eight decisions in `README.md` are still unanswered.
- **`## Next task` arrived empty in the prompt again** (`AUTOPILOT.md` is now 3,072 lines / 417,258
  bytes — measured after this round's edit). I read the real task out of the **restored** file by
  grepping for `## Next task` and reading at that offset. Taking the task from the prompt text would
  have meant executing round 1's instruction ("add tokens to `index.html`") against a tree where
  that work has been done for three weeks.
- **`git checkout <tip> -- .` + commit, not `merge --ff-only` or `reset --hard`** — both of those are
  denied in this environment, as the contract records. I checked
  `git diff --diff-filter=D --name-only HEAD e24daee` was **empty** before trusting the path
  checkout: path-checkout never deletes, so a file removed in the tip would otherwise have survived
  as a resurrected file and the tree would silently disagree with the tip.
- **The `ds-disabled-hover` before-side reads `e24daee`, the tip I restored this round** — not a sha
  copied out of an older block, which the contract explicitly warns against.

## Verification

**Verify command — green on all three stages:**

| Stage | Result |
|---|---|
| `node tools/test.mjs` | `54 passed, 0 failed` |
| `node tools/check-tokens.mjs` | 6/6 checks, `22/22` tokens, `4/4` fonts, **15 CSS sources** |
| `npm --prefix design-system test` | `12 passed (12)` files, `31 passed (31)` tests |

**All five harness keys match the documented table exactly:**

| Key | Pairs / elements | Markup coverage | Verdict |
|---|---|---|---|
| `buttons` | 85 / 17 | 7 old gone, 5 new | PASS |
| `segmented` | 45 / 9 | 0 old gone, 3 new | PASS |
| `toast` | 5 / 1 | 0 old gone, 1 new | PASS, **no** undecidable |
| `ds-disabled-hover` | 15 / 3 | `N/A — the source is a stylesheet` | PASS + **1 undecidable** |
| `toast-hit` | 10 / 2 | 0 problems, 0 unmatched | **FAIL — 5** (intended) |

- `ds-disabled-hover`'s single undecidable rule is `.pui-menu__item:last-child`
  (`unreadable because: structural pseudo :last-child`, subject matches `.pui-menu__item` and
  `.pui-menu__item--danger`) — the expected one.
- `toast-hit`'s five `✗` rows are **all `#toastUndo`** (`(base)`, `:hover`, `:disabled`,
  `:disabled:hover`, `:focus`). **No `#toast` row appears** — that absence is the evidence that
  `pointer-events:none` was never stripped from the toast container.

**Five owner-answer channels — all silent:**

1. Restored tip `e24daee` is authored by `PHANTOM AUTOPILOT <autopilot@phantom.local>`, subject
   `chore: round 2026-09-12_0011 no-op — five channels checked, no owner answer` — a runner commit,
   not the owner's.
2. `grep -c "| Option | Cost |" README.md` = **8** and `grep -c "If you answer:" README.md` = **8**.
   The counters **agree**, so no decision block has been resolved.
3. `git ls-files | grep -i jspdf` — **empty**. Owner has not vendored jsPDF (blocks decision 1).
4. `git status --untracked-files=all --short` — **empty**. Nothing dropped into the tree.
5. Non-`auto/*` tips have not moved at all: `design-system`/`origin/design-system` = `3503537`
   (2026-08-13), `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
   `main`/`mac/main`/`origin`/`origin/main` = **`ef3220e` (2026-06-27)**.

**Tip-selection A/B — run live this round, own branch excluded to simulate pre-restore conditions:**

- Wrong formula (`%(committerdate:short)`, sha before refname, `| sort -r`) → row 1 = `e24daee` = **correct**
- Right formula (`--sort=-committerdate` + date-major refname cross-check) → row 1 = `e24daee` = **correct**
- Both agree ⇒ damage this round = **0**. But see Risk — this was luck, and the same output shows
  the bug still mis-ordering two other day-groups.

## What I did NOT do

- **Did not touch `index.html`, `design-system/`, `tools/`, or `docs/`** — not one byte. Beyond the
  restore commit, only `AUTOPILOT.md` and `SUMMARY.md` changed.
- **Did not answer any of the eight open decisions.** Each moves pixels, adds a file to the repo, or
  rewrites history. All eight are already investigated to the end; what is missing is a decision.
- **Did not shrink or prune `AUTOPILOT.md`** even though its size is the direct cause of the empty
  `## Next task`. Trimming it is the owner's call — it is itself one of the open decisions.
- **Did not "fix" `toast-hit`'s FAIL.** That FAIL is the correct output of the round that made
  `#toastUndo` clickable; turning it green would mean reverting a real bug fix.
- **Did not verify anything in a real browser.** Playwright and Chrome-DevTools MCP are both
  permission-blocked here (not merely headless), and decision 4 has not been granted.

## Risk

- 🔴 **The runner's stale-base bug is now ~4 weeks old and still unfixed.** Every round spends 3–4
  tool calls rediscovering and undoing it. `main` has not moved since **`ef3220e` (2026-06-27)** —
  nothing this project has produced in weeks has reached the main line. **This is the single thing
  most worth a reviewer's attention**, and no agent round can fix it.
- 🔴 **Next round's tip-selection risk is ~88.4% — the highest ever calculated here.** Once this
  round commits, `2026-09-12` holds **three** tips (`8828c58`, `e24daee`, this round's closing sha),
  all tied at day granularity, so the wrong formula's comparand becomes `e24daee`. Heads requires
  this round's short sha to sort above `e24daee`: P(tails) = `0xe24daee / 0x10000000` ≈ **88.4%**.
  Damage if the wrong formula is used: this round's `AUTOPILOT.md` + `SUMMARY.md` are discarded
  (**no code lost** — this round changed none).
  **The fix is unchanged: `--sort=-committerdate` plus a date-major refname cross-check.**
- ⚠️ **This round's heads was luck, and its own output proves the bug survives.** Unlike last round
  there *was* a tie at the top group; `e24daee` won it on a single hex digit (`e` > `8`). In the same
  listing the wrong formula still lifts `b1977bc` (`_0016`) above the newer `1c3e39b` (`_0026`), and
  in the `2026-09-10` group it puts `b2a5815` (`_0013`) at the head while that day's real tip
  `0d08961` (`_0035`) falls to the bottom of four. Cumulative record of the wrong formula:
  **tails 11 of 19**, with heads-by-luck now 3 (`_0016`, `_0036`, `_0011`).
- ⚠️ **A green Verify does not mean the UI is correct.** No checker inspects `:hover`, and jsdom does
  no hit testing — the two cascade bugs written up as decision 7 (`#tourBack` staying bright while
  disabled; `.menu-pop button.danger:hover` swallowing the app's own disabled guard) would **not**
  turn any stage red. That is exactly why they are waiting on an answer rather than being "tried".
- ⚠️ `toast-hit` is the one harness key expected to FAIL. A reviewer skimming for green will misread
  it. Its correctness lives in *which* rows differ — all `#toastUndo`, never `#toast`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
