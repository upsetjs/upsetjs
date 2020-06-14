/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { UpSetAddon, ISetLike, UpSetThemes, getDefaultTheme } from '@upsetjs/react';
import { boxplot, BoxplotStatsOptions, normalize, denormalize } from '@upsetjs/math';
import { round2 } from './utils';

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
  values: ReadonlyArray<number>;
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

export const Boxplot = ({
  theme = 'light',
  mode = 'normal',
  values,
  orient = 'horizontal',
  width: w,
  height: h,
  min,
  max,
  boxStyle,
  lineStyle,
  outlierStyle,
  margin = 0,
  boxPadding: bpp = 0.1,
  outlierRadius = 3,
  numberFormat: nf = (v) => v.toFixed(2),
  ...options
}: React.PropsWithChildren<BoxplotProps & IBoxplotStyleProps>) => {
  const b = boxplot(values, options);
  if (Number.isNaN(b.median)) {
    return <g></g>;
  }
  const hor = orient === 'horizontal';
  const n = normalize([min, max]);
  const dn = denormalize([0, hor ? w : h]);
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

  const title = (
    <title>{`Min: ${nf(b.min)}, 25% Quantile: ${nf(b.q1)}, Median: ${nf(b.median)}, 75% Quantile: ${nf(
      b.q3
    )}, Max: ${nf(b.max)}`}</title>
  );
  const inner = getDefaultTheme(theme).notMemberColor;
  const styles = {
    box: Object.assign({ fill: inner }, boxStyle),
    line: Object.assign({ fill: 'none', stroke: theme === 'light' ? 'black' : '#cccccc' }, lineStyle),
    outlier: Object.assign({ fill: inner }, outlierStyle),
  };

  if (hor) {
    const c = h / 2;
    const bp = round2(h * bpp) + margin;
    const hp = h - bp;
    const w1 = `M${s.wl},${margin} l0,${h - margin * 2} M${s.wl},${c} L${s.q1},${c}`;
    const w2 = `M${s.q3},${c} L${s.wh},${c} M${s.wh},${margin} L${s.wh},${h - margin}`;
    const box = `M${s.q1},${bp} L${s.q3},${bp} L${s.q3},${hp} L${s.q1},${hp} L${s.q1},${bp} M${s.med},${bp} l0,${
      hp - bp
    }`;
    const p = <path d={`${w1} ${w2} ${box}`} style={styles.line} />;
    if (mode === 'indicator') {
      return p;
    }
    return (
      <g>
        {title}
        {mode === 'normal' && <rect x={s.q1} y={bp} width={s.q3 - s.q1} height={h - 2 * bp} style={styles.box} />}
        {p};
        {b.outlier.map((o) => (
          <circle key={o} r={outlierRadius} cy={c} cx={scale(o)} style={styles.outlier}>
            <title>${nf(o)}</title>
          </circle>
        ))}
      </g>
    );
  }
  {
    const c = w / 2;
    const bp = round2(w * bpp) + margin;
    const wp = w - bp;
    const w1 = `M${margin},${s.wl} l${w - 2 * margin},0 M${c},${s.wl} L${c},${s.q1}`;
    const w2 = `M${c},${s.q3} L${c},${s.wh} M${margin},${s.wh} L${w - margin},${s.wh}`;
    const box = `M${bp},${s.q1} L${bp},${s.q3} l${wp - bp},0 L${wp},${s.q1} L${bp},${s.q1} M${bp},${s.med} l${
      wp - bp
    },0`;
    const p = <path d={`${w1} ${w2} ${box}`} style={styles.line} />;

    if (mode === 'indicator') {
      return p;
    }
    return (
      <g>
        {title}
        {mode === 'normal' && <rect y={s.q1} x={bp} height={s.q3 - s.q1} width={w - 2 * bp} style={styles.box} />}
        {p}
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
  elems: ReadonlyArray<T> | { min: number; max: number },
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
  return {
    name,
    position,
    size,
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
