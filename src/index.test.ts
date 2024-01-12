import { readFileSync } from 'fs';
import { describe, expect, test } from '@jest/globals';
import { run, Input, Result } from './run';

function exampleTest(name: string) {
  const loadJson = (p: string) => JSON.parse(readFileSync(`${__dirname}/../examples/${name}/${p}`, 'utf8'));

  test(`handles walk through example "${name}"`, () => {
    const input = loadJson('input.json');
    const expected = loadJson('expected.json');
    const result = run(input);

    expect(result).toEqual(expected);
  });
}

describe('Candidate robot', () => {
  // Handles a correct walk through example
  exampleTest('01-walk-through');

  // Handles a case with an invalid direction
  exampleTest('02-error');

  // Handles a case with a crash (robot goes out of bounds)
  exampleTest('03-crash');

  test('handles empty directions', () => {
    const input: Input = {
      arena: { corner1: { x: 0, y: 0 }, corner2: { x: 10, y: 10 } },
      location: { x: 0, y: 0 },
      heading: 'north',
      directions: [],
    };

    const expected: Result = {
      location: { x: 0, y: 0 },
      heading: 'north',
      status: 'ok',
      path: [],
    };

    const result = run(input);

    expect(result).toEqual(expected);
  });
});
