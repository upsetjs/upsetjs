/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { UpSetAddon, ISetLike, UpSetThemes, getDefaultTheme, NumericScaleLike } from '@upsetjs/react';
import { boxplot, BoxplotStatsOptions, normalize, denormalize, IBoxPlot } from '@upsetjs/math';
import { round2 } from './utils';

export { IBoxPlot } from '@upsetjs/math';

export function simpleScale(
  domain: [number, number],
  range: [number, number],
  orient: 'horizontal' | 'vertical' = 'horizontal'
) {
  const n = normalize(domain);
  const dnDomain = denormalize(domain);
  const dn = denormalize(range);
  const f: NumericScaleLike = (v) => dn(n(v));
  const defaultTicks = orient === 'horizontal' ? 5 : 7;

  f.ticks = (count = defaultTicks) =>
    Array(count)
      .fill(0)
      .map((_, i) => {
        const v = dnDomain(i / (count - 1));
        return {
          value: v,
          label: v.toFixed(2),
        };
      });
  f.tickFormat = () => (v) => v.toFixed(2);
  return f;
}

export interface IBoxplotStylePlainProps extends BoxplotStatsOptions {
  theme?: UpSetThemes;
  /**
   * the render mode and level of detail to render
   * @default normal
   */
  mode?: 'normal' | 'box' | 'indicator';
  /**
   * orientation of the box plot
   * @default horizontal
   */
  orient?: 'horizontal' | 'vertical';
  /**
   * margin applied
   * @default 0
   */
  margin?: number;
  /**
   * padding of the box from its corners
   * @default 0.1
   */
  boxPadding?: number;
  /**
   * radius of the outlier circles
   * @default 3
   */
  outlierRadius?: number;
  /**
   * number format used for the tooltip
   * @default .toFixed(2)
   */
  numberFormat?(v: number): string;

  /**
   * whether to render tooltips
   * @default true
   */
  tooltips?: boolean;
}

export interface IBoxplotStyleProps extends IBoxplotStylePlainProps {
  /**
   * custom styles applied to the box element
   */
  boxStyle?: React.CSSProperties;
  /**
   * custom styles applied to the whisker element
   */
  lineStyle?: React.CSSProperties;
  /**
   * custom styles applied to the outlier elements
   */
  outlierStyle?: React.CSSProperties;
}

declare type BoxplotProps = {
  /**
   * the values to render as a box plot
   */
  values: IBoxPlot | readonly number[];
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
  min: number;
  /**
   * domain maximum value
   */
  max: number;
};

const defaultFormatter = (v: number) => v.toFixed(2);

function toString(b: IBoxPlot, nf: (v: number) => string) {
  return `Min: ${nf(b.min)}, 25% Quantile: ${nf(b.q1)}, Median: ${nf(b.median)}, 75% Quantile: ${nf(b.q3)}, Max: ${nf(
    b.max
  )}`;
}

