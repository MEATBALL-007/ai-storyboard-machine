import { render, fireEvent } from '@testing-library/react';
import { Menu } from './Menu';

test('renders header and items; danger + disabled applied', () => {
  const { getByText } = render(
    <Menu
      header="PANEL F03"
      items={[
        { label: 'Duplicate', onClick: () => {} },
        { label: 'Delete', onClick: () => {}, danger: true, disabled: true },
      ]}
    />,
  );
  expect(getByText('PANEL F03')).toHaveClass('pui-menu__header');
  const del = getByText('Delete');
  expect(del).toHaveClass('pui-menu__item--danger');
  expect(del).toBeDisabled();
});

test('item click fires handler', () => {
  const calls: string[] = [];
  const { getByText } = render(
    <Menu items={[{ label: 'Edit', onClick: () => calls.push('edit') }]} />,
  );
  fireEvent.click(getByText('Edit'));
  expect(calls).toEqual(['edit']);
});
