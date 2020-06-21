export declare interface ICategory {
  value: string;
  color?: string;
  label?: string;
}

export interface ICategoryBin extends Required<ICategory> {
  count: number;
  /**
   * accumulated count
   */
  acc: number;
  percentage: number;
}

function colorGen(dark?: boolean) {
  // from ColorBrewer
  const schemeDark2 = ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d'];
  const schemeSet2 = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494'];

  const set = dark ? schemeDark2.concat(schemeSet2) : schemeSet2.concat(schemeDark2);
  let acc = 0;
  return () => {
    return set[acc++ % set.length];
  };
}

function bin(hist: ICategoryBin[], values: readonly string[]) {
  const map = new Map(hist.map((bin) => [bin.value, 0]));
  values.forEach((value) => {
    if (value == null) {
      return;
    }
    const key = value.toString();
    if (!map.has(key)) {
      return;
    }
    map.set(key, map.get(key)! + 1);
  });
  return map;
}

export function categoricalHistogram(
  values: readonly string[],
  categories: readonly (string | ICategory)[],
  base?: readonly string[],
  dark: boolean = false
): readonly ICategoryBin[] {
  const nextColor = colorGen(dark);
  const generateCat = (value: string) => {
    return {
      value,
      label: value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value,
      color: nextColor(),
    };
  };
  const hist: ICategoryBin[] = categories.map((cat) => {
    return Object.assign(
      { count: 0, acc: 0, percentage: 0 },
      generateCat(typeof cat === 'string' ? cat : cat.value),
      typeof cat === 'string' ? {} : cat
    );
  });
  const map = bin(hist, values);
  const baseMap = base ? bin(hist, base) : null;
  const total = Array.from(map.values()).reduce((acc, v) => acc + v, 0);

  let acc = 0;
  hist.forEach((bin) => {
    bin.acc = acc;
    bin.count = map.get(bin.value)!;
    bin.percentage = bin.count / total;
    acc += baseMap ? baseMap.get(bin.value)! : bin.count;
  });
  return hist;
}
