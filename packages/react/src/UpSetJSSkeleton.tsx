/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { Ref } from 'react';

export interface UpSetJSSkeletonProps extends React.SVGAttributes<SVGSVGElement> {
  background?: string;
  color?: string;
  secondaryColor?: string;
}

const defaults = {
  background: '#F4F4F4',
  color: '#A6A8AB',
  secondaryColor: '#E1E2E3',
};

export function prepare(props: UpSetJSSkeletonProps) {
  const color = props.color ?? defaults.color;
  const secondary = props.secondaryColor ?? defaults.secondaryColor;
  const rest = Object.assign({}, props);
  const background = props.background ?? defaults.background;
  delete rest.color;
  delete rest.secondaryColor;
  delete rest.background;

  if (background) {
    rest.style = Object.assign({ background }, rest.style ?? {});
  }
  return { color, secondary, rest };
}

/**
 * UpSetJS Skeleton a simple UpSetJS skeleton
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const UpSetJSSkeleton = /*!#__PURE__*/ React.memo(
  /*!#__PURE__*/ React.forwardRef(function UpSetJSSkeleton(props: UpSetJSSkeletonProps, ref: Ref<SVGSVGElement>) {
    const { color, secondary, rest } = prepare(props);

    const wi = 20;
    const padding = 10;

    const sWidth = 75;
    const sY = 110;

    const cHeight = 100;
    const csX = 85;

    const cOffsets = [10, 20, 35, 60, 65, 80, 90];
    const sOffsets = [50, 30, 15];

    return (
      <svg viewBox="0 0 300 200" ref={ref} {...rest}>
        {cOffsets.map((offset, i) => (
          <rect key={i} x={csX + i * (wi + padding)} y={offset} width={wi} height={cHeight - offset} fill={color} />
        ))}
        {sOffsets.map((offset, i) => (
          <rect key={i} x={offset} y={sY + i * (wi + padding)} width={sWidth - offset} height={wi} fill={color} />
        ))}

        {cOffsets.map((_, i) =>
          sOffsets.map((_, j) => {
            const filled = j === 2 - i || (i === 3 && j > 0) || (i === 4 && j !== 1) || (i === 5 && j < 2) || i === 6;
            return (
              <circle
                key={`${i}x${j}`}
                cx={csX + i * (wi + padding) + wi / 2}
                cy={sY + j * (wi + padding) + wi / 2}
                r={wi / 2}
                fill={filled ? color : secondary}
              />
            );
          })
        )}
        <rect x="182" y="150" width="6" height="30" fill={color} />
        <rect x="212" y="120" width="6" height="60" fill={color} />
        <rect x="242" y="120" width="6" height="30" fill={color} />
        <rect x="272" y="120" width="6" height="60" fill={color} />
      </svg>
    );
  })
) as React.FC<UpSetJSSkeletonProps & React.RefAttributes<SVGSVGElement>>;

export { UpSetJSSkeleton };
