import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { Badge, BADGE_VARIANTS } from './Badge';

test('defaults to accent variant', () => {
  const { getByText } = render(<Badge>F03</Badge>);
  expect(getByText('F03')).toHaveClass('pui-badge', 'pui-badge--accent');
});

test('honors variant prop', () => {
  const { getByText } = render(<Badge variant="warn">180°</Badge>);
  expect(getByText('180°')).toHaveClass('pui-badge--warn');
});

test('neutral variant carries the accent shape with body text colour', () => {
  const { getByText } = render(<Badge variant="neutral">4.5s</Badge>);
  expect(getByText('4.5s')).toHaveClass('pui-badge', 'pui-badge--neutral');
});

test('accent-solid variant renders its modifier class', () => {
  const { getByText } = render(<Badge variant="accent-solid">EDITED</Badge>);
  expect(getByText('EDITED')).toHaveClass('pui-badge', 'pui-badge--accent-solid');
});

// The stylesheet is not loaded in jsdom (only src/index.ts imports styles.css), so a
// variant can render its class while having no rule behind it. Read the CSS instead and
// assert both directions: every variant is styled, and every rule belongs to a variant.
describe('variant / stylesheet parity', () => {
  // cwd is the design-system package root under `vitest run`.
  const css = readFileSync(resolve(process.cwd(), 'src/components/Badge/Badge.css'), 'utf8');
  const declared = new Set(
    [...css.matchAll(/\.pui-badge--([a-z-]+)\s*\{/g)].map((m) => m[1]),
  );

  test.each(BADGE_VARIANTS)('%s has a rule in Badge.css', (variant) => {
    expect(declared).toContain(variant);
  });

  test('Badge.css declares no rule without a matching variant', () => {
    expect([...declared].sort()).toEqual([...BADGE_VARIANTS].sort());
  });
});
