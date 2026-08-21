# Round 2026-08-22_0024 — `check-tokens.mjs` check #5: corner-radius literals

## What I did

- **Restored the previous round's work first.** `git merge-base HEAD auto/…/2026-08-22_0015`
  returned `3503537` — the original contract commit — proving this branch was cut from the
  stale base *again* (5th time) and contained zero of the last 21 rounds' work. The
  `AUTOPILOT.md` on disk was the round-0 version, which is why the `## Next task` section
  arrived empty in the prompt. Recovered with `git checkout <prev-tip> -- .` in commit
  `7c0e3c8`, before touching anything else.
- **Added the 5th check to `tools/check-tokens.mjs`: `border-radius` must read a token.**
  It parses the *value side* of `border-*-radius` declarations — shorthand, all four corner
  longhands, and vendor-prefixed spellings — over the existing `scanTargets`
  (`design-system/src/**/*.css` + the `<style>` block of `index.html`), and fails on any
  length that isn't a `var()`. Matching values are reported with the token to use
  (`3px` → `var(--r-md)`); non-matching values print the whole 7-value scale, because adding
  an eighth radius is a design decision the owner has to make.
- **Documented it in `README.md`** under "Corner radius", including what the check
  deliberately does *not* read and the `style="…"` gap below.
- **Updated `AUTOPILOT.md`**: recorded check #5 under acceptance criterion 7 with all six
  test cases, and set the next task to closing the inline-`style` gap.

## Why

- **Only the value side of a `border-*-radius` declaration is read**, never a bare `3px`.
  AUTOPILOT is explicit that spacing is *not* tokenised on purpose — measured across both
  files, `padding` is a continuum from 1–12px and `font-size` steps by 0.5px, so a file-wide
  `\d+px` sweep would produce hundreds of false positives on values that were never meant to
  be tokens.
- **`0` and `0px` are skipped.** `border-radius:4px 4px 0 0` — rounded top, flat bottom — is
  an everyday idiom; a square corner isn't a design value. Flagging it would push someone to
  invent a `--r-none:0` token, i.e. widen the design language to satisfy a checker.
- **Reused `scanTargets` instead of writing a new scan.** That array is `<style>`-only by
  construction, so the canvas `roundRect()`/`arc()` radii in the `<script>` are structurally
  unreachable rather than merely unmatched by a regex — the Out-of-scope rule is enforced by
  the data flow, not by my regex being careful.
- **`(?<![-\w])` in the property regex** keeps a custom property named `--border-radius` out
  of scope: *declaring* a value is a different act from re-hardcoding one. Vendor prefixes
  are then listed explicitly so that lookbehind doesn't quietly become a bypass.

## Verification

Ran the Verify command from `AUTOPILOT.md` verbatim:

```
$ node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 14 stylesheet(s) scanned, none re-hardcode a tokenised colour
font weights available: 14 stylesheet(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 14 stylesheet(s) scanned, every border-radius reads a --r-* token
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

A checker that only ever prints "ok" proves nothing, so I broke it on purpose six times.
Each edit was reverted with `git checkout --` afterwards; `git status` was clean apart from
`tools/check-tokens.mjs` before committing.

| # | Injected | Result |
|---|---|---|
| 1 | `border-radius:3px` at `index.html:49` | exit 1 — `index.html:49: "border-radius: 3px" hardcodes … --r-md — write var(--r-md)` |
| 2 | `border-radius:9px` | exit 1 — `uses 9px, which matches no radius token — … offers 1px (--r-xs), 2px (--r-sm), 3px (--r-md), 4px (--r-lg), 5px (--r-xl), 6px (--r-2xl), 50% (--r-full)` |
| 3 | `border-radius:4px 4px 0 0` | exit 1 — **two** findings, both on `4px`; the two `0`s silent |
| 4 | `border-radius:var(--r-lg) var(--r-lg) 0 0` + `--border-radius:3px` + `border-top-left-radius:inherit`, same line | **pass** — mixed `var()` shorthand, custom property, and keyword all correctly ignored |
| 5 | `border-top-left-radius:2px` and `-webkit-border-radius:50%` in `Badge.css` | exit 1 — both caught at `Badge.css:5`, naming `--r-sm` and `--r-full` |
| 6 | `/* historically border-radius:3px here */` in `Badge.css` | **pass** — comments are blanked before scanning |

Line numbers in cases 1–4 are the real `index.html` line, not one relative to the `<style>`
block, because the check inherits the existing `lineOffset` machinery.

## What I did NOT do

- **Did not extend the scan to `style="…"` attributes.** `index.html` has 24 of them and one
  (line 616, the export button) carries a `border-radius`. It reads `var(--r-md)` today, but
  by hand, not by enforcement — and *all four* checks share this blind spot, not just the new
  one. Fixing it is a separate, well-scoped change (one new entry in `scanTargets`), so I made
  it the next task rather than doing two things this round.
- **Did not touch any CSS or markup.** The only production file changed is
  `tools/check-tokens.mjs`; `README.md` and `AUTOPILOT.md` are documentation. Nothing moves a
  pixel.
- **Did not add a `--r-none:0` token or any other token.** Widening the palette stays an owner
  decision — the four items under "🔴 รอเจ้าของตัดสินใจ" in `AUTOPILOT.md` are all still open
  and still block most of the remaining work.
- **Did not verify anything in a real browser.** Playwright and Chrome-DevTools MCP are both
  permission-blocked on this host (established in an earlier round; I did not retry). This
  round changes no rendered CSS, so the risk from that is nil *this time*.

## Risk

- **Low, and structurally bounded: this round ships a linter, not a style change.** If the new
  check is wrong, the failure mode is a build that fails or a violation that slips through —
  never a visual regression. `git show --stat` on the work commit is one file.
- **The check is line-oriented.** A `border-radius` declaration split across two source lines
  (`border-radius:\n  3px`) would not be seen. Neither stylesheet does this today, and the
  colour and `font-weight` checks have the same property, so this is consistent rather than a
  new weakness — but it is a real hole a reviewer should know about.
- **`calc()` values are skipped entirely** rather than half-parsed. Zero uses today; a
  `calc(3px + 1px)` added later would pass unexamined.
- **The `--r-*` prefix is load-bearing.** The radius map is built from token names starting
  `--r-`, so renaming the scale in `tokens.css` would silently empty it. I guarded the obvious
  case — the script now hard-fails if *no* `--r-*` token exists — but a partial rename
  (e.g. `--radius-md`) would shrink the map without failing. Worth a look.
- **Duplicate messages on shorthand.** `4px 4px 0 0` reports the same finding twice (case 3).
  Accurate, since there really are two literals, but noisier than it needs to be.
- **Still unresolved from prior rounds, unchanged by this one:** the jsPDF CDN `<script>` at
  `index.html:7` has no `integrity` attribute and cannot be inlined without the owner
  vendoring the file, so acceptance criterion 3 stays unticked.
