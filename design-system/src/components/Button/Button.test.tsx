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