export const Boxplot = (p: React.PropsWithChildren<BoxplotProps & IBoxplotStyleProps>) => {
  const {
    theme = 'light',
    mode = 'normal',
    boxStyle,
    lineStyle,
    outlierStyle,
    margin = 0,
    boxPadding: bpp = 0.1,
    outlierRadius = 3,
    numberFormat: nf = defaultFormatter,
    ...options
  } = p;
  const b = Array.isArray(p.values) ? boxplot(p.values, options) : (p.values as IBoxPlot);
  if (Number.isNaN(b.median)) {
    return <g></g>;
  }
  const hor = p.orient !== 'vertical';
  const n = normalize([p.min, p.max]);
  const dn = denormalize([0, hor ? p.width : p.height]);
  const scale = (v: number) => round2(dn(n(v)));

  const s = {
    max: scale(b.max),
    avg: scale(b.mean),
    med: scale(b.median),
    min: scale(b.min),
    q1: scale(b.q1),
    q3: scale(b.q3),
    wh: scale(b.whiskerHigh),
    wl: scale(b.whiskerLow),
  };

  const title = p.tooltips !== false && <title>{toString(b, nf)}</title>;
  const inner = getDefaultTheme(theme).notMemberColor;
  const styles = {
    box: Object.assign({ fill: inner }, boxStyle),
    line: Object.assign({ fill: 'none', stroke: theme === 'light' ? 'black' : '#cccccc' }, lineStyle),
    outlier: Object.assign({ fill: inner }, outlierStyle),
  };

  if (hor) {
    const c = p.height / 2;
    const bp = round2(p.height * bpp) + margin;
    const hp = p.height - bp;
    const w1 = `M${s.wl},${margin} l0,${p.height - margin * 2} M${s.wl},${c} L${s.q1},${c}`;
    const w2 = `M${s.q3},${c} L${s.wh},${c} M${s.wh},${margin} L${s.wh},${p.height - margin}`;
    const box = `M${s.q1},${bp} L${s.q3},${bp} L${s.q3},${hp} L${s.q1},${hp} L${s.q1},${bp} M${s.med},${bp} l0,${
      hp - bp
    }`;
    const path = <path d={`${w1} ${w2} ${box}`} style={styles.line} />;
    if (mode === 'indicator') {
      return path;
    }
    return (
      <g>
        {title}
        {mode === 'normal' && (
          <rect x={s.q1} y={bp} width={s.q3 - s.q1} height={p.height - 2 * bp} style={styles.box} />
        )}
        {path}
        {b.outlier.map((o) => (
          <circle key={o} r={outlierRadius} cy={c} cx={scale(o)} style={styles.outlier}>
            <title>${nf(o)}</title>
          </circle>
        ))}
      </g>
    );
  }
  {
    const c = p.width / 2;
    const bp = round2(p.width * bpp) + margin;
    const wp = p.width - bp;
    const w1 = `M${margin},${s.wl} l${p.width - 2 * margin},0 M${c},${s.wl} L${c},${s.q1}`;
    const w2 = `M${c},${s.q3} L${c},${s.wh} M${margin},${s.wh} L${p.width - margin},${s.wh}`;
    const box = `M${bp},${s.q1} L${bp},${s.q3} l${wp - bp},0 L${wp},${s.q1} L${bp},${s.q1} M${bp},${s.med} l${
      wp - bp
    },0`;
    const path = <path d={`${w1} ${w2} ${box}`} style={styles.line} />;

    if (mode === 'indicator') {
      return path;
    }
    return (
      <g>
        {title}
        {mode === 'normal' && <rect y={s.q1} x={bp} height={s.q3 - s.q1} width={p.width - 2 * bp} style={styles.box} />}
        {path}
        {b.outlier.map((o) => (
          <circle key={o} r={outlierRadius} cx={c} cy={scale(o)} style={styles.outlier}>
            <title>${nf(o)}</title>
          </circle>
        ))}
      </g>
    );
  }
};

const BoxplotMemo = React.memo(Boxplot);

export default Boxplot;

/**
 * generates a boxplot addon to render box plots as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their minimum / maximum value for specifying the data domain
 * @param options additional options
 */
