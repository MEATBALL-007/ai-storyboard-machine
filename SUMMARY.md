# SUMMARY — round 2026-08-19_0022

**Outcome: the assigned task was already done. No code changed. Plan corrected instead.**

## What I did

- Verified the assigned task against the actual file before touching it. Parsed the `:root` block out of
  `index.html`'s `<style>` and the `:root` block out of `design-system/src/tokens.css`, and diffed them
  key-by-key: **all 12 custom properties present in both, identical values, identical order, zero diffs.**
  The token set is already in the app.
- Checked the second half of the task ("map hard-coded values onto the token with the exact same value").
  Extracted every hex and `rgb()/rgba()` literal from the CSS body *outside* `:root` and compared each
  against the 10 token colour values. **No remaining literal equals any token** — so there is nothing left
  to map. The CSS already resolves **271** `var(--…)` references.
- Recorded the non-matching values as an owner decision, as the task instructed — but wrote them into
  `AUTOPILOT.md` under a new **"Open design decisions"** section (A–E) rather than only here, because
  `SUMMARY.md` is overwritten every round and the list would have been lost next round.
- Rewrote `## Next task` in `AUTOPILOT.md` to the first criterion that is genuinely unmet:
  **criterion 7, single source of truth for tokens** — spec'd as `tools/sync-tokens.mjs` with
  `--check`/`--write` plus a README section.
- Ticked criteria 1, 5 and 6, each with an inline note recording what exactly was verified and what
  the tick does *not* cover.

## Why

- Hard rule 5 says an already-done task means: record the finding, correct the plan, stop — do not
  invent a substitute. Re-adding tokens that are already there byte-for-byte would have been a no-op
  commit dressed up as progress.
- The values now look like they were extracted *from* `index.html` *into* `tokens.css`, not pushed the
  other way. That reframes the remaining risk: the two files are two hand-maintained copies that happen
  to agree today, with nothing enforcing it. That is exactly criterion 7, and it is why I made it the
  next task rather than jumping to the visual work in criterion 2.
- I proposed `tools/sync-tokens.mjs` as a *dev tool alongside `tools/test.mjs`*, not a build step:
  `index.html` still opens straight from `file://` with no build and no npm, so the README's headline
  promise — and the "Out of scope" ban on adding a build step — both hold.
- Criterion 1 is ticked but annotated, because ticking it silently would mislead: `tokens.css` defines
  **no spacing, radius or font-size tokens at all**, so the "ระยะ" (spacing) half of that criterion
  passes only vacuously. A reviewer should know that.

## Verification

Ran the Verify command exactly as written, unmodified:

```
node tools/test.mjs && npm --prefix design-system test
```

- `node tools/test.mjs` → `54 passed, 0 failed`
- `npm --prefix design-system test` → `Test Files 12 passed (12)` / `Tests 31 passed (31)`

Both green. Since no source file changed this round, these confirm the tree was already green rather
than proving anything about new work.

Supporting evidence for the "already done" claim (analysis scripts, run inline via `node -e`, nothing
written to disk):

- token diff: `--- DIFFS: NONE (identical)`; keys both sides
  `bg,surface,surface2,panel,card,accent,secondary,text,muted,dim,line,mono`
- hex literals remaining in the CSS body, with token-match check — none matched:
  `#000000`×18, `#0a0a0a`×4, `#7ac87a`×4, `#161616`×2, `#222222`, `#333333`, `#ffffff`, `#ffb4a0`,
  `#151515`, `#bbbbbb`
- `var(--` occurrences in the CSS body: `271`

## Values that do NOT match a token (the list the task asked for)

Full detail, with the choice each one forces, is in `AUTOPILOT.md` → "Open design decisions". Short form:

| Group | Values | Why it can't be mapped |
|---|---|---|
| A. Uncovered neutrals | `#000` ×18, `#0a0a0a` ×4, `#161616`/`#151515`, `#222`/`#333`, `#fff`, `#bbb` | `#0a0a0a` is *darker* than `--panel` `#0C0C0C`; `#161616`/`#151515` are *lighter* than `--line` `#1c1c1c`. Near-misses, not matches. |
| B. Success green | `#7ac87a` ×4, `rgba(122,200,122,…)`, `rgba(120,200,120,.15)`, `rgba(80,180,90,.85)` | No `--success` token exists — and the app is using **three subtly different greens** for one concept. |
| C. Error text tint | `#ffb4a0` | A light tint of `--secondary`; no token. |
| D. Alpha variants (~30 sites) | accent at `.05 .07 .16 .32 .35 .4 .45 .5 .6 .85 .9` and `0`; secondary at `.1 .18`; bg at `.86 .92`; black/white at various | Hue matches a token exactly, but the tokens are opaque hex, so `rgba()` cannot be derived from them. Needs channel tokens (`--accent-rgb`) or `color-mix()` — a change to `tokens.css`, i.e. the owner's call. |

I deliberately changed none of these. Per the task: choosing whether to move the app's colours or move
the tokens is a design decision for the owner.

## What I did NOT do

- **Did not re-add or reformat the token block in `index.html`.** It is already identical to `tokens.css`.
- **Did not write `tools/sync-tokens.mjs` this round.** It is the corrected next task, not this one —
  hard rule 1 is one task per round. It is fully spec'd in `AUTOPILOT.md` so the next round can start cold.
- **Did not touch any colour value**, add any token, or add `color-mix()`/channel tokens — all four are
  owner decisions (groups A–D above).
- **Did not tick criterion 2, 3 or 4.** Criterion 2 (element-level visual match) is untouched design work.
  Criterion 3 (`file://` works fully) I could not verify on this headless box — no browser run. Criterion 4
  is actively *not* met today (see Risk).
- **Did not touch** `storyboard-simulator.html`, the `==PURE-LOGIC==` / `==TESTS==` markers, or any test.

## Risk

- **The main claim of this round is a negative one** — "there was nothing to do". A reviewer should spot-check
  it, and it is cheap to: open `index.html` line 12–19 next to `design-system/src/tokens.css` line 1–8; they
  should read the same. If they ever diverge, my premise is wrong and the original task becomes live again.
- **My "no literal matches a token" check covered the `<style>` block only.** I then measured the
  `<script>` block (lines 871–4008): it holds **47 hex literals (35 distinct)** and **70 `rgba()` literals
  (52 distinct)**, and it never calls `getComputedStyle`, so none of them can currently be reading a token.
  Canvas colours can't use CSS custom properties without reading them back at runtime, so this is a
  separate and considerably larger problem that I did not survey and did not count.
  **Criterion 1 as ticked covers the CSS block only** — the app's canvas rendering is still fully
  hard-coded and is not governed by the design system in any way.
- **Criterion 4 is not met today and this is pre-existing, not something I introduced.** `index.html`
  lines 7–10 load JetBrains Mono from `fonts.googleapis.com` and jsPDF from `cdnjs.cloudflare.com`.
  Opened offline from `file://`, the app falls back to a system monospace font and **PDF export will fail**
  (`jspdf` will be undefined). That also puts criterion 3 in doubt. The fix material exists —
  `design-system/src/fonts/` holds all four JetBrains Mono woff2 weights (~86 KB) — but embedding them
  base64 grows the single file by roughly 115 KB from its advertised 187 KB, which is the owner's call
  (decision E). I flagged it rather than acting on it.
- **Ticking criteria 5 and 6 is a point-in-time statement**, true as of this round's run. They are standing
  conditions, not milestones; a later round can un-tick them.
- Three near-identical greens (group B) suggest the app's colour usage drifted over time. Whoever picks a
  single `--success` value will be making a small visible change at four or more sites, not a pure refactor.
