import React, { PropsWithChildren } from 'react';

const UpSetDot = React.memo(function UpSetDot({
  cx,
  r,
  cy,
  name,
  clazz,
  style,
  interactive = true,
}: PropsWithChildren<{
  r: number;
  cx: number;
  cy: number;
  clazz: string;
  name: string;
  interactive?: boolean;
  style?: React.CSSProperties;
}>) {
  return (
    <circle r={r} cx={cx} cy={cy} className={`${clazz}${!interactive ? ' pnone' : ''}`} style={style}>
      <title>{name}</title>
    </circle>
  );
});

export default UpSetDot;
