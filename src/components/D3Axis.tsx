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

  const k = orient === 'top' || orient === 'left' ? -1 : 1;
  const x = orient === 'left' || orient === 'right' ? 'x' : 'y';

  const spacing = Math.max(tickSizeInner, 0) + tickPadding;
  const range = scale.range();
  const range0 = +range[0] + 0.5;
  const range1 = +range[range.length - 1] + 0.5;
  const position = isBandScale(scale) ? center(scale) : scale;

  return (
    <g {...extras}>
      {values.map(d => (
        <g key={position(d)} transform={`translate${x === 'x' ? 'Y' : 'X'}(${position(d) + 0.5})`}>
          <text
            {...{ [x]: k * spacing }}
            dy={orient === 'top' ? '0em' : orient === 'bottom' ? '0.71em' : '0.32em'}
            style={{
              textAnchor: orient === 'right' ? 'start' : orient === 'left' ? 'end' : 'middle',
              fill: 'currentColor',
            }}
          >
            {format(d)}
          </text>
          <line {...{ [`${x}2`]: k * tickSizeInner }} style={{ stroke: 'currentColor' }} />
        </g>
      ))}
      <path
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
