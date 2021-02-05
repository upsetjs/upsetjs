/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { CSSProperties, ReactNode } from 'react';
import type { VennDiagramMultiStyle, UpSetThemes } from '../../interfaces';

export default function deriveVennStyleDependent(
  theme: UpSetThemes,
  styles: VennDiagramMultiStyle<CSSProperties>,
  classNames: VennDiagramMultiStyle<string>,
  styleId: string,
  selectionColor: string,
  title: string | ReactNode,
  description: string | ReactNode,
  tooltips: boolean
) {
  return {
    theme,
    styles,
    classNames: classNames,
    id: styleId,
    selectionColor,
    title,
    description,
    tooltips,
  };
}

export declare type VennDiagramStyleInfo = ReturnType<typeof deriveVennStyleDependent>;
