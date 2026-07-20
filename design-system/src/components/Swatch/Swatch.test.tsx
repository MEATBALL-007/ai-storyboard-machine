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
