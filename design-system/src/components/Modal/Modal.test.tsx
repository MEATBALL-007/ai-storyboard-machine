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
