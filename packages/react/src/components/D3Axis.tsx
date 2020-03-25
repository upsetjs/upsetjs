import React, { PropsWithChildren } from 'react';
import { BandScaleLike, NumericScaleLike } from '@upsetjs/model';

function isBandScale(scale: BandScaleLike | NumericScaleLike): scale is BandScaleLike {
  return typeof (scale as BandScaleLike).bandwidth === 'function';
}

export type D3AxisProps = {
  d3Scale: BandScaleLike | NumericScaleLike;
  orient: 'top' | 'bottom' | 'left' | 'right';
  tickSizeInner?: number;
  tickSizeOuter?: number;
  tickPadding?: number;
  integersOnly?: boolean;
} & React.SVGProps<SVGGElement>;

function center(scale: BandScaleLike) {
  let offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) {
    offset = Math.round(offset);
  }
  return (d: string) => scale(d)! + offset;
}
declare type TickProps = {
  pos: number;
  spacing: number;
  tickSizeInner: number;
  orient: 'top' | 'bottom' | 'left' | 'right';
  name: string;
};

const D3HorizontalTick = React.memo(function D3HorizontalTick({
  pos,
  spacing,
  tickSizeInner,
  orient,
  name,
}: PropsWithChildren<TickProps>) {
  const k = orient === 'top' || orient === 'left' ? -1 : 1;
  return (
    <g transform={`translate(0, ${pos + 0.5})`}>
      <text
        x={k * spacing}
        dy={'0.32em'}
        style={{
          textAnchor: orient === 'right' ? 'start' : 'end',
          fill: 'currentColor',
        }}
      >
        {name}
      </text>
      <line x2={k * tickSizeInner} style={{ stroke: 'currentColor' }} />
    </g>
  );
});

const D3VerticalTick = React.memo(function D3VerticalTick({
  pos,
  name,
  spacing,
  orient,
  tickSizeInner,
}: PropsWithChildren<TickProps>) {
  const k = orient === 'top' || orient === 'left' ? -1 : 1;
  return (
    <g transform={`translate(${pos + 0.5}, 0)`}>
      <text
        y={k * spacing}
        dy={orient === 'top' ? '0em' : '0.71em'}
        style={{
          textAnchor: 'middle',
          fill: 'currentColor',
        }}
      >
        {name}
      </text>
      <line y2={k * tickSizeInner} style={{ stroke: 'currentColor' }} />
    </g>
  );
});

function fixTicks(ticks: number[], integersOnly?: boolean) {
  if (!integersOnly) {
    return ticks;
  }
  // round to integers and then remove duplicates
  const rounded = ticks.map((d) => Math.round(d));
  let last = Number.NEGATIVE_INFINITY;
  // since sorted same can just be neighbors
  return rounded.filter((d) => {
    if (last === Number.NEGATIVE_INFINITY) {
      last = d;
      return true;
    }
    if (last === d) {
      return false;
    }
    last = d;
    return true;
  });
}

export default function D3Axis({
  d3Scale: scale,
  orient,
  tickSizeInner = 6,
  tickSizeOuter = 6,
  tickPadding = 3,
  integersOnly,
  ...extras
}: PropsWithChildren<D3AxisProps>) {
  const spacing = Math.max(tickSizeInner, 0) + tickPadding;
  const range = scale.range();
  const range0 = +range[0] + 0.5;
  const range1 = +range[range.length - 1] + 0.5;

  const k = orient === 'top' || orient === 'left' ? -1 : 1;
  const D3Tick = orient === 'left' || orient === 'right' ? D3HorizontalTick : D3VerticalTick;

  const genBandTicks = (scale: BandScaleLike) => {
    const values = scale.domain();
    const position = center(scale);
    return values.map((d) => (
      <D3Tick key={d} pos={position(d)} name={d} spacing={spacing} tickSizeInner={tickSizeInner} orient={orient} />
    ));
  };
  const genNumericTicks = (scale: NumericScaleLike) => {
    const values = fixTicks(scale.ticks(), integersOnly);
    const format = integersOnly ? String : scale.tickFormat();
    return values.map((d) => (
      <D3Tick key={d} pos={scale(d)} name={format(d)} spacing={spacing} tickSizeInner={tickSizeInner} orient={orient} />
    ));
  };
  const ticks = isBandScale(scale) ? genBandTicks(scale) : genNumericTicks(scale);

  return (
    <g {...extras} style={{ fill: 'none', fontSize: 10, fontFamily: 'sans-serif', ...(extras.style ?? {}) }}>
      {ticks}
      <path
        style={{ stroke: 'currentColor' }}
        d={
          orient === 'left' || orient === 'right'
            ? tickSizeOuter
              ? `M${k * tickSizeOuter},${range0}H0.5V${range1}H${k * tickSizeOuter}`
              : `M0.5,${range0}V${range1}`
            : tickSizeOuter
            ? `M${range0},${k * tickSizeOuter}V0.5H${range1}V${k * tickSizeOuter}`
            : `M${range0},0.5H${range1}`
        }
      />
    </g>
  );
}
