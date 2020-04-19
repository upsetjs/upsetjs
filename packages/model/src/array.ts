export function compressIndicesArray(arr: ReadonlyArray<number>): string {
  if (arr.length === 0) {
    return '';
  }

  const encoded: string[] = [];

  let startIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    const expected = arr[i - 1] + 1;
    const v = arr[i];
    if (v !== expected) {
      // slice break
      if (i === startIndex + 1) {
        encoded.push(arr[startIndex].toString());
      } else {
        encoded.push(`${arr[startIndex]}+${i - startIndex - 1}`);
      }
      startIndex = i;
    }
  }
  if (startIndex === arr.length - 1) {
    encoded.push(arr[startIndex].toString());
  } else {
    encoded.push(`${arr[startIndex]}+${arr.length - startIndex - 1}`);
  }
  return encoded.join(',');
}

export function toIndicesArray<T>(
  arr: ReadonlyArray<T>,
  toIndex: (v: T) => number,
  sortAble = false
): string | ReadonlyArray<number> {
  if (arr.length === 0) {
    return [];
  }
  const base = arr.map((v) => toIndex(v));

  if (sortAble) {
    base.sort((a, b) => a - b);
  }
  const encoded = compressIndicesArray(base);
  if (encoded.length + 2 < JSON.stringify(base).length * 0.6) {
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
