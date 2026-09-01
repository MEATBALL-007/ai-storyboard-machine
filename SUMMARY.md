# Round 2026-09-02_0022 — no-op (no owner answer on any of the 8 open decisions)

## What I did

- **Restored the previous round's tree.** The branch was cut from `3503537` again (as every
  `auto/*` branch is). Ranked tips by `%(committerdate:iso8601)` → `b791ace`
  (`…/2026-09-02_0015`, 2026-09-02 00:20:38), same sha in `refs/heads` and `origin/`.
  Restored with `git checkout b791ace -- .` as its own commit (`0ec2f73`, 13 `M` + 3 `A`, no `D`).
- **Checked all five owner-answer channels — none has been answered.** Details under Verification.
- **Ran all five `docs/btn-parity-proof.mjs` keys** as an independent check that the restore was
  complete (an empty `git diff` only proves bytes; the harness recomputes each element's
  cascade-winning declaration set from the files actually standing). All five match the expected
  table exactly.
- **Ran the full Verify command** — all three stages green.
- **Recorded this round's status in `AUTOPILOT.md`**, including a live reproduction of the
  retired `:short` ranking formula. `Next task` itself is unchanged: still "check the five
  channels, write SUMMARY, end the round" until an owner answers.

No byte of `index.html`, `design-system/`, `tools/` or `docs/` was touched this round.

## Why

- **Restore first, read second.** Reading `index.html` off the stale `3503537` base does not look
  broken, it looks *finished* — that mistake cost a whole round once before, and permanently lost
  `docs/design-parity.md` in round `2026-08-19_0022`. So the first commands of the round were
  `git log --oneline -5` and the tip ranking, before any Read of a source file.
- **Ranked by `:iso8601`, not `:short`.** Second granularity makes the sort a total order; day
  granularity ties same-day rounds and falls through to comparing the **sha string**, which carries
  no time information.
- **No substitute task invented.** `AUTOPILOT.md`'s Next task block is explicit that all
  code-touching fallback work is exhausted (token tooling 22/22 across six checks, parity table
  closed at 11/11) and that the last read-only fallback — the retrospective restore audit — was
  completed in round `2026-08-31_0023` and must not be re-run. The remaining work is eight owner
  decisions, each of which moves pixels or adds a file, so none is an agent's call.

## Verification

**Verify command — all three stages green:**

```
node tools/test.mjs            → 54 passed, 0 failed
node tools/check-tokens.mjs    → tokens 22/22 · fonts 4/4 · no derived-colour literals (15 CSS sources)
                                 · font weights available · no radius literals · typeface from one source
npm --prefix design-system test → Test Files 12 passed (12) · Tests 31 passed (31)
```

**Restore preconditions (all checked before touching the tree):**

```
git merge-base --is-ancestor 3503537 b791ace          → ancestor-ok
git diff --diff-filter=D --name-only HEAD b791ace     → empty (path-checkout ≡ fast-forward)
git log -1 --format="%h %an <%ae> %ad %s" b791ace     → PHANTOM AUTOPILOT <autopilot@phantom.local>
                                                        "chore: round 2026-09-02_0015 no-op -- five
                                                         channels checked, no owner answer"
git diff --stat b791ace -- .   (after restore)        → empty (tree identical, every byte)
```

The author check matters: it distinguishes "the previous round wrote this tip" from "the owner
committed an answer and that is now the tip". It is the runner, so no answer arrived that way.

**Five owner-answer channels — all negative:**

