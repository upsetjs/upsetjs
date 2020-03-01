import { ScaleLinear, ScaleBand } from 'd3-scale';
import React, { PropsWithChildren } from 'react';

function isBandScale(scale: ScaleLinear<any, number> | ScaleBand<any>): scale is ScaleBand<any> {
  return typeof (scale as ScaleBand<any>).bandwidth === 'function';
}

export type D3AxisProps = {
  d3Scale: ScaleLinear<any, number> | ScaleBand<any>;
  orient: 'top' | 'bottom' | 'left' | 'right';
  tickSizeInner?: number;
  tickSizeOuter?: number;
  tickPadding?: number;
} & React.SVGProps<SVGGElement>;

function center<T>(scale: ScaleBand<T>) {
  let offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scale.round()) {
    offset = Math.round(offset);
  }
  return (d: T) => scale(d)! + offset;
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

export default function D3Axis({
  d3Scale: scale,
  orient,
  tickSizeInner = 6,
  tickSizeOuter = 6,
  tickPadding = 3,
  ...extras
}: PropsWithChildren<D3AxisProps>) {
  const values = isBandScale(scale) ? scale.domain() : scale.ticks();
  const format = isBandScale(scale) ? String : scale.tickFormat();

  const spacing = Math.max(tickSizeInner, 0) + tickPadding;
  const range = scale.range();
  const range0 = +range[0] + 0.5;
  const range1 = +range[range.length - 1] + 0.5;
  const position = isBandScale(scale) ? center(scale) : scale;
  const k = orient === 'top' || orient === 'left' ? -1 : 1;

  const D3Tick = orient === 'left' || orient === 'right' ? D3HorizontalTick : D3VerticalTick;

  return (
    <g {...extras} style={{ fill: 'none', fontSize: 10, fontFamily: 'sans-serif', ...(extras.style ?? {}) }}>
      {values.map(d => (
        <D3Tick
          key={d}
          pos={position(d)}
          name={format(d)}
          spacing={spacing}
          tickSizeInner={tickSizeInner}
          orient={orient}
        />
      ))}
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