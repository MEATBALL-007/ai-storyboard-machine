import { render } from '@testing-library/react';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';

test('Input renders label and input with base class', () => {
  const { getByText, container } = render(<Input label="Name" />);
  expect(getByText('Name')).toHaveClass('pui-field__label');
  expect(container.querySelector('input')).toHaveClass('pui-input');
});

test('Textarea renders base class', () => {
  const { container } = render(<Textarea label="Body" />);
  expect(container.querySelector('textarea')).toHaveClass('pui-textarea');
});

test('Select renders options from prop', () => {
  const { container, getByText } = render(
    <Select label="Aspect" options={[{ value: '16:9', label: '16:9' }]} />,
  );
  expect(container.querySelector('select')).toHaveClass('pui-select');
  expect(getByText('16:9')).toBeInTheDocument();
});
