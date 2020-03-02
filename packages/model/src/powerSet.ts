export default function* powerSet<T>(
  arr: ReadonlyArray<T>,
  { min = 0, max = Infinity } = {}
): IterableIterator<ReadonlyArray<T>> {
  const total = 2 ** arr.length;

  // just works till Number.MAX_SAFE_INTEGER

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
