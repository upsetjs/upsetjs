/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { CSSProperties, ReactNode } from 'react';
import { UpSetMultiStyle, UpSetStyleClassNames, UpSetThemes } from '../interfaces';

export default function deriveStyleDependent(
  theme: UpSetThemes,
  styles: UpSetMultiStyle<CSSProperties>,
  classNames: UpSetStyleClassNames,
  combinationName: string | ReactNode,
  combinationNameAxisOffset: number | 'auto',
  setName: string | ReactNode,
  setNameAxisOffset: number | 'auto',
  styleId: string,
  barLabelOffset: number,
  selectionColor: string,
  emptySelection: boolean,
  title: string | ReactNode,
  description: string | ReactNode,
  tooltips: boolean
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
    title,
    description,
    tooltips,
  };
}

export declare type UpSetStyleInfo = ReturnType<typeof deriveStyleDependent>;
