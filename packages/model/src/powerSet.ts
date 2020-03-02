export declare type PowerSetOptions = {
  min: number;
  max: number;
};

export function powerSetNumber<T>(
  arr: ReadonlyArray<T>,
  onSet: (set: ReadonlyArray<T>) => void,
  { min = 0, max = Infinity } = {}
) {
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
      onSet(sub);
    }
  }
}

export function powerSetBigInt<T>(
  arr: ReadonlyArray<T>,
  onSet: (set: ReadonlyArray<T>) => void,
  { min = 0, max = Infinity } = {}
) {
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
      onSet(sub);
    }
  }
}

export function powerSetRecursive<T>(
  arr: ReadonlyArray<T>,
  onSet: (set: ReadonlyArray<T>) => void,
  { min = 0, max = Infinity } = {}
) {
  const check = (len: number) => len >= min && len <= max;
  function iter(subset: T[], start: number) {
    if (subset.length >= max) {
      return;
    }
    for (let i = start; i < arr.length; i++) {
      subset.push(arr[i]);
      if (check(subset.length)) {
        onSet(subset.slice());
      }
      iter(subset, i + 1);
      subset.pop();
    }
  }

  if (check(0)) {
    onSet([]);
  }

  iter([], 0);
}

export default function powerSet<T>(
  arr: ReadonlyArray<T>,
  options: Partial<PowerSetOptions> = {}
): { forEach(cb: (set: ReadonlyArray<T>) => void): void } {
  const total = Math.pow(2, arr.length);

  const asForEach = (f: typeof powerSetNumber) => {
    return {
      forEach: (cb: (set: ReadonlyArray<T>) => void) => f(arr, cb, options),
    };
  };

  if (total < Number.MAX_SAFE_INTEGER) {
    return asForEach(powerSetNumber);
  }
  if (typeof window.BigInt !== 'undefined') {
    return asForEach(powerSetBigInt);
  }

  return asForEach(powerSetRecursive);
}