| # | Channel | Result |
|---|---|---|
| 1 | `grep -c "\| Option \| Cost \|" README.md` (run **after** restore) | `8` — all 8 decisions still hold an unanswered option table |
| 2 | `git ls-files \| grep -i jspdf` | empty — decision 1's file drop has not happened |
| 3 | `main` | `ef3220e` (2026-06-27), unmoved |
| 4 | `git status --untracked-files=all --short` | only the restore's own staged 13 `M` + 3 `A`; no untracked owner drop |
| 5 | non-`auto/*` refs | newest is `design-system`/`origin/design-system` = `3503537` (2026-08-13); `mac`/`mac/design-system` = `e3a355c`, `origin/hardening-pass`+`mac/hardening-pass` = `592e7c3` (both 2026-07-20); `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27). Nothing newer than 2026-08-13. |

**`docs/btn-parity-proof.mjs` — all five keys match the expected table:**

| key | before:after | result |
|---|---|---|
| `buttons` | `2488f2d:index.html` → `index.html` | PASS · 85 pairs / 17 elements · markup 7 old tokens gone, 5 new attributes |
| `segmented` | `021b966:index.html` → `index.html` | PASS · 45 / 9 · markup 0 gone, 3 new |
| `toast` | `de07ea8:index.html` → `10e8f39:index.html` | PASS · 5 / 1 · markup 0 gone, 1 new |
| `toast-hit` | `3d3d5cc:index.html` → `index.html` | **FAIL — 5 declaration(s) differ**, 0 markup problems, 0 unmatched · 10 pairs / 2 elements · `grep -c "✗ #toast:"` = **0** |
| `ds-disabled-hover` | `b791ace:…/styles.css` → `design-system/src/styles.css` | PASS · 15 / 3 · markup N/A (source is a stylesheet) · **1 undecidable rule** (`:last-child` on `.pui-menu__item`) |

`toast-hit`'s FAIL is the **expected, correct** result — it records the deliberate 2026-08-24
`pointer-events:auto` fix (`after : auto <- .toast-act`), and the `✗ #toast:` count of 0 is the
proof that `#toast`'s own `pointer-events:none` was not removed. Do not "fix" it to PASS.

**Live reproduction of the retired `:short` formula** (own branch filtered out):

```
:short (retired)                 :iso8601 (correct)
2026-09-02 b791ace _0015  ← lucky 2026-09-02 00:20:38 b791ace _0015  ← correct
2026-09-02 98e4380 _0002         2026-09-02 00:12:43 98e4380 _0002
2026-09-01 ec1d48b _0001  ← wrong 2026-09-01 00:47:10 460f6e2 _0042
2026-09-01 460f6e2 _0042         2026-09-01 00:37:41 42f34bd _0032
```

This is the first round where **two tips share `2026-09-02`**, so the tie the previous round
predicted has returned at position 1. It resolved *correctly* only by accident — `b` (0x62) >
`9` (0x39) happens to agree with the clock. Below it the formula is still inverted: `ec1d48b`
(`_0001`, 00:07:20, oldest of the six `2026-09-01` tips) outranks `460f6e2` (`_0042`, 00:47:10,
newest).

## What I did NOT do

- **Did not answer, or act on, any of the 8 open decisions.** Each moves pixels (2/3/5/6/7),
  adds a file (1/8), or needs a permission change (4). All are the owner's call.
- **Did not restore `docs/design-parity.md`** (still reachable at `c3351fc:docs/design-parity.md`).
  That is decision 8 and is explicitly not an agent's call.
- **Did not re-run the retrospective restore audit** — completed in round `2026-08-31_0023`,
  flagged there as not-to-be-repeated.
- **Did not retry Playwright / Chrome-DevTools MCP.** They are *permission*-blocked, not merely
  headless; retrying burns a round and changes nothing. Still no browser verification has ever
  been done on this project.
- **Did not invent a substitute task**, including the three the Next task block explicitly forbids
  (implementing `:last-child`/combinator matching in the harness, adding the harness to Verify,
  applying decisions 2/5/6/7 unilaterally).

## Risk

- **Nothing in this round changes program behaviour.** The only content changes are `SUMMARY.md`
  and one status block in `AUTOPILOT.md`. The restore commit is separate and its diff against
  `b791ace` is empty.
- **The project is stalled, and no round can clear it.** Eight decisions have gone unanswered
  across a calendar-month boundary. A reviewer wanting progress should answer one in
  `README.md → ## Open decisions`; decision 1 additionally needs `jspdf.umd.min.js` dropped into
  the repo, since this machine has no copy and the network is blocked.
- **The runner still cuts every round branch from `3503537`.** That is the underlying bug. It has
  now cost one permanently-lost file and several near-misses, and it makes every round pay a
  restore. Fixing the runner to branch from the previous tip would remove the whole class of risk.
- **`ds-disabled-hover` reports 1 undecidable rule** (`:last-child` on `.pui-menu__item`). Its PASS
  says nothing about that rule; it must still be read by hand if anyone edits `Menu`'s styles.
- **The harness is not part of Verify**, so nothing forces it to stay in step with the code. Its
  numbers are evidence about the round that ran it, not a standing guarantee.
