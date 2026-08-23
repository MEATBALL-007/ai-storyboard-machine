# Round 2026-08-24_0003 — the toast "Undo" link was never clickable

## What I did

- **Restored the previous round's tip first.** The runner cut this branch from `3503537` again
  (fourteenth round in a row), so `tools/check-tokens.mjs`, `docs/btn-parity-proof.mjs` and every
  token/radius/font/refactor edit since 2026-08-21 were absent and the Verify command would have
  died on a missing file. `git checkout 3d3d5cc -- .` restored them; `git diff 3d3d5cc --stat`
  then came back empty and `git status` showed no untracked leftovers, so the tree is exactly the
  previous tip. Kept as its own commit (`1182f54`) so this round's real diff stays readable.
- **Confirmed the root cause from source before touching anything.** `#toast` (`index.html:353`)
  sets `pointer-events:none`. `pointer-events` is an **inherited** property, so the
  `<span id="toastUndo" class="toast-act">` that `toastUndo()` builds at line 939 inherited `none`
  and was skipped by hit testing entirely — `onclick` (line 942) never fired and `cursor:pointer`
  never even painted, which matches the reported symptom exactly. Checked the two other
  `pointer-events` sites (`.pc-canvas-wrap::after`, `.tour-spot`) — neither selector can match the
  span — and confirmed no JS anywhere assigns `style.pointerEvents`.
- **Fixed it with one declaration:** `.toast-act` now sets `pointer-events:auto`. `#toast` keeps
  `pointer-events:none`. Extended the comment above the rule, which previously claimed
  `margin-left` was the *only* deliberate difference from `.pui-toast__action`, so it now names
  both differences and says why this one must not be "synced away".
- **Added a `toast-hit` key to `docs/btn-parity-proof.mjs`** covering `#toast` *and* `#toastUndo`.
  The container row is the point: it is what proves `pointer-events:none` was not quietly removed.
- **Updated README** — the "not yet fixed" blockquote now records the fix, the proof, and the two
  things the proof does not cover; the DS-side gap list now says the `.pui-toast` half is queued
  rather than owner-blocked.

## Why

**Why the fix went on the child and not the container.** The obvious "fix" is to delete
`pointer-events:none` from `#toast`. That is wrong. The toast is `position:fixed`, up to
`max-width:80vw` wide, at `z-index:200`, and stays up for 5s — the container rule is what stops it
from eating clicks on the board underneath. Removing it trades a dead link for a dead screen
region. `pointer-events:auto` on the one interactive descendant is the standard idiom for exactly
this shape, and per spec a descendant with `auto` *is* hit-tested even under a `none` ancestor.

**Why the design system was not used as the reference here.** `.pui-toast` sets no
`pointer-events` at all, so its action works — and its toast swallows clicks for its whole
lifetime. Copying Phantom UI in this one place would have imported the worse of the two bugs. This
is the one spot in the parity work where the app is right and the library is wrong, and the code
comment now says so, so a later "make it match the DS" round does not undo this.

**Why the harness is expected to fail this round.** Every previous use of
`btn-parity-proof.mjs` argued "this refactor moves nothing"; a `PASS` was the claim. This round
*intends* a behaviour change, so the run's job is to show precisely which declarations moved and
that nothing else did — the same reading README decision 5 already sets out. Making it green would
have meant either not fixing the bug or editing the harness to look away.

## Verification

**Verify command — all three stages, on the committed tree:**

```
$ node tools/test.mjs
54 passed, 0 failed

$ node tools/check-tokens.mjs
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)

$ npm --prefix design-system test
Test Files  12 passed (12)
     Tests  31 passed (31)
```

**The change itself —** `node docs/btn-parity-proof.mjs toast-hit 3d3d5cc:index.html index.html`
(exit 1, as intended):

```
markup coverage OK — 0 old class tokens gone, 0 new class attributes at the expected counts

✗ #toastUndo (base)
    pointer-events
      before: (unset)   <- -
      after : auto   <- .toast-act
… identical single-property diff repeated for :hover, :disabled, :disabled:hover, :focus …

compared 10 (element, state) pairs across 2 "toast-hit" elements
media-conditional rules that matched a test element:
  @media(prefers-reduced-motion:reduce) { * }

FAIL — 5 declaration(s) differ, 0 markup problem(s). The refactor moves pixels; revert it.
```

`#toast` produced **no diff in any of its five states** — that is the evidence that the container
rule survived untouched. `#toastUndo` differs in exactly one property. Nothing else moved.

**Negative tests (two), each run against a mutated copy of `index.html` in the temp dir, both
deleted afterwards:**

| Mutation | Result |
|---|---|
| strip `pointer-events:none` off `#toast` | 5 → **10** diffs; the `#toast` rows light up `none` → `(unset)` in all five states |
| recolour `.toast-act` to `var(--secondary)` | 5 → **10** diffs; `color` appears alongside `pointer-events` |

The first is the one that matters: it proves the `#toast` row is genuinely live and would catch the
specific mistake this round was warned against, rather than silently matching nothing.

## What I did NOT do

- **Did not fix `.pui-toast`.** It has the mirror defect — no `pointer-events` at all, so a Phantom
  UI toast blocks clicks under it for its whole lifetime. That is a library behaviour change and a
  separate task; it is now the Next task, with the three pre-checks it needs.
- **Did not check the `## Open decisions` off, answer any, or add a seventh.** All six are still
  unanswered, so the three acceptance criteria they gate stay unticked. I re-read the section
  first, as the contract requires; nothing had been answered.
- **Ticked no acceptance criterion.** This bug was not one — it was found *by* the parity work, not
  required by it.
- **Did not touch `tools/`,** per the contract, and added no seventh token check.
- **Did not add a design-system test for this.** `Toast.test.tsx` runs in jsdom, which does no hit
  testing, so a `userEvent.click` on the action passes whether or not `pointer-events` is set. A
  test that cannot fail on the bug would be worse than none.

## Risk

**Read this closely — the proof has a hole, and it is the important part.**

1. **The harness models no inheritance.** It builds each element's declaration set only from rules
   that match that element, so `#toast`'s `pointer-events:none` never appears in `#toastUndo`'s
   map — the child shows `(unset)` before the fix, not `none`. Inheritance *is* the whole mechanism
   of this bug, so the run proves the change is minimal but cannot prove the bug existed or that it
   is gone. That rests on reading the source against the spec (`pointer-events` is `Inherited:
   yes`, and a descendant may re-enable itself with `auto`). I did not extend the harness to model
   inheritance — that is a real change to a shared tool for a single round's benefit.
2. **The markup-coverage phase is vacuous this round** (`0 old class tokens gone, 0 new class
   attributes`) because no class attribute changed. It printed OK and proved nothing. Both
   AUTOPILOT.md and the harness comment now say so, so it is not mistaken for a second check.
3. **Still nobody has opened the app in a browser** — no round has, decision 4 unanswered.
   Nothing here was clicked. If some rule I did not find re-disables the span, this fix does not
   land and the run above would look identical.
4. **The fix is unreachable from the test suite.** `tools/test.mjs` extracts pure logic between the
   `PURE-LOGIC` markers; CSS is outside it by design. No automated check in the Verify command can
   regress-guard this line — only the `toast-hit` key can, and it is deliberately not in Verify.
5. **`#toast` is now a click-through element with one clickable child.** If a future round adds a
   second interactive element to the toast (a close button, say), it will be dead on arrival for
   exactly the same reason. The code comment warns about this; nothing enforces it.
