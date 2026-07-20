import { render } from '@testing-library/react';
import { EmptyState } from './EmptyState';

test('renders title, optional icon and description', () => {
  const { getByText, container } = render(
    <EmptyState icon="✦" title="No storyboard yet" description="Press Generate." />,
  );
  expect(container.firstChild).toHaveClass('pui-empty');
  expect(getByText('No storyboard yet')).toHaveClass('pui-empty__title');
  expect(getByText('✦')).toHaveClass('pui-empty__icon');
  expect(getByText('Press Generate.')).toHaveClass('pui-empty__desc');
});
