/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';

const UpSetDot = React.memo(function UpSetDot({
  cx,
  r,
  cy,
  name,
  className,
  style,
}: PropsWithChildren<{
  r: number;
  cx: number;
  cy: number;
  className: string;
  name: string;
  style?: React.CSSProperties;
}>) {
  return (
    <circle r={r} cx={cx} cy={cy} className={className} style={style}>
      <title>{name}</title>
    </circle>
  );
});

export default UpSetDot;
