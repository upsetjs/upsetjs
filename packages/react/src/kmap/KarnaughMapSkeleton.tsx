/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { forwardRef, Ref, memo } from 'react';
import { UpSetJSSkeletonProps, prepare } from '../UpSetJSSkeleton';

/**
 * KV Diagram Skeleton a simple KarnaughMap skeleton
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const KarnaughMapSkeleton: React.FC<UpSetJSSkeletonProps & React.RefAttributes<SVGSVGElement>> = memo(
  forwardRef(function KarnaughMapSkeleton(props: UpSetJSSkeletonProps, ref: Ref<SVGSVGElement>) {
    const { rest } = prepare(props);

    // const padding = 10;
    return (
      <svg viewBox="0 0 300 200" ref={ref} {...rest}>
        TODO
      </svg>
    );
  })
);

export { KarnaughMapSkeleton };