export function boxplotAddon<T>(
  prop: keyof T | ((v: T) => number),
  elems: readonly T[] | { min: number; max: number },
  {
    size = 100,
    position,
    name = prop.toString(),
    ...extras
  }: Partial<Pick<UpSetAddon<ISetLike<T>, T, React.ReactNode>, 'size' | 'position' | 'name'>> & IBoxplotStyleProps = {}
): UpSetAddon<ISetLike<T>, T, React.ReactNode> {
  const acc = typeof prop === 'function' ? prop : (v: T) => (v[prop as keyof T] as unknown) as number;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  if (Array.isArray(elems)) {
    elems.forEach((elem) => {
      const v = acc(elem);
      if (v == null || Number.isNaN(v)) {
        return;
      }
      if (v < min) {
        min = v;
      }
      if (v > max) {
        max = v;
      }
    });
  } else {
    const d = elems as { min: number; max: number };
    min = d.min;
    max = d.max;
  }
  const scale: NumericScaleLike = simpleScale([min, max], [0, size], extras.orient);
  return {
    name,
    position,
    size,
    scale,
    createOnHandlerData: (set) => {
      const b = boxplot(set.elems.map(acc), extras);
      return {
        id: 'boxplot',
        name,
        value: Object.assign(
          {
            ...b,
            toString(): string {
              return toString(this as IBoxPlot, extras.numberFormat ?? defaultFormatter);
            },
          },
          b
        ),
      };
    },
    render: ({ width, height, set, theme }) => {
      const values = set.elems.map(acc);
      return (
        <BoxplotMemo values={values} width={width} height={height} min={min} max={max} theme={theme} {...extras} />
      );
    },
    renderSelection: ({ width, height, overlap, selectionColor, theme }) => {
      if (overlap == null || overlap.length === 0) {
        return null;
      }
      const values = overlap.map(acc);
      return (
        <BoxplotMemo
          values={values}
          width={width}
          height={height}
          min={min}
          max={max}
          mode="box"
          lineStyle={{ stroke: selectionColor, strokeWidth: 2 }}
          outlierStyle={{ fill: selectionColor }}
          theme={theme}
          {...extras}
        />
      );
    },
    renderQuery: ({ width, height, overlap, query, secondary, index, theme }) => {
      if (overlap == null || overlap.length === 0) {
        return null;
      }
      const values = overlap.map(acc);
      return (
        <BoxplotMemo
          values={values}
          width={width}
          height={height}
          min={min}
          max={max}
          mode={secondary ? 'indicator' : 'box'}
          margin={secondary ? index + 2 : 0}
          lineStyle={{ stroke: query.color, strokeWidth: secondary ? 1 : 2 }}
          outlierStyle={{ fill: query.color }}
          theme={theme}
          {...extras}
        />
      );
    },
  };
}

/**
 * generates a boxplot addon to render box plots as UpSet.js addon for aggregated set data
 * @param acc accessor
 * @param elems list of elements or their minimum / maximum value for specifying the data domain
 * @param options additional options
 */
export function boxplotAggregatedAddon<T>(
  acc: (v: readonly T[]) => IBoxPlot,
  domain: { min: number; max: number },
  {
    size = 100,
    position,
    name = 'BoxPlot',
    ...extras
  }: Partial<Pick<UpSetAddon<ISetLike<T>, T, React.ReactNode>, 'size' | 'position' | 'name'>> & IBoxplotStyleProps = {}
): UpSetAddon<ISetLike<T>, T, React.ReactNode> {
  const min = domain.min;
  const max = domain.max;
  const scale: NumericScaleLike = simpleScale([min, max], [0, size], extras.orient);
  return {
    name,
    position,
    size,
    scale,
    createOnHandlerData: (set) => {
      const b = acc(set.elems);
      b.toString = function (this: IBoxPlot) {
        return toString(this, extras.numberFormat ?? defaultFormatter);
      };
      return {
        id: 'boxplot',
        name,
        value: b,
      };
    },
    render: ({ width, height, set, theme }) => {
      const values = acc(set.elems);
      return (
        <BoxplotMemo values={values} width={width} height={height} min={min} max={max} theme={theme} {...extras} />
      );
    },
    renderSelection: ({ width, height, overlap, selectionColor, theme }) => {
      if (overlap == null || overlap.length === 0) {
        return null;
      }
      const values = acc(overlap);
      return (
        <BoxplotMemo
          values={values}
          width={width}
          height={height}
          min={min}
          max={max}
          mode="box"
          lineStyle={{ stroke: selectionColor, strokeWidth: 2 }}
          outlierStyle={{ fill: selectionColor }}
          theme={theme}
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
        <BoxplotMemo
          values={values}
          width={width}
          height={height}
          min={min}
          max={max}
          mode={secondary ? 'indicator' : 'box'}
          margin={secondary ? index + 2 : 0}
          lineStyle={{ stroke: query.color, strokeWidth: secondary ? 1 : 2 }}
          outlierStyle={{ fill: query.color }}
          theme={theme}
          {...extras}
        />
      );
    },
  };
}
