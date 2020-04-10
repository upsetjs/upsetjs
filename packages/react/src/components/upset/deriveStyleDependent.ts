import { ReactNode } from 'react';
import { UpSetReactStyles, UpSetStyleClassNames } from '../config';

export default function deriveStyleDependent(
  styles: UpSetReactStyles,
  classNames: UpSetStyleClassNames,
  combinationName: string | ReactNode,
  combinationNameAxisOffset: number,
  setName: string | ReactNode,
  setNameAxisOffset: number,
  styleId: string,
  barLabelOffset: number,
  selectionColor: string,
  emptySelection: boolean
) {
  return {
    styles,
    classNames,
    combinationName,
    emptySelection,
    combinationNameAxisOffset,
    setName,
    setNameAxisOffset,
    id: styleId,
    barLabelOffset,
    selectionColor,
  };
}

export declare type UpSetStyleInfo = ReturnType<typeof deriveStyleDependent>;
