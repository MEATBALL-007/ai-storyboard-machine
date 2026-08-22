# Round summary — 2026-08-23_0027

## What I did

- **Restored the previous round's work first.** The branch was cut from stale base `3503537`
  again (5th round running). `tools/check-tokens.mjs` and every token/font change were missing,
  so the contract's own Verify command could not have run. Restored the tip of
  `auto/…/2026-08-23_0014` (`e9cfbd1`) with `git checkout <sha> -- .` as its own commit
  (`2488f2d`) before starting the real task.
- **Collapsed the app's buttons onto a `.btn` base plus `.btn--primary/--ghost/--icon/--tab`
  modifiers** (`9fab5c9`), mirroring `.pui-btn` + `--primary/--ghost/--icon/--tab` in
  `design-system/src/components/Button/Button.css`. The `.modal-actions button` descendant
  selector is gone; `padding` and `font-size` now sit on the modifiers, exactly as in the design
  system. 17 buttons across markup and one JS template string were rewritten, plus two
  `$$('.tab-btn')` call sites.
- **Folded the three tour buttons into the same vocabulary.** `.tour-skip` and `.tour-back` were
  a third copy of the ghost button's declarations and `.tour-next` was styled by `.btn-primary`
  already; all three are now `.btn--ghost` / `.btn--primary`, and the three redundant rules were
  deleted. `.tour-back:disabled` became `#tourBack:disabled` (the class no longer exists).
- **Wrote `docs/btn-parity-proof.mjs`** — the mechanical proof the contract demanded in place of
  a browser. It reads a before and an after copy of `index.html` (either as paths or as
  `<rev>:<path>`, via `git show`), parses the `<style>` block, and for each of the 17 buttons in
  5 interaction states rebuilds the winning declaration set from the cascade — specificity, then
  source order, then the inline `style=` — and diffs before against after.
- **Updated `README.md` and `AUTOPILOT.md`** to describe the new structure, why the base is
  deliberately thinner than `.pui-btn`, and what the next round should do.

## Why

**The base is thinner than `.pui-btn`, on purpose.** Phantom UI's base also sets
`display:inline-flex`, `gap:6px`, `letter-spacing:.4px`, `transition:.12s` and
`border:1px solid transparent`. `index.html` has a `button{}` element reset that the React
components have no counterpart to — buttons here start as `inline-block` with `border:none` —
so copying those five declarations would have grown every modal button by 2px in each dimension
and switched its layout mode. That is a design change, not a refactor, so `.btn` holds only what
was already true of every variant (`font-family`, `cursor`, `border-radius`) and everything else
stayed on the modifiers. This is recorded in README under "Buttons: a base class the app did
not have" so the gap is visible rather than forgotten.

**The tour buttons keep their pixels through specificity, not luck.** `.tour-btns button` is
(0,1,1) and beats any `.btn--*` modifier at (0,1,0), so moving `padding:7px 16px` and
`font-size:11px` onto `.btn--primary` cannot reach `#tourNext` — it still measures 6px 13px /
10.5px. The proof harness checks this rather than asserting it.

**The proof script is not in the Verify command, and that is deliberate.** It does not test a
requirement; it compares two revisions of one edit. Wiring it into Verify would give a future
round a green light it has not earned.

## Verification

`node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`:

```
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)

Test Files  12 passed (12)
     Tests  31 passed (31)
```

`node docs/btn-parity-proof.mjs 9fab5c9~1:index.html index.html`:

```
markup coverage OK — 7 old class tokens gone, 5 new class attributes at the expected counts

compared 85 (element, state) pairs across 17 buttons
media-conditional rules that matched a test element:
  @media(prefers-reduced-motion:reduce) { * }

PASS — every button computes an identical declaration set before and after.
```

The harness was proved sensitive before it was trusted — four runs that had to fail, and did:

| Injected fault | Result |
|---|---|
| Run against the file before any edit (new classes not yet applied) | FAIL, 431 declarations differ |
| `.btn--icon` padding `5px 10px` → `5px 11px` | FAIL, `padding` differs on all 6 icon buttons |
| `border-radius` dropped from the `.btn` base | FAIL, 70 declarations differ |
| One markup site left as `class="icon-btn"` | FAIL at the markup phase, before the cascade diff |

Sizes, measured as git blobs (`git cat-file -s`), which is what README's byte counts mean:
`index.html` 303,787 → 304,102 bytes (+315). Line count 4,034 → 4,035.

## What I did NOT do

- **Did not touch `tools/`** and did not add a seventh token check — AUTOPILOT forbids both, and
  all 22 tokens already have one.
- **Did not answer any of the four `## Open decisions` in README.** None had been answered (no
  `jspdf.umd.min.js` was dropped into the repo, no new text in that section), so I ran the
  fallback task as instructed. Every one of them moves pixels or adds a file — the owner's call.
- **Did not adopt `.pui-btn`'s remaining five declarations** — see Why. This is the one place
  where app and design system still genuinely differ on buttons, and it is now written down in
  README rather than left implicit.
- **Did not touch the other descendant-selector button groups** (`.menu-pop button`,
  `.pc-tools button`, `.mini-btns button`, the three toggles, `.sl-export button`,
  `#animaticBar button`, `.cmt-add button`). They map to `Menu.css` / `SegmentedToggle.css`,
  not `Button.css`; that is the next task.
- **Did not verify in a browser.** Decision 4 (the MCP permission) is still unanswered, and
  earlier rounds established that Playwright and Chrome-DevTools are permission-blocked here.

## Risk

- **The proof is a cascade model, not a rendering.** It reads the `<style>` block and computes
  which declarations win. It does *not* expand shorthands to longhands (sound here only because
  the refactor never trades a shorthand for a longhand), treats `>`/`+`/`~` and structural
  pseudo-classes as non-matching, and cannot see anything a real layout engine would. If a
  reviewer can open the file in a browser, the four things worth a glance are: the top bar's
  icon buttons, the two view tabs, the two modals' footers, and the first-run tour's three
  buttons.
- **The 17 elements are hand-listed in the harness.** If I had missed a button entirely it would
  not appear in the diff. Two things bound that: the markup-coverage phase fails if any old
  class token survives anywhere in the file, and it does not (0 occurrences of `tab-btn`,
  `icon-btn`, `btn-primary`, `btn-ghost`, `tour-skip`, `tour-back`, `tour-next`). The
  substitution itself asserted an exact expected count per pattern before writing.
- **`#collapseRight` and `#retryGen` are modelled with assumed ancestors** (`#right`, and
  `#grid` › `.empty-state`). Both are correct as of this revision, but they are typed into the
  harness rather than parsed from the document.
- **`.tour-skip` / `.tour-back` / `.tour-next` class names are gone.** Nothing referenced them —
  the JS reaches those buttons by id — but any future CSS or bookmarklet targeting them breaks.
- **The branch is still cut from a stale base.** This round's restore commit is the fifth. Until
  the runner branches from the previous round or the PRs land on `main`, every round pays this
  tax and risks a round that restores nothing because the agent did not notice.
