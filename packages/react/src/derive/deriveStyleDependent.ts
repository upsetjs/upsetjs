/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { CSSProperties, ReactNode } from 'react';
import type { UpSetLayoutProps, UpSetMultiStyle, UpSetStyleClassNames, UpSetThemes } from '../interfaces';

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
  tooltips: boolean,
  setLabelAlignment: NonNullable<UpSetLayoutProps['setLabelAlignment']>
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
    setLabelAlignment,
  };
}

export declare type UpSetStyleInfo = ReturnType<typeof deriveStyleDependent>;
