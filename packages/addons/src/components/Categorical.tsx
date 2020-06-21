/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { UpSetAddon, ISetLike, UpSetThemes } from '@upsetjs/react';
import { normalize, denormalize, ICategory, categoricalHistogram, ICategoryBin, ICategoryBins } from '@upsetjs/math';

export { ICategory, ICategoryBins } from '@upsetjs/math';

export interface ICategoricalStyleProps {
  theme?: UpSetThemes;
  /**
   * orientation of the box plot
   * @default horizontal
   */
  orient?: 'horizontal' | 'vertical';
}

declare type CategoricalProps = (
  | {
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
    }
  | {
      bins: readonly ICategoryBin[];
    }
) & {
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

  tooltips?: boolean;
} & ICategoricalStyleProps;

function isGiven(p: any): p is { bins: readonly ICategoryBin[] } {
  return Array.isArray((p as { bins: readonly ICategoryBin[] }).bins);
}

function toString(cat: ICategoryBins) {
  return cat.map((bin) => `${bin.label}: ${bin.count}`).join(', ');
}

export const Categorical = (p: CategoricalProps) => {
  const { margin = 0, rectStyle = {} } = p;
  const bins = isGiven(p) ? p.bins : categoricalHistogram(p.values, p.categories, p.base, p.theme === 'dark');
  const n = normalize([
    0,
    isGiven(p) ? p.bins.reduce((acc, v) => acc + v.count, 0) : p.base?.length ?? p.values.length,
  ]);
  const hor = p.orient !== 'vertical';
  const dn = denormalize([0, hor ? p.width : p.height]);
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
            height={p.height - 2 * margin}
            style={Object.assign({ fill: bin.color }, rectStyle)}
          >
            {p.tooltips !== false && <title>{`${bin.label}: ${bin.count}`}</title>}
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
          width={p.width - 2 * margin}
          style={Object.assign({ fill: bin.color }, rectStyle)}
        >
          {p.tooltips !== false && <title>{`${bin.label}: ${bin.count}`}</title>}
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
    createOnHandlerData: (set) => {
      const b = categoricalHistogram(set.elems.map(acc), categories, undefined, extras.theme === 'dark');
      return {
        id: 'categorical',
        name,
        value: Object.assign(
          {
            ...b,
            toString(): string {
              return toString(this as ICategoryBins);
            },
          },
          b
        ),
      };
    },
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

/**
 * generates a categorical addon to render distributions as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their categories
 * @param options additional options
 */
export function categoricalAggregatedAddon<T>(
  acc: (v: readonly T[]) => ICategoryBins,
  {
    size = 100,
    position,
    name = 'Histogram',
    ...extras
  }: Partial<Pick<UpSetAddon<ISetLike<T>, T, React.ReactNode>, 'size' | 'position' | 'name'>> &
    ICategoricalStyleProps = {}
): UpSetAddon<ISetLike<T>, T, React.ReactNode> {
  return {
    name,
    position,
    size,
    createOnHandlerData: (set) => {
      const b = acc(set.elems);
      return {
        id: 'categorical',
        name,
        value: Object.assign(
          {
            ...b,
            toString(): string {
              return toString(this as ICategoryBins);
            },
          },
          b
        ),
      };
    },
    render: ({ width, height, set, theme }) => {
      const values = acc(set.elems);
      return <CategoricalMemo bins={values} width={width} height={height} theme={theme} {...extras} />;
    },
    renderSelection: ({ width, height, theme, overlap, selectionColor }) => {
      if (overlap == null || overlap.length === 0) {
        return null;
      }
      const values = acc(overlap);
      return (
        <CategoricalMemo
          bins={values}
          width={width}
          height={height}
          theme={theme}
          rectStyle={{ stroke: selectionColor, strokeWidth: 2, fill: theme === 'light' ? darkOverlap : lightOverlap }}
          {...extras}
        />
      );
    },
    renderQuery: ({ width, height, overlap, query, secondary, index, theme }) => {
      if (overlap == null || overlap.length === 0) {
        return null;
      }
      const values = acc(overlap);
      return (
        <CategoricalMemo
          bins={values}
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
