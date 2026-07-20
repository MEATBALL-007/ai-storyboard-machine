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

test('forwards native props to the dialog root', () => {
  const { getByTestId } = render(
    <Modal open title="T" data-testid="x">Body</Modal>,
  );
  expect(getByTestId('x')).toHaveClass('pui-modal');
});

test('sets aria-labelledby to the title id', () => {
  const { getByRole, getByText } = render(<Modal open title="Regenerate">Body</Modal>);
  const dialog = getByRole('dialog');
  const heading = getByText('Regenerate');
  expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
});

test('Escape key calls onClose', () => {
  const calls: number[] = [];
  render(<Modal open title="T" onClose={() => calls.push(1)}>Body</Modal>);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(calls).toEqual([1]);
});
