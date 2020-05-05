/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { UpSetAddon, ISetLike } from '@upsetjs/react';
import { normalize, denormalize } from '@upsetjs/math';

export interface ICategoricalHistogramStyleProps {
  theme?: 'light' | 'dark';
  /**
   * orientation of the box plot
   * @default horizontal
   */
  orient?: 'horizontal' | 'vertical';
}

export declare interface ICategory {
  value: string;
  color?: string;
  label?: string;
}

declare type CategoricalHistogramProps = {
  /**
   * the values to render
   */
  values: ReadonlyArray<string>;
  /**
   * width of the box plot
   */
  width: number;
  /**
   * height of the box plot
   */
  height: number;
  /**
   * domain minimum value
   */
  categories: ReadonlyArray<string | ICategory>;

  children?: React.ReactNode;
} & ICategoricalHistogramStyleProps;

interface IBin extends Required<ICategory> {
  count: number;
  acc: number;
}

function colorGen(theme: 'light' | 'dark') {
  // from ColorBrewer
  const schemeDark2 = ['#1b9e77d', '#95f027', '#570b3e', '#7298a6', '#6a61ee', '#6ab02a', '#6761d6'];
  const schemeSet2 = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494'];

  const set = theme === 'light' ? schemeSet2.concat(schemeDark2) : schemeDark2.concat(schemeSet2);
  let acc = 0;
  return () => {
    return set[acc++ % set.length];
  };
}

function generateHist(
  values: ReadonlyArray<string>,
  categories: ReadonlyArray<string | ICategory>,
  theme: 'light' | 'dark'
) {
  const nextColor = colorGen(theme);
  const generateCat = (value: string) => {
    return {
      value,
      label: value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value,
      color: nextColor(),
    };
  };
  const hist: IBin[] = categories.map((cat) => {
    return Object.assign(
      { count: 0, acc: 0 },
      generateCat(typeof cat === 'string' ? cat : cat.value),
      typeof cat === 'string' ? {} : cat
    );
  });
  const map = new Map(hist.map((bin) => [bin.value, bin]));
  values.forEach((value) => {
    if (value == null) {
      return;
    }
    const key = value.toString();
    if (!map.has(key)) {
      return;
    }
    map.get(key)!.count++;
  });
  let acc = 0;
  hist.forEach((bin) => {
    bin.acc = acc;
    acc += bin.count;
  });
  return hist;
}

export const CategoricalHistogram = ({
  theme = 'light',
  values,
  orient = 'horizontal',
  width: w,
  height: h,
  categories,
}: CategoricalHistogramProps) => {
  const hist = generateHist(values, categories, theme);
  const hor = orient === 'horizontal';
  const n = normalize([0, values.length]);
  const dn = denormalize([0, hor ? w : h]);
  const scale = (v: number) => dn(n(v));

  if (hor) {
    return (
      <g>
        {hist.map((bin) => (
          <rect
            key={bin.value}
            x={scale(bin.acc)}
            width={scale(bin.count)}
            y={0}
            height={h}
            style={{ fill: bin.color }}
          >
            <title>{`${bin.label}: ${bin.count}`}</title>
          </rect>
        ))}
      </g>
    );
  }

  return (
    <g>
      {hist.map((bin) => (
        <rect key={bin.value} y={scale(bin.acc)} height={scale(bin.count)} x={0} width={h} style={{ fill: bin.color }}>
          <title>{`${bin.label}: ${bin.count}`}</title>
        </rect>
      ))}
    </g>
  );
};

const CategoricalHistogramMemo = React.memo(CategoricalHistogram);

export default CategoricalHistogram;

/**
 * generates a categorical histogram addon to render histograms as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their categories
 * @param options additional options
 */
export function categoricalHistogramAddon<T>(
  prop: keyof T | ((v: T) => string),
  elems: ReadonlyArray<T> | { categories: ReadonlyArray<string | ICategory> },
  {
    size = 100,
    position,
    name = prop.toString(),
    ...extras
  }: Partial<Pick<UpSetAddon<ISetLike<T>, T>, 'size' | 'position' | 'name'>> & ICategoricalHistogramStyleProps = {}
): UpSetAddon<ISetLike<T>, T> {
  const acc = typeof prop === 'function' ? prop : (v: T) => (v[prop as keyof T] as unknown) as string;
  let categories: ReadonlyArray<string | ICategory> = [];
  if (Array.isArray(elems)) {
    const cats = new Set<string>();
    elems.forEach((elem) => {
      const v = acc(elem);
      if (v == null) {
        return;
      }
      cats.add(v.toString());
    });
    categories = Array.from(cats).sort();
  } else {
    categories = (elems as { categories: ReadonlyArray<string | ICategory> }).categories;
  }
  return {
    name,
    position,
    size,
    render: ({ width, height, set, theme }) => {
      const values = set.elems.map(acc);
      return (
        <CategoricalHistogramMemo
          values={values}
          width={width}
          height={height}
          categories={categories}
          theme={theme}
          {...extras}
        />
      );
    },
  };
}
