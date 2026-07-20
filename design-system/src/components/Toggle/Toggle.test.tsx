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

test('forwards native props to the label root', () => {
  const { getByTestId } = render(
    <Toggle checked label="AI art" onChange={() => {}} data-testid="x" />,
  );
  expect(getByTestId('x')).toHaveClass('pui-toggle');
});
