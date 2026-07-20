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

test('forwards native props to the root', () => {
  const { getByTestId } = render(<Toast open message="Deleted" data-testid="x" />);
  expect(getByTestId('x')).toHaveClass('pui-toast');
});
