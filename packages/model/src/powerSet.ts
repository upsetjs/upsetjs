export declare type PowerSetOptions = {
  min: number;
  max: number;
};

export function* powerSetNumber<T>(
  arr: ReadonlyArray<T>,
  { min = 0, max = Infinity } = {}
): IterableIterator<ReadonlyArray<T>> {
  const total = 2 ** arr.length;
  let lastBit = 0;
  let lastBitAcc = 1;
  for (let i = 0; i < total; i++) {
    if (i >= lastBitAcc) {
      // just maximal goes up to this bit
      // 0 ... 0 bit
      // 1 ... 1 bit
      // 2 ... 2 bits
      // 4 ... 3 bits
      lastBit++;
      lastBitAcc = lastBitAcc << 1;
    }
    const sub = [];
    for (let j = 0; j < lastBit; j++) {
      if (i & (1 << j)) {
        // jth bit set in i
        sub.push(arr[j]);
      }
    }
    if (sub.length >= min && sub.length <= max) {
      yield sub;
    }
  }
}

export function* powerSetBigInt<T>(
  arr: ReadonlyArray<T>,
  { min = 0, max = Infinity } = {}
): IterableIterator<ReadonlyArray<T>> {
  const zero = BigInt(0);
  const one = BigInt(1);
  const two = BigInt(2);
  const total = two << BigInt(arr.length);
  let lastBit = 0;
  let lastBitAcc = one;
  const bits = arr.map((_, i) => one << BigInt(i));
  for (let i = zero; i < total; i += one) {
    if (i >= lastBitAcc) {
      // just maximal goes up to this bit
      // 0 ... 0 bit
      // 1 ... 1 bit
      // 2 ... 2 bits
      // 4 ... 3 bits
      lastBit++;
      lastBitAcc = lastBitAcc << one;
    }
    const sub = [];
    for (let j = 0; j < lastBit; j++) {
      if ((i & bits[j]) != zero) {
        // jth bit set in i
        sub.push(arr[j]);
      }
    }
    if (sub.length >= min && sub.length <= max) {
      yield sub;
    }
  }
}

export function* powerSetRecursive<T>(
  arr: ReadonlyArray<T>,
  { min = 0, max = Infinity } = {}
): IterableIterator<ReadonlyArray<T>> {
  const check = (len: number) => len >= min && len <= max;
  function* iter(subset: T[], start: number): IterableIterator<ReadonlyArray<T>> {
    if (subset.length >= max) {
      return;
    }
    for (let i = start; i < arr.length; i++) {
      subset.push(arr[i]);
      if (check(subset.length)) {
        yield subset.slice();
      }
      const gen = iter(subset, i + 1);
      let n = gen.next();
      while (!n.done) {
        yield n.value;
        n = gen.next();
      }
      subset.pop();
    }
  }

  if (check(0)) {
    yield [];
  }

  const gen = iter([], 0);
  let n = gen.next();
  while (!n.done) {
    yield n.value;
    n = gen.next();
  }
}

export default function powerSet<T>(
  arr: ReadonlyArray<T>,
  options: Partial<PowerSetOptions> = {}
): IterableIterator<ReadonlyArray<T>> {
  const total = Math.pow(2, arr.length);

  if (total < Number.MAX_SAFE_INTEGER) {
    return powerSetNumber(arr, options);
  }
  if (typeof window.BigInt !== 'undefined') {
    return powerSetBigInt(arr, options);
  }

  return powerSetRecursive(arr, options);
}
