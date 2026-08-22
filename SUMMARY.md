# Round 2026-08-23_0103 — Toast / Field / Swatch / Toggle parity (the last four)

## What I did

- **Restored the previous round's tip first.** The runner cut this branch from `3503537` again
  (thirteenth round in a row), so `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs` and every
  token/radius/font edit were missing from the tree and the Verify command would have crashed on a
  missing file. `git checkout bb10dd9 -- .` restored them; `git diff --stat bb10dd9 -- .` came back
  empty, and the diff has no deletions, so path-checkout is tree-equivalent to a fast-forward here.
  Kept as its own commit (`de07ea8`) so this round's real diff stays readable.
- **Compared the last four Phantom UI components against the app — the parity table is now 11/11.**
  `#toast`/`.on`/`.err` ↔ `Toast.css`, `.sw`/`.sw .lab` ↔ `Swatch.css`, `.toggle-row` ↔
  `Toggle.css` all match value for value already; each has a single declaration set, so — like
  `.menu-pop` last round — **there was nothing to collapse**. `Field.css` does not match: the app
  draws one text input at four sizes.
- **Collapsed the one thing that was genuinely duplicated: `.pui-toast__action`.** The app built
  that span in a JS template string with an inline `style=` carrying the same three declarations.
  It now reads `class="toast-act"` and the rule lives in `<style>`.
- **Wrote up what only the owner can decide as README decision 6** (text inputs — one size or
  four?), with the four rules, where each is used, how many elements each covers, and what each
  option costs. Fixed a claim in decision 2 that my own survey had just made stale ("the only
  remaining parity gap" — it is now one of three).
- **Found a real bug while doing it and did not fix it:** the "Undo" link in the delete toast
  cannot be clicked. Written up in README and set as the next task.

## Why

**Why the toast action was worth moving and the other three were not.** The measure of a
worthwhile collapse here is whether declarations are duplicated, not whether class names differ.
Toast, swatch and toggle each already have exactly one declaration set that happens to equal the
DS one — renaming `.sw` to `.pui-swatch` would move zero declarations and break every JS template
string that writes `class="sw"`. The toast action was different: three declarations existed in two
places conceptually and, more importantly, in the *wrong* place.

**That inline style was the single unenforced token reference in the repo.** `check-tokens.mjs`
blanks `<script>` before it scans `style=` attributes — deliberately, because the JS builds markup
from template strings containing canvas colours that must stay literal. The consequence nobody had
noticed is that a `style=` attribute *inside* a template string is invisible to all six checks. So
`color:var(--accent)` there was the one token reference in either codebase that no checker could
see. Moving it into `<style>` puts it under all six.

**Why `margin-left:8px` was not adopted.** `.pui-toast__action` has it; this toast separates the
action from the message with a literal `" · "` in the text instead. Taking the margin would have
moved pixels, which is the one thing this round claimed not to do.

**Why decision 6 is a decision and not a refactor.** All four input rules repeat the same four
chrome declarations and differ only in padding and font-size. Collapsing them onto a shared base is
mechanical — but the base has to have *a* padding, and picking one changes the size of every field
in three of the four contexts. That is the same shape as decision 5, and the same answer: the
owner picks the size, then a round does the collapse in one step.

## Verification

Verify command, all three parts, on the final tree:

```
node tools/test.mjs            -> 54 passed, 0 failed
node tools/check-tokens.mjs    -> tokens 22/22 · fonts 4/4 · no derived-colour literals ·
                                  font weights available · no radius literals ·
                                  typeface from one source   (15 CSS sources scanned)
npm --prefix design-system test -> 31 passed (see below)
```

Pixel-parity proof for the one CSS change:

```
node docs/btn-parity-proof.mjs toast HEAD:index.html index.html
  markup coverage OK — 0 old class tokens gone, 1 new class attributes at the expected counts
  compared 5 (element, state) pairs across 1 "toast" elements
  PASS — every element computes an identical declaration set before and after.
```

Three negative tests against deliberately broken copies, all of which failed as they should:

| Injected fault | Result |
|---|---|
| `.toast-act` colour changed to `var(--muted)` | FAIL — 5 declaration(s) differ (one per state) |
| `class="toast-act"` deleted from the JS template | markup coverage FAILED — **cascade diff still reported 0** |
| inline `style=` left in place *and* the class added | markup coverage FAILED — **cascade diff still reported 0** |

The third fault is why I added a phase to the harness: the cascade diff reads each element's inline
style from the table in the script, not from the file, so a half-finished move (class added, style
left behind) diffs to zero. It now fails outright. I also extended the harness with per-version
inline styles (`beforeInline` / `afterInline`), mirroring the existing `beforeAncestors` /
`afterAncestors`, since this refactor changes the inline style rather than the ancestor chain.

Because I edited the harness, I re-ran both refactors it already certifies — `buttons`
(`2488f2d` → `9fab5c9`) and `segmented` (`021b966` → working tree). Both still PASS.

## What I did NOT do

- **Did not fix the toast Undo bug.** `#toast` sets `pointer-events:none`; that property is
  inherited, and `.toast-act` does not set `pointer-events:auto` to become hit-testable again, so
  the `onclick` bound in `toastUndo()` never fires. It is one declaration, but it is a deliberate
  *behaviour* change, and folding it into a commit whose entire claim is "this moved nothing" would
  have made both harder to review. It is the next task, written up with the trap spelled out
  (fix `.toast-act`, do **not** remove `pointer-events:none` from `#toast` — that would let a
  centre-screen toast swallow every click under it for five seconds).
- **Did not collapse the four input rules** onto a shared base. Pixel-neutral only if the base
  keeps each context's own padding, which defeats the point; picking one size is decision 6.
- **Did not add `pointer-events:none` to `.pui-toast`** or the disabled-hover rules to `Menu.css`,
  though both are gaps on the library side. Editing Phantom UI changes it for every consumer.
- **Did not invent an app counterpart for `.pui-field__hint`.** There is none — `.kbd-hint`,
  `.pd-edit-hint` and `.apikey-note` are three different things at three sizes. Recorded as absent
  rather than manufactured.
- **Did not touch `tools/`** or add a seventh token check; all 22 tokens already have one.
- **Did not answer any open decision.** Six now, all still the owner's.

## Risk

- **The toast Undo bug is real and predates this round** — `git log -S 'pointer-events:none'` was
  not run to date it, but nothing in this round's diff introduced it; the declaration is untouched
  on line 353. I reasoned it out from the CSS rather than clicking it, because no round has ever
  had a browser (decision 4). If you can open the app, that click is the single highest-value
  thing to check: my whole claim rests on `pointer-events` being an inherited property and nothing
  re-enabling it (I checked — three `pointer-events` declarations in the file, none on
  `.toast-act`, and no JS anywhere sets `style.pointerEvents`).
- **The parity proof is not a regression test.** It is not in the Verify command and nothing keeps
  it in sync with later CSS edits. It re-runs one past argument; it does not guard the present.
  Its `toast` entry hard-codes the before-inline text, so it only proves the specific move made
  here.
- **`npm --prefix design-system test` reports 31 passed but the DS CSS is not covered by it** —
  those are React component tests, and the four files I read this round (`Toast.css`, `Field.css`,
  `Swatch.css`, `Toggle.css`) are only checked by `check-tokens.mjs`, i.e. for tokens, not for
  layout. "The DS is green" says nothing about whether the app matches it; that is what the table
  in the README is for, and the table is hand-verified.
- **Still no browser has ever seen this app** across fourteen rounds of CSS work. Unchanged from
  last round, and the reason decision 4 exists.
