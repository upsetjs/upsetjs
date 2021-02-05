/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { Ref } from 'react';
import { UpSetJSSkeletonProps, prepare } from '../UpSetJSSkeleton';
import { layoutImpl } from './layout/vennDiagramLayout';

/**
 * VennDiagram Skeleton a simple VennDiagram skeleton
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const VennDiagramSkeleton = /*!#__PURE__*/ React.memo(
  /*!#__PURE__*/ React.forwardRef(function VennDiagramSkeleton(props: UpSetJSSkeletonProps, ref: Ref<SVGSVGElement>) {
    const { color, secondary, rest } = prepare(props);

    const padding = 10;
    const l = layoutImpl(3, 300 - padding * 2, 3200 - padding * 2);
    return (
      <svg viewBox="0 0 300 200" ref={ref} {...rest}>
        {l.sets.map((set, i) => (
          <circle key={i} cx={set.cx} cy={set.cy + padding} r={set.r} fill={secondary} />
        ))}
        {l.sets.map((set, i) => (
          <circle key={i} cx={set.cx} cy={set.cy + padding} r={set.r} stroke={color} fill="none" />
        ))}
      </svg>
    );
  })
) as React.FC<UpSetJSSkeletonProps & React.RefAttributes<SVGSVGElement>>;

export { VennDiagramSkeleton };
