import { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';

export default function LabelsSelection<T>({
  data,
  size,
  style,
  selection,
}: PropsWithChildren<{
  data: UpSetDataInfo<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  selection: ISetLike<T> | null;
}>) {
  if (!selection || selection.type !== 'set') {
    return null;
  }
  const d = selection;
  return (
    <rect
      y={data.sets.y(d.name)}
      width={size.labels.w + size.combinations.w + size.sets.after}
      height={data.sets.bandWidth}
      className={`selectionHint-${style.id}`}
    />
  );
}
