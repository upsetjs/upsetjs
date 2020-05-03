/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { CSSProperties } from 'react';
import { UpSetAddon, ISetLike } from '@upsetjs/react';
import { boxplot, BoxplotStatsOptions, normalize, denormalize } from '@upsetjs/math';
import { round2 } from './utils';

export interface IBoxplotStyleProps extends BoxplotStatsOptions {
  theme?: 'light' | 'dark';
  mode?: 'normal' | 'box' | 'indicator';
  orient?: 'horizontal' | 'vertical';
  boxStyle?: CSSProperties;
  lineStyle?: CSSProperties;
  outlierStyle?: CSSProperties;
  boxPadding?: number;
  outlierRadius?: number;
  numberFormat?(v: number): string;
}

declare type BoxplotProps = {
  values: number[];
  width: number;
  height: number;
  min: number;
  max: number;
  children?: React.ReactNode;
} & IBoxplotStyleProps;

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
  boxPadding: bpp = 0.1,
  outlierRadius = 3,
  numberFormat: nf = (v) => v.toFixed(2),
  ...options
}: BoxplotProps) => {
  const b = boxplot(values, options);
  if (Number.isNaN(b.median)) {
    return <g></g>;
  }
  const o = mode === 'indicator' ? 1 : 0; // everything one pixel inner if just the indicator
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
  const inner = theme === 'light' ? '#d3d3d3' : '#666666';
  const styles = {
    box: Object.assign({ fill: inner }, boxStyle),
    line: Object.assign({ fill: 'none', stroke: theme === 'light' ? 'black' : '#cccccc' }, lineStyle),
    outlier: Object.assign({ fill: inner }, outlierStyle),
  };

  if (hor) {
    const c = h / 2;
    const bp = round2(h * bpp) + o;
    const hp = h - bp - o;
    const w1 = `M${s.wl},${o} l0,${h - o * 2} M${s.wl},${c} L${s.q1},${c}`;
    const w2 = `M${s.q3},${c} L${s.wh},${c} M${s.wh},${o} L${s.wh},${h - o}`;
    const box = `M${s.q1},${bp} L${s.q3},${bp} L${s.q3},${hp} L${s.q1},${hp} L${s.q1},${bp} M${s.med},${bp} l0,${
      hp - bp
    }`;
    const p = <path d={`${w1}  ${w2} ${box}`} style={styles.line} />;
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
    const bp = round2(w * bpp) + o;
    const wp = w - bp - o;
    const w1 = `M${o},${s.wl} l${w - 2 * o},0 M${c},${s.wl} L${c},${s.q1}`;
    const w2 = `M${c},${s.q3} L${c},${s.wh} M${o},${s.wh} L${w - o},${s.wh}`;
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

export function boxplotAddon<T>(
  prop: keyof T | ((v: T) => number),
  elems: ReadonlyArray<T> | { min: number; max: number },
  {
    size = 100,
    position,
    name = prop.toString(),
    ...extras
  }: Partial<Pick<UpSetAddon<ISetLike<T>, T>, 'size' | 'position' | 'name'>> & IBoxplotStyleProps = {}
): UpSetAddon<ISetLike<T>, T> {
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
          lineStyle={{ stroke: selectionColor }}
          outlierStyle={{ fill: selectionColor }}
          theme={theme}
          {...extras}
        />
      );
    },
    renderQuery: ({ width, height, overlap, query, secondary, theme }) => {
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
          lineStyle={{ stroke: query.color }}
          outlierStyle={{ fill: query.color }}
          theme={theme}
          {...extras}
        />
      );
    },
  };
}
