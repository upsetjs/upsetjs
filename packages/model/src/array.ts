export function compressIndicesArray(arr: ReadonlyArray<number>): string {
  if (arr.length === 0) {
    return '';
  }

  const encoded: string[] = [];

  let startIndex = 0;

  const push = (i: number) => {
    if (i === startIndex + 1) {
      encoded.push(arr[startIndex].toString());
    } else if (i === startIndex + 2 && i < 10) {
      // don't save anything (1+1, vs 1,2)
      encoded.push(`${arr[startIndex]},${arr[startIndex + 1]}`);
    } else {
      encoded.push(`${arr[startIndex]}+${i - startIndex - 1}`);
    }
    return i;
  };
  for (let i = 1; i < arr.length; i++) {
    const expected = arr[i - 1] + 1;
    const v = arr[i];
    if (v !== expected) {
      // slice break
      startIndex = push(i);
      startIndex = i;
    }
  }
  push(arr.length);
  return encoded.join(',');
}

export function toIndicesArray<T>(
  arr: ReadonlyArray<T>,
  toIndex: (v: T) => number,
  options: { sortAble?: boolean; maxCompress?: boolean } = {}
): string | ReadonlyArray<number> {
  if (arr.length === 0) {
    return [];
  }
  const base = arr.map((v) => toIndex(v));

  if (options.sortAble) {
    base.sort((a, b) => a - b);
  }
  const encoded = compressIndicesArray(base);
  const baseLength = JSON.stringify(base).length;
  const encodedLength = encoded.length + 2; // for ""

  if (
    encodedLength < baseLength * 0.6 ||
    baseLength - encodedLength > 50 ||
    (options.maxCompress && encodedLength < baseLength)
  ) {
    // save 40% or more than 50 characters
    return encoded;
  }
  return base;
}

export function fromIndicesArray<T>(
  indices: string | ReadonlyArray<number>,
  elements: ReadonlyArray<T>
): ReadonlyArray<T> {
  if (typeof indices === 'string') {
    if (indices.length === 0) {
      return [];
    }
    return indices
      .split(',')
      .map((s) => {
        if (s.includes('+')) {
          const [start, length] = s.split('+').map((si) => Number.parseInt(si, 10));
          return elements.slice(start, start + length + 1);
        }
        return elements[Number.parseInt(s, 10)];
      })
      .flat();
  }
  return indices.map((i) => elements[i]);
}
