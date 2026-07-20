# Phantom UI Component Library — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the AI Storyboard Machine's inline UI into a buildable React + TypeScript component library at `design-system/`, so it can later be synced to claude.ai/design.

**Architecture:** A self-contained npm package (`@phantom/ui`) built with Vite library mode. ~12 primitive components are thin typed React wrappers over CSS ported verbatim from `index.html`'s `<style>`, keyed to `pui-`-prefixed classes. Design tokens are `:root` CSS variables; JetBrains Mono is self-hosted. A single aggregate `styles.css` `@import`s tokens, fonts, and every component's CSS — that closure is what claude.ai/design will consume.

**Tech Stack:** React 18, TypeScript (strict), Vite (library mode) + `vite-plugin-dts`, Vitest + Testing Library (jsdom), `@fontsource/jetbrains-mono`.

## Global Constraints

- Everything lives under `design-system/`. Do NOT modify `index.html` or the app — the library is additive.
- Node 18+. Package manager: **npm** (a committed `package-lock.json` is required by the later design-sync step).
- React/ReactDOM are **peerDependencies** (externalized in the build); also devDependencies for building/testing.
- Global (library) name for the UMD build: **`PhantomUI`**.
- Class naming: component classes are **`pui-`-prefixed** (`pui-btn`, `pui-chip`, …); state classes use `is-*` (`is-active`, `is-selected`, `is-open`); element sub-parts use `__` (`pui-modal__title`). Tokens stay **unprefixed** (`--accent`, …), copied verbatim from the app.
- CSS values are **ported verbatim** from `index.html` — same colors, sizes, transitions. Dark-only. No invented spacing/type scale.
- **No provider/wrapper:** every component root sets `font-family: var(--mono)`; styling works the moment `styles.css` is imported.
- **Component `.tsx` files do NOT import their own `.css`.** All CSS is aggregated by `src/styles.css`, which `index.ts` imports once. Each component task appends one `@import` line to `styles.css`.
- Every component forwards `className` and (where natural) native element props.

---

## File Structure

```
design-system/
  package.json              # @phantom/ui, scripts, deps, exports
  package-lock.json         # committed (npm install generates it)
  tsconfig.json
  vite.config.ts            # library build + vitest config
  vitest.setup.ts           # jest-dom matchers
  .gitignore                # node_modules, dist
  index.html                # dev entry for the demo gallery
  src/
    index.ts                # public API: re-exports + imports styles.css
    tokens.css              # :root variables (verbatim)
    fonts.css               # @font-face x4 (self-hosted JetBrains Mono)
    fonts/                  # jetbrains-mono-latin-{400,500,700,800}-normal.woff2
    styles.css              # @import tokens + fonts + every component css
    lib/cn.ts               # className joiner
    components/
      Button/{Button.tsx, Button.css, Button.test.tsx, index.ts}
      Chip/{...}
      Field/{Input.tsx, Textarea.tsx, Select.tsx, Field.css, Field.test.tsx, index.ts}
      Toggle/{...}
      Modal/{...}
      Toast/{...}
      Menu/{...}
      SegmentedToggle/{...}
      Swatch/{...}
      Badge/{...}
      EmptyState/{...}
  demo/
    main.tsx                # renders every component (visual gallery)
  dist/                     # build output (gitignored)
```

---

### Task 1: Scaffold the package + `cn` helper

**Files:**
- Create: `design-system/package.json`, `design-system/tsconfig.json`, `design-system/vite.config.ts`, `design-system/vitest.setup.ts`, `design-system/.gitignore`, `design-system/src/index.ts`, `design-system/src/lib/cn.ts`
- Test: `design-system/src/lib/cn.test.ts`

**Interfaces:**
- Produces: `cn(...parts: Array<string | false | null | undefined>): string` — joins truthy parts with a space.

- [ ] **Step 1: Create `design-system/package.json`**

