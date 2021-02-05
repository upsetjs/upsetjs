/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { Ref } from 'react';
import { UpSetJSSkeletonProps, prepare } from '../UpSetJSSkeleton';
import { bounds } from './layout';

/**
 * KV Diagram Skeleton a simple KarnaughMap skeleton
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const KarnaughMapSkeleton = /*!#__PURE__*/ React.memo(
  /*!#__PURE__*/ React.forwardRef(function KarnaughMapSkeleton(props: UpSetJSSkeletonProps, ref: Ref<SVGSVGElement>) {
    const { rest, color, secondary } = prepare(props);

    // const padding = 10;
    const { xBefore, yBefore, cell, hCells, vCells } = bounds(2, {
      width: 270,
      height: 170,
      labelHeight: 20,
    });

    const gw = hCells * cell;
    const gh = vCells * cell;
    const v1 = 0.9;
    const v2 = 0.5;
    const v3 = 0.26;
    const v4 = 0.75;

    return (
      <svg viewBox="0 0 300 200" ref={ref} fontFamily="sans-serif" {...rest}>
        <g transform={`translate(${xBefore + 10},${yBefore + 10})`}>
          <text x={cell * 0.5} y={-3} fill={color} textAnchor="middle">
            A
          </text>
          <text x={cell * 1.5} y={-3} fill={color} textAnchor="middle" style={{ textDecoration: 'overline' }}>
            A
          </text>
          <text x={-3} y={cell * 0.5} fill={color} textAnchor="end" dominantBaseline="central">
            B
          </text>
          <text
            x={-3}
            y={cell * 1.5}
            fill={color}
            textAnchor="end"
            dominantBaseline="central"
            style={{ textDecoration: 'overline' }}
          >
            B
          </text>

          <rect x={cell * 0.1} y={cell * (1 - v1)} height={cell * v1} width={cell * 0.8} fill={secondary} />
          <rect x={cell * 1.1} y={cell * (1 - v2)} height={cell * v2} width={cell * 0.8} fill={secondary} />
          <rect x={cell * 0.1} y={cell * (1 - v3 + 1)} height={cell * v3} width={cell * 0.8} fill={secondary} />
          <rect x={cell * 1.1} y={cell * (1 - v4 + 1)} height={cell * v4} width={cell * 0.8} fill={secondary} />
          <path
            d={`M0,0 l${gw},0 l0,${gh} l${-gw},0 l0,${-gh} M${gw / 2},0 l0,${gh} M0,${gh / 2} l${gw},0`}
            fill="none"
            stroke={color}
          />
        </g>
      </svg>
    );
  })
) as React.FC<UpSetJSSkeletonProps & React.RefAttributes<SVGSVGElement>>;

export { KarnaughMapSkeleton };
