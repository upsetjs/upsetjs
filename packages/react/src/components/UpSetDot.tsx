/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { mergeColor } from './utils';

const UpSetDot = /*!#__PURE__*/ React.memo(function UpSetDot({
  cx,
  r,
  cy,
  name,
  className,
  style,
  fill,
}: PropsWithChildren<{
  r: number;
  cx: number;
  cy: number;
  className: string;
  fill?: string;
  name: string;
  style?: React.CSSProperties;
}>) {
  return (
    <circle r={r} cx={cx} cy={cy} className={className} style={mergeColor(style, fill)}>
      {name && <title>{name}</title>}
    </circle>
  );
});

export default UpSetDot;