```json
{
  "name": "@phantom/ui",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/phantom-ui.umd.cjs",
  "module": "./dist/phantom-ui.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/phantom-ui.js",
      "require": "./dist/phantom-ui.umd.cjs"
    },
    "./styles.css": "./dist/phantom-ui.css"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "devDependencies": {
    "@fontsource/jetbrains-mono": "^5.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "vite-plugin-dts": "^4.0.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create `design-system/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "demo", "vite.config.ts", "vitest.setup.ts"]
}
```

- [ ] **Step 3: Create `design-system/vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react(), dts({ include: ['src'], rollupTypes: true })],
  build: {
    lib: {
      entry: r('./src/index.ts'),
      name: 'PhantomUI',
      fileName: 'phantom-ui',
      formats: ['es', 'umd'],
      cssFileName: 'phantom-ui',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
```

- [ ] **Step 4: Create `design-system/vitest.setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Create `design-system/.gitignore`**

```
node_modules
dist
```

- [ ] **Step 6: Create `design-system/src/lib/cn.ts`**

```ts
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
```

- [ ] **Step 7: Create `design-system/src/index.ts`** (temporary content — later tasks add exports)

```ts
export { cn } from './lib/cn';
```

- [ ] **Step 8: Write the failing test — `design-system/src/lib/cn.test.ts`**

```ts
import { cn } from './cn';

test('joins truthy parts with a space, dropping falsy', () => {
  expect(cn('a', false, 'b', null, undefined, 'c')).toBe('a b c');
});

test('returns empty string when all falsy', () => {
  expect(cn(false, null, undefined)).toBe('');
});
```

- [ ] **Step 9: Install dependencies**

Run: `cd design-system && npm install`
Expected: completes, writes `package-lock.json` and `node_modules/`.

- [ ] **Step 10: Run the test to verify it passes**

Run: `cd design-system && npm test`
Expected: PASS (2 passing).

- [ ] **Step 11: Verify typecheck and build**

Run: `cd design-system && npm run typecheck && npm run build`
Expected: typecheck clean; build emits `dist/phantom-ui.js`, `dist/phantom-ui.umd.cjs`, `dist/index.d.ts`.

- [ ] **Step 12: Commit**

```bash
git add design-system/package.json design-system/package-lock.json design-system/tsconfig.json design-system/vite.config.ts design-system/vitest.setup.ts design-system/.gitignore design-system/src/index.ts design-system/src/lib/cn.ts design-system/src/lib/cn.test.ts
git commit -m "feat(ds): scaffold @phantom/ui package with cn helper"
```

---

### Task 2: Tokens, fonts, and the aggregate stylesheet

**Files:**
- Create: `design-system/src/tokens.css`, `design-system/src/fonts.css`, `design-system/src/styles.css`, `design-system/src/fonts/` (four woff2 files)
- Modify: `design-system/src/index.ts`

**Interfaces:**
- Produces: `src/styles.css` — the single import root. Later component tasks append one `@import './components/<Name>/<Name>.css';` line to it. `index.ts` imports it once.

- [ ] **Step 1: Create `design-system/src/tokens.css`** (verbatim from the app's `:root`)

```css
:root{
  --bg:#0D0D0D; --surface:#111111; --surface2:#141414;
  --panel:#0C0C0C; --card:#111111;
  --accent:#FFC72C; --secondary:#FA4616;
  --text:#E0E0E0; --muted:#9a9a9a; --dim:#2E2E2E;
  --line:#1c1c1c;
  --mono:'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

- [ ] **Step 2: Vendor the font files**

Run (copies the latin woff2 for the four weights the app uses into `src/fonts/`):

```bash
cd design-system
mkdir -p src/fonts
for w in 400 500 700 800; do
  cp "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${w}-normal.woff2" "src/fonts/jetbrains-mono-latin-${w}-normal.woff2"
done
ls src/fonts
```
Expected: four `.woff2` files listed.

- [ ] **Step 3: Create `design-system/src/fonts.css`**

```css
@font-face{
  font-family:'JetBrains Mono'; font-style:normal; font-weight:400; font-display:swap;
  src:url('./fonts/jetbrains-mono-latin-400-normal.woff2') format('woff2');
}
@font-face{
  font-family:'JetBrains Mono'; font-style:normal; font-weight:500; font-display:swap;
  src:url('./fonts/jetbrains-mono-latin-500-normal.woff2') format('woff2');
}
@font-face{
  font-family:'JetBrains Mono'; font-style:normal; font-weight:700; font-display:swap;
  src:url('./fonts/jetbrains-mono-latin-700-normal.woff2') format('woff2');
}
@font-face{
  font-family:'JetBrains Mono'; font-style:normal; font-weight:800; font-display:swap;
  src:url('./fonts/jetbrains-mono-latin-800-normal.woff2') format('woff2');
}
```

- [ ] **Step 4: Create `design-system/src/styles.css`** (component `@import`s get appended by later tasks)

```css
@import './tokens.css';
@import './fonts.css';

/* component styles (appended per component task) */
```

- [ ] **Step 5: Update `design-system/src/index.ts` to import the stylesheet**

```ts
import './styles.css';

export { cn } from './lib/cn';
```

- [ ] **Step 6: Build and verify the CSS closure is bundled**

Run:
```bash
cd design-system && npm run build && grep -c "FFC72C" dist/phantom-ui.css && grep -c "@font-face" dist/phantom-ui.css
```
Expected: build succeeds; first grep prints `1` (the `--accent` token is present), second prints `4` (four `@font-face` rules).

- [ ] **Step 7: Commit**

```bash
git add design-system/src/tokens.css design-system/src/fonts.css design-system/src/fonts design-system/src/styles.css design-system/src/index.ts
git commit -m "feat(ds): tokens, self-hosted JetBrains Mono, aggregate styles.css"
```

---

### Task 3: Button

**Files:**
- Create: `design-system/src/components/Button/Button.tsx`, `Button.css`, `Button.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn` from `../../lib/cn`.
- Produces: `Button`, `ButtonProps`, `ButtonVariant` (`'primary' | 'ghost' | 'icon' | 'tab'`).

- [ ] **Step 1: Write the failing test — `Button.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { Button } from './Button';

test('renders base + primary variant classes by default', () => {
  const { getByRole } = render(<Button>Go</Button>);
  expect(getByRole('button')).toHaveClass('pui-btn', 'pui-btn--primary');
});

test('tab variant honors active state', () => {
  const { getByRole } = render(<Button variant="tab" active>Tab</Button>);
  expect(getByRole('button')).toHaveClass('pui-btn--tab', 'is-active');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Button`
Expected: FAIL (cannot resolve `./Button`).

- [ ] **Step 3: Create `Button.tsx`**

```tsx
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'ghost' | 'icon' | 'tab';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  active?: boolean;
}

export function Button({ variant = 'primary', active, className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn('pui-btn', `pui-btn--${variant}`, active && 'is-active', className)}
      {...rest}
    />
  );
}
```

- [ ] **Step 4: Create `Button.css`** (ported from `.btn-primary`/`#genBtn`, `.btn-ghost`, `.icon-btn`, `.tab-btn`)

```css
.pui-btn{
  font-family:var(--mono); cursor:pointer; display:inline-flex; align-items:center;
  gap:6px; border:1px solid transparent; border-radius:3px; letter-spacing:.4px;
  transition:.12s; font-size:10.5px;
}
.pui-btn:disabled{opacity:.5; cursor:not-allowed; box-shadow:none}

.pui-btn--primary{background:var(--accent); color:#000; font-weight:700; padding:7px 16px; font-size:11px}
.pui-btn--primary:hover{box-shadow:0 0 14px rgba(255,199,44,.4)}

.pui-btn--ghost{background:none; color:var(--muted); border-color:var(--line); padding:7px 16px; font-size:11px}
.pui-btn--ghost:hover{color:var(--text); border-color:var(--dim)}

.pui-btn--icon{background:none; color:var(--muted); border-color:var(--line); padding:5px 10px}
.pui-btn--icon:hover{color:var(--accent); border-color:var(--dim); background:var(--surface)}
.pui-btn--icon:disabled{opacity:.32; color:var(--dim)}

.pui-btn--tab{background:none; color:var(--muted); padding:5px 11px}
.pui-btn--tab:hover{color:var(--text); background:var(--surface)}
.pui-btn--tab.is-active{color:var(--accent); border-color:var(--dim); background:var(--surface)}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Button';
```

- [ ] **Step 6: Wire into `src/index.ts`** (add after the `cn` export)

```ts
export * from './components/Button';
```

- [ ] **Step 7: Append to `src/styles.css`** (under the component-styles comment)

```css
@import './components/Button/Button.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Button`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Button design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Button (primary/ghost/icon/tab variants)"
```

---

### Task 4: Chip

**Files:**
- Create: `design-system/src/components/Chip/Chip.tsx`, `Chip.css`, `Chip.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Chip`, `ChipProps` (extends `HTMLAttributes<HTMLDivElement>`, adds `selected?: boolean`).

- [ ] **Step 1: Write the failing test — `Chip.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { Chip } from './Chip';

test('renders base class', () => {
  const { getByText } = render(<Chip>8</Chip>);
  expect(getByText('8')).toHaveClass('pui-chip');
});

test('selected adds is-selected', () => {
  const { getByText } = render(<Chip selected>8</Chip>);
  expect(getByText('8')).toHaveClass('pui-chip', 'is-selected');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Chip`
Expected: FAIL (cannot resolve `./Chip`).

- [ ] **Step 3: Create `Chip.tsx`**

```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export function Chip({ selected, className, ...rest }: ChipProps) {
  return <div className={cn('pui-chip', selected && 'is-selected', className)} {...rest} />;
}
```

- [ ] **Step 4: Create `Chip.css`** (ported from `.chip`)

```css
.pui-chip{
  background:var(--surface); border:1px solid var(--line); border-radius:3px;
  padding:6px 10px; text-align:center; font-size:10px; color:var(--muted);
  transition:.1s; user-select:none; cursor:pointer; font-family:var(--mono);
}
.pui-chip:hover{border-color:var(--dim); color:var(--text)}
.pui-chip.is-selected{background:var(--accent); color:#000; border-color:var(--accent); font-weight:700}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Chip';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/Chip';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/Chip/Chip.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Chip`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Chip design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Chip (selectable)"
```

---

### Task 5: Form fields (Input, Textarea, Select)

**Files:**
- Create: `design-system/src/components/Field/Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Field.css`, `Field.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces:
  - `Input`, `InputProps` (extends `InputHTMLAttributes<HTMLInputElement>`, adds `label?`, `hint?`)
  - `Textarea`, `TextareaProps` (extends `TextareaHTMLAttributes<HTMLTextAreaElement>`, adds `label?`)
  - `Select`, `SelectProps` (extends `SelectHTMLAttributes<HTMLSelectElement>`, adds `label?`, `options?: SelectOption[]`), `SelectOption` (`{ value: string; label: string }`)

- [ ] **Step 1: Write the failing test — `Field.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';

test('Input renders label and input with base class', () => {
  const { getByText, container } = render(<Input label="Name" />);
  expect(getByText('Name')).toHaveClass('pui-field__label');
  expect(container.querySelector('input')).toHaveClass('pui-input');
});

test('Textarea renders base class', () => {
  const { container } = render(<Textarea label="Body" />);
  expect(container.querySelector('textarea')).toHaveClass('pui-textarea');
});

test('Select renders options from prop', () => {
  const { container, getByText } = render(
    <Select label="Aspect" options={[{ value: '16:9', label: '16:9' }]} />,
  );
  expect(container.querySelector('select')).toHaveClass('pui-select');
  expect(getByText('16:9')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Field`
Expected: FAIL (cannot resolve `./Input`).

- [ ] **Step 3: Create `Input.tsx`**

```tsx
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className, ...rest }: InputProps) {
  return (
    <label className="pui-field">
      {label && <span className="pui-field__label">{label}</span>}
      <input className={cn('pui-input', className)} {...rest} />
      {hint && <span className="pui-field__hint">{hint}</span>}
    </label>
  );
}
```

- [ ] **Step 4: Create `Textarea.tsx`**

```tsx
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...rest }: TextareaProps) {
  return (
    <label className="pui-field">
      {label && <span className="pui-field__label">{label}</span>}
      <textarea className={cn('pui-textarea', className)} {...rest} />
    </label>
  );
}
```

- [ ] **Step 5: Create `Select.tsx`**

```tsx
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
}

export function Select({ label, options, className, children, ...rest }: SelectProps) {
  return (
    <label className="pui-field">
      {label && <span className="pui-field__label">{label}</span>}
      <select className={cn('pui-select', className)} {...rest}>
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))
          : children}
      </select>
    </label>
  );
}
```

- [ ] **Step 6: Create `Field.css`** (ported from `input.ti`/`textarea`/`select.ti`, `.fld label`, `.apikey-note`)

```css
.pui-field{display:block; margin-bottom:10px; font-family:var(--mono)}
.pui-field__label{display:block; font-size:9.5px; color:var(--muted); margin-bottom:4px; letter-spacing:.5px}
.pui-field__hint{display:block; font-size:9px; color:var(--muted); line-height:1.5; margin-top:6px}

.pui-input,.pui-textarea,.pui-select{
  width:100%; background:var(--surface); border:1px solid var(--line);
  border-radius:3px; padding:6px 8px; font-size:11px; color:var(--text); font-family:var(--mono);
}
.pui-textarea{resize:vertical; min-height:60px; line-height:1.5}
.pui-input:focus,.pui-textarea:focus,.pui-select:focus{outline:1px solid var(--accent); outline-offset:-1px}
```

- [ ] **Step 7: Create `index.ts`**

```ts
export * from './Input';
export * from './Textarea';
export * from './Select';
```

- [ ] **Step 8: Wire into `src/index.ts`**

```ts
export * from './components/Field';
```

- [ ] **Step 9: Append to `src/styles.css`**

```css
@import './components/Field/Field.css';
```

- [ ] **Step 10: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Field`
Expected: PASS (3 passing).

- [ ] **Step 11: Commit**

```bash
git add design-system/src/components/Field design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): form fields (Input, Textarea, Select)"
```

---

### Task 6: Toggle

**Files:**
- Create: `design-system/src/components/Toggle/Toggle.tsx`, `Toggle.css`, `Toggle.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Toggle`, `ToggleProps` (`{ checked: boolean; onChange: (checked: boolean) => void; label: string; className?: string; id?: string }`).

- [ ] **Step 1: Write the failing test — `Toggle.test.tsx`**

```tsx
import { render, fireEvent } from '@testing-library/react';
import { Toggle } from './Toggle';

test('renders label + checkbox and reflects checked', () => {
  const { getByRole, getByText } = render(
    <Toggle checked label="AI art" onChange={() => {}} />,
  );
  expect(getByText('AI art')).toBeInTheDocument();
  expect(getByRole('checkbox')).toBeChecked();
});

test('calls onChange with next value', () => {
  const calls: boolean[] = [];
  const { getByRole } = render(
    <Toggle checked={false} label="AI art" onChange={(v) => calls.push(v)} />,
  );
  fireEvent.click(getByRole('checkbox'));
  expect(calls).toEqual([true]);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Toggle`
Expected: FAIL (cannot resolve `./Toggle`).

- [ ] **Step 3: Create `Toggle.tsx`**

```tsx
import { cn } from '../../lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, className, id }: ToggleProps) {
  return (
    <label className={cn('pui-toggle', className)}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
```

- [ ] **Step 4: Create `Toggle.css`** (ported from `.toggle-row`)

```css
.pui-toggle{display:flex; align-items:center; gap:7px; font-size:10px; color:var(--muted); cursor:pointer; font-family:var(--mono)}
.pui-toggle input{accent-color:var(--accent)}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Toggle';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/Toggle';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/Toggle/Toggle.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Toggle`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Toggle design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Toggle (checkbox row)"
```

---

### Task 7: Modal

**Files:**
- Create: `design-system/src/components/Modal/Modal.tsx`, `Modal.css`, `Modal.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Modal`, `ModalProps` (`{ open: boolean; title?: string; subtitle?: string; onClose?: () => void; actions?: React.ReactNode; children?: React.ReactNode; className?: string }`).

- [ ] **Step 1: Write the failing test — `Modal.test.tsx`**

```tsx
import { render, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

test('shows is-open and title when open', () => {
  const { getByRole } = render(<Modal open title="Regenerate">Body</Modal>);
  const dialog = getByRole('dialog');
  expect(dialog).toHaveClass('pui-modal');
  expect(dialog.parentElement).toHaveClass('pui-modal-bg', 'is-open');
});

test('backdrop click calls onClose; content click does not', () => {
  const calls: number[] = [];
  const { getByRole } = render(
    <Modal open title="T" onClose={() => calls.push(1)}>Body</Modal>,
  );
  const dialog = getByRole('dialog');
  fireEvent.click(dialog); // inner content
  fireEvent.click(dialog.parentElement as HTMLElement); // backdrop
  expect(calls).toEqual([1]);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Modal`
Expected: FAIL (cannot resolve `./Modal`).

- [ ] **Step 3: Create `Modal.tsx`**

```tsx
import type { ReactNode, MouseEvent } from 'react';
import { cn } from '../../lib/cn';

export interface ModalProps {
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Modal({ open, title, subtitle, onClose, actions, children, className }: ModalProps) {
  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose?.();
  };
  return (
    <div className={cn('pui-modal-bg', open && 'is-open')} onClick={onBackdrop}>
      <div className={cn('pui-modal', className)} role="dialog" aria-modal="true">
        {title && <h3 className="pui-modal__title">{title}</h3>}
        {subtitle && <p className="pui-modal__sub">{subtitle}</p>}
        {children}
        {actions && <div className="pui-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `Modal.css`** (ported from `.modal-bg`/`.modal`)

```css
.pui-modal-bg{
  display:none; position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:100;
  align-items:center; justify-content:center; backdrop-filter:blur(3px);
}
.pui-modal-bg.is-open{display:flex}
.pui-modal{
  background:var(--surface); border:1px solid var(--dim); border-radius:6px;
  width:420px; max-width:90vw; padding:20px; box-shadow:0 20px 60px rgba(0,0,0,.6);
  font-family:var(--mono); color:var(--text);
}
.pui-modal__title{font-size:13px; color:var(--accent); margin-bottom:6px; letter-spacing:.5px}
.pui-modal__sub{font-size:10px; color:var(--muted); margin-bottom:14px; line-height:1.5}
.pui-modal__actions{display:flex; gap:8px; margin-top:14px; justify-content:flex-end}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Modal';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/Modal';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/Modal/Modal.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Modal`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Modal design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Modal (dialog with backdrop close)"
```

---

### Task 8: Toast

**Files:**
- Create: `design-system/src/components/Toast/Toast.tsx`, `Toast.css`, `Toast.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Toast`, `ToastProps` (`{ open: boolean; message: string; variant?: 'default' | 'error'; action?: ToastAction; className?: string }`), `ToastAction` (`{ label: string; onClick: () => void }`).

- [ ] **Step 1: Write the failing test — `Toast.test.tsx`**

```tsx
import { render, fireEvent } from '@testing-library/react';
import { Toast } from './Toast';

test('open + error variant adds classes and shows message', () => {
  const { getByText } = render(<Toast open message="Deleted F03" variant="error" />);
  const el = getByText(/Deleted F03/);
  expect(el).toHaveClass('pui-toast', 'pui-toast--error', 'is-open');
});

test('action click fires handler', () => {
  const calls: number[] = [];
  const { getByText } = render(
    <Toast open message="Deleted" action={{ label: 'Undo', onClick: () => calls.push(1) }} />,
  );
  fireEvent.click(getByText('Undo'));
  expect(calls).toEqual([1]);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Toast`
Expected: FAIL (cannot resolve `./Toast`).

- [ ] **Step 3: Create `Toast.tsx`**

```tsx
import { cn } from '../../lib/cn';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  open: boolean;
  message: string;
  variant?: 'default' | 'error';
  action?: ToastAction;
  className?: string;
}

export function Toast({ open, message, variant = 'default', action, className }: ToastProps) {
  return (
    <div
      className={cn('pui-toast', variant === 'error' && 'pui-toast--error', open && 'is-open', className)}
      role="status"
    >
      {message}
      {action && (
        <span className="pui-toast__action" onClick={action.onClick}>
          {action.label}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create `Toast.css`** (ported from `#toast`)

```css
.pui-toast{
  position:fixed; bottom:18px; left:50%; transform:translateX(-50%) translateY(20px);
  background:var(--surface2); border:1px solid var(--dim); border-left:3px solid var(--accent);
  padding:10px 16px; border-radius:4px; font-size:11px; color:var(--text);
  opacity:0; transition:.25s; z-index:200; max-width:80vw; font-family:var(--mono);
}
.pui-toast.is-open{opacity:1; transform:translateX(-50%) translateY(0)}
.pui-toast--error{border-left-color:var(--secondary); color:#ffb4a0}
.pui-toast__action{color:var(--accent); cursor:pointer; text-decoration:underline; margin-left:8px}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Toast';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/Toast';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/Toast/Toast.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Toast`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Toast design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Toast (default/error, optional action)"
```

---

### Task 9: Menu

**Files:**
- Create: `design-system/src/components/Menu/Menu.tsx`, `Menu.css`, `Menu.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Menu`, `MenuProps` (`{ items: MenuItem[]; header?: string; className?: string }`), `MenuItem` (`{ label: string; onClick: () => void; disabled?: boolean; danger?: boolean }`).

- [ ] **Step 1: Write the failing test — `Menu.test.tsx`**

```tsx
import { render, fireEvent } from '@testing-library/react';
import { Menu } from './Menu';

test('renders header and items; danger + disabled applied', () => {
  const { getByText } = render(
    <Menu
      header="PANEL F03"
      items={[
        { label: 'Duplicate', onClick: () => {} },
        { label: 'Delete', onClick: () => {}, danger: true, disabled: true },
      ]}
    />,
  );
  expect(getByText('PANEL F03')).toHaveClass('pui-menu__header');
  const del = getByText('Delete');
  expect(del).toHaveClass('pui-menu__item--danger');
  expect(del).toBeDisabled();
});

test('item click fires handler', () => {
  const calls: string[] = [];
  const { getByText } = render(
    <Menu items={[{ label: 'Edit', onClick: () => calls.push('edit') }]} />,
  );
  fireEvent.click(getByText('Edit'));
  expect(calls).toEqual(['edit']);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Menu`
Expected: FAIL (cannot resolve `./Menu`).

- [ ] **Step 3: Create `Menu.tsx`**

```tsx
import { cn } from '../../lib/cn';

export interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  header?: string;
  className?: string;
}

export function Menu({ items, header, className }: MenuProps) {
  return (
    <div className={cn('pui-menu', className)} role="menu">
      {header && <div className="pui-menu__header">{header}</div>}
      {items.map((it, i) => (
        <button
          key={i}
          className={cn('pui-menu__item', it.danger && 'pui-menu__item--danger')}
          disabled={it.disabled}
          onClick={it.onClick}
          role="menuitem"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `Menu.css`** (ported from `.menu-pop`)

```css
.pui-menu{
  background:var(--surface); border:1px solid var(--dim); border-radius:5px; min-width:200px;
  box-shadow:0 10px 30px rgba(0,0,0,.6); overflow:hidden; font-family:var(--mono);
}
.pui-menu__header{padding:6px 12px; font-size:8.5px; color:var(--muted); letter-spacing:1px; background:#0a0a0a}
.pui-menu__item{
  display:block; width:100%; text-align:left; padding:8px 12px; font-size:10.5px;
  color:var(--text); background:none; border:none; border-bottom:1px solid var(--line);
  cursor:pointer; font-family:var(--mono);
}
.pui-menu__item:last-child{border-bottom:none}
.pui-menu__item:hover{background:var(--surface2); color:var(--accent)}
.pui-menu__item:disabled{opacity:.35; cursor:not-allowed}
.pui-menu__item--danger{color:var(--secondary)}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Menu';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/Menu';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/Menu/Menu.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Menu`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Menu design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Menu (dropdown/context, items with danger/disabled)"
```

---

### Task 10: SegmentedToggle

**Files:**
- Create: `design-system/src/components/SegmentedToggle/SegmentedToggle.tsx`, `SegmentedToggle.css`, `SegmentedToggle.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `SegmentedToggle`, `SegmentedToggleProps` (`{ options: SegmentedOption[]; value: string; onChange: (value: string) => void; className?: string }`), `SegmentedOption` (`{ value: string; label: string }`).

- [ ] **Step 1: Write the failing test — `SegmentedToggle.test.tsx`**

```tsx
import { render, fireEvent } from '@testing-library/react';
import { SegmentedToggle } from './SegmentedToggle';

const opts = [
  { value: '2', label: '2' },
  { value: '3', label: '3' },
];

test('marks the active option', () => {
  const { getByText } = render(<SegmentedToggle options={opts} value="3" onChange={() => {}} />);
  expect(getByText('3')).toHaveClass('is-active');
  expect(getByText('2')).not.toHaveClass('is-active');
});

test('clicking an option calls onChange with its value', () => {
  const calls: string[] = [];
  const { getByText } = render(
    <SegmentedToggle options={opts} value="3" onChange={(v) => calls.push(v)} />,
  );
  fireEvent.click(getByText('2'));
  expect(calls).toEqual(['2']);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/SegmentedToggle`
Expected: FAIL (cannot resolve `./SegmentedToggle`).

- [ ] **Step 3: Create `SegmentedToggle.tsx`**

```tsx
import { cn } from '../../lib/cn';

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedToggleProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedToggle({ options, value, onChange, className }: SegmentedToggleProps) {
  return (
    <div className={cn('pui-segmented', className)} role="group">
      {options.map((o) => (
        <button
          key={o.value}
          className={cn('pui-segmented__btn', value === o.value && 'is-active')}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `SegmentedToggle.css`** (ported from `.col-toggle`/`.dn-toggle`/`.ovl-toggle`)

```css
.pui-segmented{display:inline-flex; border:1px solid var(--line); border-radius:3px; overflow:hidden}
.pui-segmented__btn{
  padding:4px 10px; font-size:9.5px; color:var(--muted); background:none; border:none;
  cursor:pointer; font-family:var(--mono);
}
.pui-segmented__btn.is-active{background:var(--surface2); color:var(--accent)}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './SegmentedToggle';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/SegmentedToggle';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/SegmentedToggle/SegmentedToggle.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/SegmentedToggle`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/SegmentedToggle design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): SegmentedToggle (single-select segmented control)"
```

---

### Task 11: Swatch

**Files:**
- Create: `design-system/src/components/Swatch/Swatch.tsx`, `Swatch.css`, `Swatch.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Swatch`, `SwatchProps` (extends `HTMLAttributes<HTMLDivElement>`, adds `color: string`, `label?: string`).

- [ ] **Step 1: Write the failing test — `Swatch.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { Swatch } from './Swatch';

test('applies color as background and renders label', () => {
  const { getByText } = render(<Swatch color="#FFC72C" label="ACC" />);
  const label = getByText('ACC');
  expect(label).toHaveClass('pui-swatch__label');
  const root = label.parentElement as HTMLElement;
  expect(root).toHaveClass('pui-swatch');
  expect(root.style.background).not.toBe('');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Swatch`
Expected: FAIL (cannot resolve `./Swatch`).

- [ ] **Step 3: Create `Swatch.tsx`**

```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface SwatchProps extends HTMLAttributes<HTMLDivElement> {
  color: string;
  label?: string;
}

export function Swatch({ color, label, className, style, ...rest }: SwatchProps) {
  return (
    <div className={cn('pui-swatch', className)} style={{ background: color, ...style }} {...rest}>
      {label && <span className="pui-swatch__label">{label}</span>}
    </div>
  );
}
```

- [ ] **Step 4: Create `Swatch.css`** (ported from `.sw`)

```css
.pui-swatch{height:34px; border-radius:3px; position:relative; border:1px solid rgba(255,255,255,.06)}
.pui-swatch__label{
  position:absolute; bottom:1px; left:0; right:0; text-align:center; font-size:7px;
  color:rgba(255,255,255,.85); text-shadow:0 1px 2px #000; letter-spacing:.3px; font-family:var(--mono);
}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Swatch';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/Swatch';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/Swatch/Swatch.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Swatch`
Expected: PASS (1 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Swatch design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Swatch (color swatch with label)"
```

---

### Task 12: Badge

**Files:**
- Create: `design-system/src/components/Badge/Badge.tsx`, `Badge.css`, `Badge.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `Badge`, `BadgeProps` (extends `HTMLAttributes<HTMLSpanElement>`, adds `variant?: BadgeVariant`), `BadgeVariant` (`'accent' | 'solid' | 'warn' | 'note' | 'ok'`).

- [ ] **Step 1: Write the failing test — `Badge.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { Badge } from './Badge';

test('defaults to accent variant', () => {
  const { getByText } = render(<Badge>F03</Badge>);
  expect(getByText('F03')).toHaveClass('pui-badge', 'pui-badge--accent');
});

test('honors variant prop', () => {
  const { getByText } = render(<Badge variant="warn">180°</Badge>);
  expect(getByText('180°')).toHaveClass('pui-badge--warn');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/Badge`
Expected: FAIL (cannot resolve `./Badge`).

- [ ] **Step 3: Create `Badge.tsx`**

```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant = 'accent' | 'solid' | 'warn' | 'note' | 'ok';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'accent', className, ...rest }: BadgeProps) {
  return <span className={cn('pui-badge', `pui-badge--${variant}`, className)} {...rest} />;
}
```

- [ ] **Step 4: Create `Badge.css`** (ported from `.pc-badge`, `.pc-special`, `.sev.warn/.note/.ok`)

```css
.pui-badge{
  display:inline-block; font-size:8.5px; font-weight:700; padding:2px 5px; border-radius:2px;
  letter-spacing:.5px; font-family:var(--mono);
}
.pui-badge--accent{background:rgba(0,0,0,.6); color:var(--accent)}
.pui-badge--solid{background:var(--secondary); color:#000; text-transform:uppercase; font-size:7.5px}
.pui-badge--warn{background:rgba(250,70,22,.18); color:var(--secondary)}
.pui-badge--note{background:rgba(255,199,44,.16); color:var(--accent)}
.pui-badge--ok{background:rgba(120,200,120,.15); color:#7ac87a}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './Badge';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/Badge';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/Badge/Badge.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/Badge`
Expected: PASS (2 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/Badge design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): Badge (accent/solid/warn/note/ok)"
```

---

### Task 13: EmptyState

**Files:**
- Create: `design-system/src/components/EmptyState/EmptyState.tsx`, `EmptyState.css`, `EmptyState.test.tsx`, `index.ts`
- Modify: `design-system/src/index.ts`, `design-system/src/styles.css`

**Interfaces:**
- Consumes: `cn`.
- Produces: `EmptyState`, `EmptyStateProps` (`{ icon?: React.ReactNode; title: string; description?: string; className?: string }`).

- [ ] **Step 1: Write the failing test — `EmptyState.test.tsx`**

```tsx
import { render } from '@testing-library/react';
import { EmptyState } from './EmptyState';

test('renders title, optional icon and description', () => {
  const { getByText, container } = render(
    <EmptyState icon="✦" title="No storyboard yet" description="Press Generate." />,
  );
  expect(container.firstChild).toHaveClass('pui-empty');
  expect(getByText('No storyboard yet')).toHaveClass('pui-empty__title');
  expect(getByText('✦')).toHaveClass('pui-empty__icon');
  expect(getByText('Press Generate.')).toHaveClass('pui-empty__desc');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd design-system && npx vitest run src/components/EmptyState`
Expected: FAIL (cannot resolve `./EmptyState`).

- [ ] **Step 3: Create `EmptyState.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn('pui-empty', className)}>
      {icon && <div className="pui-empty__icon">{icon}</div>}
      <h2 className="pui-empty__title">{title}</h2>
      {description && <p className="pui-empty__desc">{description}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Create `EmptyState.css`** (ported from `.empty-state`)

```css
.pui-empty{text-align:center; padding:80px 20px; color:var(--dim); font-family:var(--mono)}
.pui-empty__icon{font-size:40px; margin-bottom:14px; opacity:.5}
.pui-empty__title{font-size:15px; color:var(--muted); margin-bottom:8px; font-weight:500}
.pui-empty__desc{font-size:11px; color:var(--dim); line-height:1.6; max-width:340px; margin:0 auto}
```

- [ ] **Step 5: Create `index.ts`**

```ts
export * from './EmptyState';
```

- [ ] **Step 6: Wire into `src/index.ts`**

```ts
export * from './components/EmptyState';
```

- [ ] **Step 7: Append to `src/styles.css`**

```css
@import './components/EmptyState/EmptyState.css';
```

- [ ] **Step 8: Run to verify tests pass**

Run: `cd design-system && npx vitest run src/components/EmptyState`
Expected: PASS (1 passing).

- [ ] **Step 9: Commit**

```bash
git add design-system/src/components/EmptyState design-system/src/index.ts design-system/src/styles.css
git commit -m "feat(ds): EmptyState"
```

---

### Task 14: Demo gallery + full verification gate

**Files:**
- Create: `design-system/index.html`, `design-system/demo/main.tsx`
- Test: full suite + typecheck + build

**Interfaces:**
- Consumes: every component's public export from `../src`.

- [ ] **Step 1: Create `design-system/index.html`** (Vite dev entry)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Phantom UI — Gallery</title>
    <style>
      body { margin: 0; background: #0D0D0D; }
      .gallery { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 720px; }
      .gallery section { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
      .gallery h4 { color: #9a9a9a; font: 700 9.5px 'JetBrains Mono', monospace; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px; width: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/demo/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `design-system/demo/main.tsx`**

```tsx
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button, Chip, Input, Textarea, Select, Toggle, Modal, Toast,
  Menu, SegmentedToggle, Swatch, Badge, EmptyState,
} from '../src';
import '../src/styles.css';

function Gallery() {
  const [chip, setChip] = useState('8');
  const [cols, setCols] = useState('3');
  const [toggle, setToggle] = useState(true);
  const [modal, setModal] = useState(false);

  return (
    <div className="gallery">
      <section>
        <h4>Buttons</h4>
        <Button variant="primary">Generate</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="icon">▶ Play</Button>
        <Button variant="tab" active>Shot List</Button>
        <Button variant="tab">Color Bible</Button>
      </section>

      <section>
        <h4>Chips</h4>
        {['4', '6', '8', '12'].map((v) => (
          <Chip key={v} selected={chip === v} onClick={() => setChip(v)}>{v}</Chip>
        ))}
      </section>

      <section>
        <h4>Fields</h4>
        <Input label="Scene Title" defaultValue="คนละเวลา ห้องเดียว" />
        <Select label="Style" options={[{ value: 'realistic', label: 'Realistic' }, { value: 'rough', label: 'Rough Sketch' }]} />
        <Textarea label="Action" defaultValue="She reaches for the cup." />
      </section>

      <section>
        <h4>Toggle / Segmented</h4>
        <Toggle checked={toggle} onChange={setToggle} label="Render AI frame art" />
        <SegmentedToggle
          options={[{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]}
          value={cols}
          onChange={setCols}
        />
      </section>

      <section>
        <h4>Badges</h4>
        <Badge variant="accent">F03</Badge>
        <Badge variant="solid">SPLIT SCREEN</Badge>
        <Badge variant="warn">180° line</Badge>
        <Badge variant="note">note</Badge>
        <Badge variant="ok">clean</Badge>
      </section>

      <section>
        <h4>Swatches</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 60px)', gap: 6 }}>
          <Swatch color="#f0e4d0" label="HIGH" />
          <Swatch color="#c8a870" label="MID" />
          <Swatch color="#2a2436" label="SHAD" />
          <Swatch color="#FA4616" label="ACC" />
        </div>
      </section>

      <section>
        <h4>Menu</h4>
        <Menu
          header="PANEL F03"
          items={[
            { label: '✎ Edit details', onClick: () => {} },
            { label: '⧉ Duplicate', onClick: () => {} },
            { label: '✕ Delete', onClick: () => {}, danger: true },
          ]}
        />
      </section>

      <section>
        <h4>Modal / Toast</h4>
        <Button variant="ghost" onClick={() => setModal(true)}>Open modal</Button>
        <Modal
          open={modal}
          title="↻ Regenerate Panel"
          subtitle="Add a direction note."
          onClose={() => setModal(false)}
          actions={<>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModal(false)}>Regenerate</Button>
          </>}
        >
          <Textarea label="Note" placeholder="Push in tighter…" />
        </Modal>
        <Toast open message="Panel F03 updated" />
      </section>

      <section style={{ display: 'block' }}>
        <h4>Empty state</h4>
        <EmptyState icon="✦" title="No storyboard yet" description="Write a scene and press Generate." />
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
```

- [ ] **Step 3: Verify the dev gallery renders (manual eyeball)**

Run: `cd design-system && npm run dev`
Open the printed URL. Confirm every component renders in the dark theme with JetBrains Mono, the selected chip/segment highlights in gold, and the modal opens/closes. Stop the dev server when done.

- [ ] **Step 4: Full verification gate**

Run: `cd design-system && npm run typecheck && npm test && npm run build`
Expected: typecheck clean; all component tests pass (~23 assertions across 12 suites); build emits `dist/phantom-ui.js`, `dist/phantom-ui.umd.cjs`, `dist/phantom-ui.css`, `dist/index.d.ts`.

- [ ] **Step 5: Verify the bundle exposes the global and the CSS closure**

Run:
```bash
cd design-system
grep -c "PhantomUI" dist/phantom-ui.umd.cjs
grep -c "pui-btn--primary" dist/phantom-ui.css
grep -c "pui-empty__title" dist/phantom-ui.css
```
Expected: each prints a non-zero count (UMD global present; first and last component CSS both in the bundled stylesheet, proving the `@import` closure is complete).

- [ ] **Step 6: Commit**

```bash
git add design-system/index.html design-system/demo/main.tsx
git commit -m "feat(ds): demo gallery + full build/test verification"
```

---

## Notes for the follow-on design-sync run (not part of this plan)

Once this library builds and the gallery looks right, the claude.ai/design sync is a separate task: run the `design-sync` skill from `design-system/` (it detects `shape: "package"`), which writes `design-system/.design-sync/config.json` (globalName `PhantomUI`, `componentSrcMap` → each `src/components/<Name>/<Name>.tsx`, styles entry `src/styles.css`, `readmeHeader → .design-sync/conventions.md`) and uploads the converted bundle.
