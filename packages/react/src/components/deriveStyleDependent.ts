/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ReactNode } from 'react';
import { UpSetReactStyles, UpSetStyleClassNames } from '../UpSetJS';

export default function deriveStyleDependent(
  theme: 'dark' | 'light',
  styles: UpSetReactStyles,
  classNames: UpSetStyleClassNames,
  combinationName: string | ReactNode,
  combinationNameAxisOffset: number | 'auto',
  setName: string | ReactNode,
  setNameAxisOffset: number | 'auto',
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
