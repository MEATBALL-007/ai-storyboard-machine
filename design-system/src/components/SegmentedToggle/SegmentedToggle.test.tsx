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
