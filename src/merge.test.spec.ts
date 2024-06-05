import { merge } from './merge';

describe('merge function tests', () => {
  test('should merge three collections correctly', () => {
    const collection1 = [7, 5, 3];
    const collection2 = [1, 2, 4];
    const collection3 = [6, 8, 9];

    const result = merge(collection1, collection2, collection3);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
