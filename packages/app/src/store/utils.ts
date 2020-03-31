function getComparator<T>(orderBy: keyof T, order: 'asc' | 'desc') {
  const factor = order === 'asc' ? 1 : -1;
  return (a: T, b: T) => {
    const va = a[orderBy];
    const vb = b[orderBy];
    if (va === vb) {
      return 0;
    }
    if (va < vb) {
      return -factor;
    }
    return factor;
  };
}

export function stableSort<T>(arr: ReadonlyArray<T>, orderBy: keyof T, order: 'asc' | 'desc') {
  const comp = getComparator(orderBy, order);
  const data = arr.map((v, i) => ({ v, i }));
  data.sort((a, b) => {
    const r = comp(a.v, b.v);
    if (r !== 0) {
      return r;
    }
    return a.i - b.i;
  });
  return data.map((d) => d.v);
}
