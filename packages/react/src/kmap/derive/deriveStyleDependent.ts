/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { CSSProperties, ReactNode } from 'react';
import { UpSetThemes, KarnaughMapMultiStyle } from '../../interfaces';

export default function deriveStyleDependent(
  theme: UpSetThemes,
  styles: KarnaughMapMultiStyle<CSSProperties>,
  classNames: KarnaughMapMultiStyle<string>,
  combinationName: string | ReactNode,
  combinationNameAxisOffset: number | 'auto',
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
    emptySelection,
    id: styleId,
    barLabelOffset,
    selectionColor,
    title,
    description,
    tooltips,
    cs: {
      name: combinationName,
      offset: combinationNameAxisOffset,
    },
  };
}

export declare type KMapStyleInfo = ReturnType<typeof deriveStyleDependent>;
