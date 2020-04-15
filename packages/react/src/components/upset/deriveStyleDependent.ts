import { ReactNode } from 'react';
import { UpSetReactStyles, UpSetStyleClassNames } from '../config';

export default function deriveStyleDependent(
  theme: 'dark' | 'light',
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
    theme,
    styles,
    classNames: classNames,
    cs: {
      name: combinationName,
      offset: combinationNameAxisOffset,
    },
    sets: {
      name: setName,
      offset: setNameAxisOffset,
    },
    emptySelection,
    id: styleId,
    barLabelOffset,
    selectionColor,
  };
}

export declare type UpSetStyleInfo = ReturnType<typeof deriveStyleDependent>;
