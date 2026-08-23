# Round 2026-08-24_0023

## What I did

- **Restored the previous round's tip.** The runner cut this branch from `3503537` again — the
  round-1 base, missing ~20 commits of Phantom UI work. Restored the tree from `e245085`
  (tip of `auto/…/2026-08-24_0003`) and verified `git diff e245085` was empty before committing.
- **Fixed the library-side mirror of the toast hit-testing defect** (`Toast.css`, 2 declarations):
  `.pui-toast{pointer-events:none}` + `.pui-toast__action{pointer-events:auto}`, with a comment
  explaining why the two must always ship together. Both sides of the codebase are now correct.
- **Ran all three pre-checks the previous round required**, plus found one thing it didn't ask about
  (see Risk). None of them blocked the change.
- **Corrected one sentence of the app-side comment** on `.toast-act` in `index.html`. It read
  *".pui-toast has no pointer-events:none, so it needs no counterpart here"* — this round made that
  false. A comment is not a declaration and moves no pixels; the parity harness confirms it.
- **Set the next task**: write a **decision 7** in the README for a *different* gap I found while
  checking this one (disabled controls still hover in the DS). That one changes visible colour, so
  it is the owner's call — I deliberately did not fix it. Details below.

## Why

**The defect.** `.pui-toast` is `position:fixed`, `z-index:200`, `max-width:80vw`, and it never
set `pointer-events`. `opacity:0` does not stop hit testing, so the element sat over the page
swallowing clicks — visibly for the ~5s it showed, and arguably at all times in a consumer that
keeps one mounted. The demo gallery (`design-system/demo/main.tsx:96`) renders a permanently-open
`<Toast>`, so it demonstrates the bug rather than depending on the old behaviour.

**Why two declarations, not one.** `pointer-events` is an *inherited* property. Setting `:none`
on the container reaches every descendant, so any interactive child must opt back in with `:auto`
or it stops being a hit target — handler never fires, cursor never changes. Adding only the first
declaration would have reproduced, in the library, the exact bug the app fixed last round. That is
why the comment ties them together explicitly.

**Why this was mine to fix and decision 7 is not.** Round 0047 ruled that the `.menu-pop
button:disabled:hover` gap is owner territory because fixing it *changes a colour people see*.
This fix changes no pixel in any state — it is hit-testing only. That line is exactly where I
stopped: the disabled-hover gaps I found this round do move colour, so I wrote them up instead.

## Verification

All three Verify steps, run at the final commit:

```
node tools/test.mjs                → 54 passed, 0 failed
node tools/check-tokens.mjs        → all 6 checks pass (22/22 tokens, 4/4 fonts,
                                     no derived-colour literals, font weights available,
                                     no radius literals, typeface from one source)
npm --prefix design-system test    → 12 files, 31 passed
```

App-side untouched, per the previous round's instruction:

```
node docs/btn-parity-proof.mjs toast-hit 3d3d5cc:index.html index.html
→ FAIL — 5 declaration(s) differ, 0 markup problem(s)
```

That is the **expected and required** result: 5 is the count round 0003 deliberately introduced.
All 5 are on `#toastUndo` (`pointer-events (unset)→auto`, one per state). `#toast` — the other of
the 2 elements compared, 10 pairs total — shows **no diff in any state**, which is the evidence
that this round did not touch the app's toast rules.

**Negative test** (to prove the 5 is read from the live file, not a stale constant): removed
`pointer-events:auto` from `.toast-act`, re-ran → **`PASS — every element computes an identical
declaration set`** (0 diffs). Restored it, re-ran → back to 5. So the harness is still tracking
that exact declaration.

**Evidence for the DS change is the diff itself** — `docs/btn-parity-proof.mjs` parses only the
`<style>` block of `index.html` and cannot read DS `.css` files at all, as the previous round warned:

```diff
-  opacity:0; transition:.25s; z-index:200; max-width:80vw; font-family:var(--mono);
+  opacity:0; transition:.25s; z-index:200; pointer-events:none; max-width:80vw; font-family:var(--mono);
-.pui-toast__action{… text-decoration:underline; margin-left:8px}
+.pui-toast__action{… text-decoration:underline; margin-left:8px; pointer-events:auto}
```

**Pre-checks** (all three required by the previous round):

1. `Toast.tsx` — exactly one clickable child, `.pui-toast__action` (a `<span onClick>`). No close
   button, no `onClick` declared on the root. So `__action` is the only child needing `:auto`.
2. `Toast.test.tsx` (3 tests) — uses `fireEvent.click`, which dispatches straight at the node.
   jsdom does no hit testing, so these tests are **green before and after and prove nothing about
   this bug**. I am not claiming otherwise; the previous round was right to call this out.
3. Demo gallery — `design-system/demo/main.tsx:96` renders `<Toast open message="…" />` with no
   action and no root handler. Nothing depends on the old behaviour; it is a victim of the bug.

## What I did NOT do

- **Did not fix the disabled-hover gaps I found.** The DS has no `:disabled:hover` reset anywhere,
  while the app has three (`index.html:492`, `:574`, `:585`). Consequences today:
  `.pui-btn--icon:hover` (line 15) overrides the disabled `color`; `--ghost`/`--tab` hover states
  still apply when disabled. Fixing any of it changes rendered colour → owner's call, per the
  precedent round 0047 set. Written up as the next task (a README decision 7, not a code change).
- **Did not touch `tools/`** or add a 7th token check — the contract forbids it and all 22 tokens
  are already covered.
- **Did not answer any of the six open decisions.** I re-read `README.md` `## Open decisions`
  first, as instructed; none has an owner answer yet, so the fallback task applied.
- **Did not open a browser.** Decision 4 (MCP permission) is still unanswered, and the previous
  rounds established that retrying without it just burns a round.

## Risk

**Read this one closely — it is a real caveat the pre-check list did not ask about.**
`Toast.tsx` spreads `{...rest}` onto the root div (added in `e3a355c`, "forward native props on
all components"). A consumer *can* therefore pass `onClick` to the root, and `pointer-events:none`
will now silently swallow it. I judged this acceptable and documented it in the CSS comment,
because the root is `role="status"` — an ARIA live region, not an interactive element — and the
component already ships `action` as its interaction affordance. **If any consumer outside this
repo puts a handler on the Toast root, this change breaks it, and nothing in the test suite will
catch that.** If you disagree, the narrower fix is to scope `:none` to a wrapper rather than the
root.

Other things worth a reviewer's attention:

- **Nothing executable proves the fix works.** jsdom ignores `pointer-events` (verified by reading
  the tests, not assumed), the token checker does not model hit testing, and the parity harness
  cannot read DS `.css`. The argument is from source plus the CSS spec — `pointer-events` inherits,
  `opacity:0` does not suppress hit testing. Correct, but unexecuted. Decision 4 is what would
  close this gap, for this change and for the twelve rounds of CSS work before it.
- **This is a behaviour change to a library other consumers use.** Justified as a pure defect fix,
  but it is not a no-op: clicks that previously landed on the toast will now pass through to
  whatever is beneath it. That is the intent — flagging it so it is a decision, not a surprise.
- **The parity harness reports FAIL and that is correct.** Anyone skimming for green output will
  misread it. The 5 diffs belong to round 0003; `toast-hit` exists to show *what* moved, not to pass.
- The restore commit (`5bb41cb`) is large by line count but is a mechanical `git checkout e245085 -- .`
  with a verified-empty diff against that ref — not new work.
