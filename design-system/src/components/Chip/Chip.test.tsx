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
