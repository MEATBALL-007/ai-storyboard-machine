# Round summary — 2026-08-21_0043

Task: **self-host JetBrains Mono in `index.html`** and drop the Google Fonts CDN.

## What I did

- **Restored the previous rounds' work first** (`f48402a`). The runner cut this branch from
  `3503537` — the original contract commit — for the third round running, so
  `tools/check-tokens.mjs`, the radius/channel tokens and the chip-parity work named in the
  contract handed to me *did not exist in my working tree*. My own Verify command would have
  crashed on a missing file. Restored the tree of `38ad09b` (previous round's tip) verbatim as
  a separate commit so this round's real diff stays readable.
- **Embedded all four JetBrains Mono weights as `data:` URIs** (`6abf6fa`). The 400/500/700/800
  latin `.woff2` files from `design-system/src/fonts/` (86,144 bytes) now live inside
  `index.html`'s `<style>` as `@font-face` rules mirroring `design-system/src/fonts.css`.
  Removed the two `preconnect` hints and the `fonts.googleapis` stylesheet link.
- **Extended `tools/check-tokens.mjs` to verify the fonts too** (`3162c51`). It walks every
  `@font-face` in `fonts.css`, decodes the matching base64 payload from `index.html`, and
  compares it byte-for-byte with the file on disk.
- **Documented the typeface in README** (`73b8dc3`) — where the source of truth is, the
  three-step re-embed procedure, the size cost, and the glyph-coverage analysis. Also marked
  jsPDF as the sole remaining network dependency.
- **Updated `AUTOPILOT.md`**: criterion 4's note (external refs went 4 → 1, never up),
  criterion 3's progress and its real blocker, and a new consolidated
  **"🔴 รอเจ้าของตัดสินใจ"** block listing the four decisions that now gate almost everything.

## Why

- **All four weights, not the 400+700 shortcut the contract offered.** `index.html` uses
  `font-weight:` 500, 700 and 800 explicitly plus the 400 default — dropping 500/800 would have
  forced synthetic weights on live UI. 60 KB is not worth that. (There is also one
  `font-weight:300` with no matching face, but the CDN request was `wght@400;500;700;800`, so
  that already resolved to 400. Unchanged.)
- **Glyph coverage does not regress.** I took a codepoint census of `index.html`: it uses
  U+2550 box-drawing **1,576 times**, plus arrows, Thai, and emoji. None of those ranges are in
  *any* subset Google's `css2` endpoint serves for JetBrains Mono (latin, latin-ext, cyrillic,
  cyrillic-ext, greek, vietnamese), so they already fell back to the system monospace font.
  The only non-ASCII characters in a range the CDN did serve are `°  ·  —  ’  “  ”  …`, all of
  which sit in the latin subset I embedded. Nothing that rendered in JetBrains Mono before
  stops rendering in it now.
- **The font check belongs in `check-tokens.mjs`, not a new script.** Embedding creates a
  second copy of the typeface, and this change would otherwise have added a fresh drift vector
  in the same round that closed one. Same file, same failure mode, same command.

## Verification

Ran the contract's Verify command in full:

```
node tools/test.mjs           → 54 passed, 0 failed
node tools/check-tokens.mjs   → tokens in sync: 22/22 from design-system/src/tokens.css …
                                fonts in sync: 4/4 from design-system/src/fonts.css …
npm --prefix design-system test → Test Files 12 passed (12) / Tests 31 passed (31)
```

Task-specific checks:

- `fonts.googleapis` occurrences: **0**. `fonts.gstatic`: **0**. `@import`: **0**.
- Remaining external refs in the file: exactly one —
  `<script src="https://cdnjs.cloudflare.com/…/jspdf.umd.min.js">`, pre-existing.
- **Base64 round-trip, all four weights**: decoded each embedded payload and compared with
  `Buffer.equals` against the source file — `OK 21168B / 21832B / 21908B / 21236B`, each
  starting with the `wOF2` magic. The four distinct byte lengths also prove the weights were
  embedded in the right order.
- **Negative-tested the new check, both failure modes** (then `git checkout --` to restore):
  - flipped one byte of the 500 `.woff2` → `FAIL font drift: weight 500 …`, exit 1
  - added a phantom weight-600 face to `fonts.css` → `FAIL missing in index.html: no
    @font-face weight 600 …`, exit 1
- `index.html`: 188 KB → 297 KB (the contract predicted ~303 KB).

## What I did NOT do

- **Did not touch the jsPDF CDN line** — the contract said to leave it, and I could not have
  done it anyway: there is no copy of jsPDF anywhere on this machine (searched
  `C:/PHANTOM-AUTOPILOT` and the npm global root) and network access is blocked. **The owner
  has to vendor `jspdf.umd.min.js` into the repo before any round can inline it.** I recorded
  this in AUTOPILOT.md so no future round burns itself discovering it again.
- **Did not tick criterion 3** (`file://` fully working). The font half is done, but jsPDF
  still needs the network, and nobody has opened the app in a real browser yet.
- **Did not add `unicode-range`.** The contract said to match "the original", but
  `design-system/src/fonts.css` — the source of truth — declares none, and with exactly one
  file per weight `unicode-range` would only ever narrow coverage. Matching the DS file is the
  behaviour-preserving choice.
- **Did not touch spacing/font-size tokens, chip padding, or the DS `rgba` literals.** The
  first two are blocked on owner decisions (recorded); the third is now the Next task.

## Risk

- **Not verified in a browser.** Six rounds of CSS changes, zero rendered pixels seen. This
  round changes *how the typeface loads*, which is the one kind of change most likely to show
  up visually. The byte-level round-trip proves the font data is intact and the CSS is
  syntactically a copy of `fonts.css`, but that is not the same as seeing it render.
  Playwright and Chrome-DevTools MCP are permission-blocked, not merely headless.
- **A reviewer should sanity-check one thing by eye**: open `index.html` offline and confirm
  the UI is in JetBrains Mono, not a fallback. A malformed data URI would fail *silently* —
  the page renders fine, just in the wrong font.
- **The 109 KB size increase is real and irreversible-ish.** If the owner considers 297 KB too
  large for the "one file you can open" pitch, the fix is to drop weights, and I've documented
  which ones are actually used so that call can be made with the facts.
- **The stale-base problem is now costing a commit every round.** Three rounds in a row have
  opened with a restore commit. If two of these branches are ever merged in the wrong order,
  the restore commits will conflict against each other. This is a runner bug, not a repo bug —
  it needs fixing at the source (cut from the previous round's tip, or merge PRs into `main`).
  There are 29 stacked `auto/*` branches now.
