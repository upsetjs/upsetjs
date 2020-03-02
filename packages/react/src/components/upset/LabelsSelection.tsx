import type { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import type { UpSetStyles } from './defineStyle';
import type { UpSetScales } from './generateScales';

export default function LabelsSelection<T>({
  scales,
  styles,
  selection,
  selectionColor,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  selection: ISetLike<T> | null;
  selectionColor: string;
}>) {
  if (!selection || selection.type !== 'set') {
    return null;
  }
  const d = selection;
  return (
    <rect
      y={scales.sets.y(d.name)}
      width={styles.labels.w + styles.combinations.w}
      height={scales.sets.y.bandwidth()}
      style={{ stroke: selectionColor, fill: 'none', pointerEvents: 'none' }}
    />
  );
}
