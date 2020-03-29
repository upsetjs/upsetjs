function getComparator(orderBy: 'name' | 'cardinality', order: 'asc' | 'desc') {
  const factor = order === 'asc' ? 1 : -1;
  if (orderBy === 'name') {
    return (a: { name: string }, b: { name: string }) => {
      return factor * a.name.localeCompare(b.name);
    };
  }
  return (a: { cardinality: number }, b: { cardinality: number }) => factor * (a.cardinality - b.cardinality);
}

export function stableSort<T extends { name: string; cardinality: number }>(
  arr: ReadonlyArray<T>,
  orderBy: 'name' | 'cardinality',
  order: 'asc' | 'desc'
) {
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
