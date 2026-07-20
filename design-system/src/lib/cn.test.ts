import { cn } from './cn';

test('joins truthy parts with a space, dropping falsy', () => {
  expect(cn('a', false, 'b', null, undefined, 'c')).toBe('a b c');
});

test('returns empty string when all falsy', () => {
  expect(cn(false, null, undefined)).toBe('');
});
