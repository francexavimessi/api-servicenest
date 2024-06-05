export function merge(
  collection_1: number[],
  collection_2: number[],
  collection_3: number[],
): number[] {
  const reversedCollection1 = collection_1.slice().reverse();
  let index1 = 0,
    index2 = 0,
    index3 = 0;
  const result: number[] = [];

  while (
    index1 < reversedCollection1.length ||
    index2 < collection_2.length ||
    index3 < collection_3.length
  ) {
    const val1 =
      index1 < reversedCollection1.length
        ? reversedCollection1[index1]
        : Infinity;
    const val2 = index2 < collection_2.length ? collection_2[index2] : Infinity;
    const val3 = index3 < collection_3.length ? collection_3[index3] : Infinity;

    if (val1 <= val2 && val1 <= val3) {
      result.push(val1);
      index1++;
    } else if (val2 <= val1 && val2 <= val3) {
      result.push(val2);
      index2++;
    } else {
      result.push(val3);
      index3++;
    }
  }

  return result;
}
