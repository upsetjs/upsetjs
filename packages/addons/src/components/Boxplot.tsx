import React, { PropsWithChildren } from 'react';
import { UpSetAddon, ISetLike } from '@upsetjs/react';
import { boxplot, BoxplotStatsOptions, normalize, denormalize } from '@upsetjs/math';
import { round2 } from './utils';

export interface IBoxplotStyleProps extends BoxplotStatsOptions {
  orient?: 'horizontal' | 'vertical';
  boxStyle?: React.CSSProperties;
  lineStyle?: React.CSSProperties;
  outlierStyle?: React.CSSProperties;
  boxPadding?: number;
  outlierRadius?: number;
  numberFormat?(v: number): string;
}

const Boxplot = React.memo(function Boxplot({
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
}: PropsWithChildren<
  {
    values: number[];
    width: number;
    height: number;
    min: number;
    max: number;
  } & IBoxplotStyleProps
>) {
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
  const styles = {
    box: Object.assign({ fill: 'lightgray' }, boxStyle),
    line: Object.assign({ fill: 'none', stroke: 'black' }, lineStyle),
    outlier: Object.assign({ fill: 'lightgray' }, outlierStyle),
  };

  if (hor) {
    const c = h / 2;
    const bp = round2(h * bpp);
    const hp = h - bp;
    const w1 = `M${s.wl},0 l0,${h} M${s.wl},${c} L${s.q1},${c}`;
    const w2 = `M${s.q3},${c} L${s.wh},${c} M${s.wh},0 L${s.wh},${h}`;
    const box = `M${s.q1},${bp} L${s.q3},${bp} L${s.q3},${hp} L${s.q1},${hp} L${s.q1},${bp} M${s.med},${bp} l0,${
      hp - bp
    }`;
    return (
      <g>
        {title}
        <rect x={s.q1} y={bp} width={s.q3 - s.q1} height={h - 2 * bp} style={styles.box} />
        <path d={`${w1}  ${w2} ${box}`} style={styles.line} />
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
    const bp = round2(w * bpp);
    const wp = w - bp;
    const w1 = `M0,${s.wl} l${w},0 M${c},${s.wl} L${c},${s.q1}`;
    const w2 = `M${c},${s.q3} L${c},${s.wh} M0,${s.wh} L${w},${s.wh}`;
    const box = `M${bp},${s.q1} L${bp},${s.q3} l${wp - bp},0 L${wp},${s.q1} L${bp},${s.q1} M${bp},${s.med} l${
      wp - bp
    },0`;
    return (
      <g>
        {title}
        <rect y={s.q1} x={bp} height={s.q3 - s.q1} width={w - 2 * bp} style={styles.box} />
        <path d={`${w1} ${w2} ${box}`} style={styles.line} />
        {b.outlier.map((o) => (
          <circle key={o} r={outlierRadius} cx={c} cy={scale(o)} style={styles.outlier}>
            <title>${nf(o)}</title>
          </circle>
        ))}
      </g>
    );
  }
});

export default Boxplot;

export function boxplotAddon<T>(
  prop: keyof T | ((v: T) => number),
  elems: ReadonlyArray<T> | { min: number; max: number },
  { size = 100, position, ...extras }: { size?: number; position?: 'before' | 'after' } & IBoxplotStyleProps = {}
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
    position,
    size,
    render: ({ width, height, set }) => {
      const values = set.elems.map(acc);
      return <Boxplot values={values} width={width} height={height} min={min} max={max} {...extras} />;
    },
  };
}
