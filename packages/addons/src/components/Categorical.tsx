/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { UpSetAddon, ISetLike, UpSetThemes } from '@upsetjs/react';
import { normalize, denormalize, ICategory, categoricalHistogram } from '@upsetjs/math';

export { ICategory } from '@upsetjs/math';

export interface ICategoricalStyleProps {
  theme?: UpSetThemes;
  /**
   * orientation of the box plot
   * @default horizontal
   */
  orient?: 'horizontal' | 'vertical';
}

declare type CategoricalProps = {
  /**
   * the values to render
   */
  values: readonly string[];
  /**
   * possible categories
   */
  categories: readonly (string | ICategory)[];
  /**
   *
   */
  base?: readonly string[];
  /**
   * margin offset
   */
  margin?: number;
  /**
   * style applied to each rect
   */
  rectStyle?: React.CSSProperties;
  /**
   * width of the box plot
   */
  width: number;
  /**
   * height of the box plot
   */
  height: number;
} & ICategoricalStyleProps;

export const Categorical = ({
  theme = 'light',
  orient = 'horizontal',
  width: w,
  height: h,
  values,
  categories,
  base,
  margin = 0,
  rectStyle = {},
}: CategoricalProps) => {
  const bins = categoricalHistogram(values, categories, base, theme === 'dark');
  const hor = orient === 'horizontal';
  const n = normalize([0, base?.length ?? values.length]);
  const dn = denormalize([0, hor ? w : h]);
  const scale = (v: number) => dn(n(v));

  if (hor) {
    return (
      <g>
        {bins.map((bin) => (
          <rect
            key={bin.value}
            x={scale(bin.acc)}
            width={scale(bin.count)}
            y={margin}
            height={h - 2 * margin}
            style={Object.assign({ fill: bin.color }, rectStyle)}
          >
            <title>{`${bin.label}: ${bin.count}`}</title>
          </rect>
        ))}
      </g>
    );
  }

  return (
    <g>
      {bins.map((bin) => (
        <rect
          key={bin.value}
          y={scale(bin.acc)}
          height={scale(bin.count)}
          x={margin}
          width={w - 2 * margin}
          style={Object.assign({ fill: bin.color }, rectStyle)}
        >
          <title>{`${bin.label}: ${bin.count}`}</title>
        </rect>
      ))}
    </g>
  );
};

const CategoricalMemo = React.memo(Categorical);

export default Categorical;

const lightOverlap = 'rgba(255,255,255,0.2)';
const darkOverlap = 'rgba(0,0,0,0.1)';

/**
 * generates a categorical addon to render distributions as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their categories
 * @param options additional options
 */
export function categoricalAddon<T>(
  prop: keyof T | ((v: T) => string),
  elems: readonly T[] | { categories: readonly (string | ICategory)[] },
  {
    size = 100,
    position,
    name = prop.toString(),
    ...extras
  }: Partial<Pick<UpSetAddon<ISetLike<T>, T, React.ReactNode>, 'size' | 'position' | 'name'>> &
    ICategoricalStyleProps = {}
): UpSetAddon<ISetLike<T>, T, React.ReactNode> {
  const acc = typeof prop === 'function' ? prop : (v: T) => (v[prop as keyof T] as unknown) as string;
  let categories: readonly (string | ICategory)[] = [];
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
    categories = (elems as { categories: readonly (string | ICategory)[] }).categories;
  }
  return {
    name,
    position,
    size,
    render: ({ width, height, set, theme }) => {
      const values = set.elems.map(acc);
      return (
        <CategoricalMemo
          values={values}
          categories={categories}
          width={width}
          height={height}
          theme={theme}
          {...extras}
        />
      );
    },
    renderSelection: ({ width, height, set, theme, overlap, selectionColor }) => {
      if (overlap == null || overlap.length === 0) {
        return null;
      }
      const base = set.elems.map(acc);
      const values = overlap.map(acc);
      return (
        <CategoricalMemo
          values={values}
          base={base}
          categories={categories}
          width={width}
          height={height}
          theme={theme}
          rectStyle={{ stroke: selectionColor, strokeWidth: 2, fill: theme === 'light' ? darkOverlap : lightOverlap }}
          {...extras}
        />
      );
    },
    renderQuery: ({ width, height, overlap, set, query, secondary, index, theme }) => {
      if (overlap == null || overlap.length === 0) {
        return null;
      }
      const base = set.elems.map(acc);
      const values = overlap.map(acc);
      return (
        <CategoricalMemo
          values={values}
          base={base}
          categories={categories}
          width={width}
          height={height}
          margin={secondary ? index + 2 : 0}
          rectStyle={{ stroke: query.color, fill: theme === 'light' ? darkOverlap : lightOverlap }}
          theme={theme}
          {...extras}
        />
      );
    },
  };
}
