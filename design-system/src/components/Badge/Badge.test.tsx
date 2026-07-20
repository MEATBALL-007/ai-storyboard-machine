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
