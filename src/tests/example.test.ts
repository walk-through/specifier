import { expect, test } from 'vitest';

// Normally this would be in some other file, but just to show the simplest example...
function sum(a: number, b: number): number {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
