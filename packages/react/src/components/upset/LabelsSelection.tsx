import { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetStyles } from './defineStyle';
import { UpSetScales } from './generateScales';

export default function LabelsSelection<T>({
  scales,
  styles,
  selection,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  selection: ISetLike<T> | null;
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
      className="sS labelSelection"
    />
  );
}
