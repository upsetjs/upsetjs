import React from 'react';

export default function SelectionPattern(p: {
  id: string;
  suffix: string;
  v: number;
  rotate?: number;
  bgFill?: string;
  bgFilled?: boolean;
  fill?: string;
  styleId: string;
}) {
  if (p.v >= 1 || p.v <= 0) {
    return null;
  }
  const ratio = Math.round(p.v * 10.0) / 100;
  return (
    <defs>
      <pattern
        id={p.id}
        width="1"
        height="0.1"
        patternContentUnits="objectBoundingBox"
        patternTransform={`rotate(${p.rotate ?? 0})`}
      >
        {p.bgFilled && (
          <rect x="0" y="0" width="1" height="0.1" style={{ fill: p.bgFill }} className={`fillPrimary-${p.styleId}`} />
        )}
        <rect
          x="0"
          y="0"
          width="1"
          height={ratio}
          className={`fill${p.suffix}`}
          style={p.fill ? { fill: p.fill } : undefined}
        />
      </pattern>
    </defs>
  );
}
