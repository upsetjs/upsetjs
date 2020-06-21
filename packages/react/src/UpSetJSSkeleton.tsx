/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, Ref, memo } from 'react';

export interface UpSetJSSkeletonProps {
  width?: string | number;
  height?: string | number;
  background?: string;
  color?: string;
  secondaryColor?: string;
}

export const defaults = {
  background: '#F4F4F4',
  color: '#A6A8AB',
  secondaryColor: '#E1E2E3',
};
/**
 * UpSetJS Skeleton a simple UpSetJS skeleton
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const UpSetJSSkeleton: React.FC<UpSetJSSkeletonProps & React.RefAttributes<SVGSVGElement>> = memo(
  forwardRef(function UpSetJSSkeleton(props: UpSetJSSkeletonProps, ref: Ref<SVGSVGElement>) {
    const c = props.color ?? defaults.color;
    const s = props.secondaryColor ?? defaults.secondaryColor;
    const renderRect = (key: number, x: number, y: number, w: number, h: number, bg = c) => {
      return <rect key={key} x={x} y={y} width={w} height={h} fill={bg} />;
    };
    const renderCircle = (key: number | string, x: number, y: number, d: number, filled: boolean) => {
      return <circle key={key} cx={x + d / 2} cy={y + d / 2} r={d / 2} fill={filled ? c : s} />;
    };
    const wi = 20;
    const padding = 10;

    const sWidth = 75;
    const sY = 110;

    const cHeight = 100;
    const csX = 85;

    const cOffsets = [10, 20, 35, 60, 65, 80, 90];
    const sOffsets = [50, 30, 15];

    const lw = 6;

    return (
      <svg viewBox="0 0 300 200" ref={ref} width={props.width} height={props.height}>
        {renderRect(-1, 0, 0, 300, 200, props.background ?? defaults.background)}
        {cOffsets.map((offset, i) => renderRect(i, csX + i * (wi + padding), offset, wi, cHeight - offset))}
        {sOffsets.map((offset, j) => renderRect(j, offset, sY + j * (wi + padding), sWidth - offset, wi))}
        {cOffsets.map((_, i) =>
          sOffsets.map((_, j) => {
            const filled = j === 2 - i || (i === 3 && j > 0) || (i === 4 && j !== 1) || (i === 5 && j < 2) || i === 6;
            return renderCircle(`${i}-${j}`, csX + i * (wi + padding), sY + j * (wi + padding), wi, filled);
          })
        )}
        {renderRect(1, csX + (wi - lw) / 2 + 3 * (wi + padding), sY + 10 + 1 * (wi + padding), lw, 30)}
        {renderRect(2, csX + (wi - lw) / 2 + 4 * (wi + padding), sY + 10, lw, 60)}
        {renderRect(3, csX + (wi - lw) / 2 + 5 * (wi + padding), sY + 10, lw, 30)}
        {renderRect(4, csX + (wi - lw) / 2 + 6 * (wi + padding), sY + 10, lw, 60)}
      </svg>
    );
  })
);

export { UpSetJSSkeleton };
