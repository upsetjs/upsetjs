/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { generateId } from './utils';

export default function deriveVennSizeDependent(width: number, height: number, margin: number, id: string) {
  const h = height - 2 * margin;
  const w = width - 2 * margin;
  return {
    id: id ? id : generateId(),
    legend: {
      x: width / 2,
    },
    margin: margin,
    w: width,
    h: height,
  };
}

export declare type VennDiagramSizeInfo = ReturnType<typeof deriveVennSizeDependent>;
