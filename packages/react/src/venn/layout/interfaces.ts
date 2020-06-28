/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISets, ISetCombinations } from '@upsetjs/model';

export interface ITextLocation {
  text: { x: number; y: number };
}

export interface ICircle {
  r: number;
  cx: number;
  cy: number;
}
export interface IEllipse {
  rx: number;
  ry: number;
  rotation: number;
  cx: number;
  cy: number;
}

export interface ITextCircle extends ICircle, ITextLocation {
  align: 'start' | 'end' | 'middle';
  verticalAlign: 'top' | 'bottom';
}
export interface ITextEllipse extends IEllipse, ITextLocation {
  align: 'start' | 'end' | 'middle';
  verticalAlign: 'top' | 'bottom';
}

// could be slice
export interface IArc {
  rx: number;
  ry: number;
  rotation: number;
  x2: number;
  y2: number;
  sweepFlag: boolean;
  largeArcFlag: boolean;
}

export interface IArcSlice {
  x1: number;
  y1: number;
  arcs: readonly IArc[];
  path?: string;
}

export interface ITextArcSlice extends IArcSlice, ITextLocation {}

export interface IUniverseSet extends IArcSlice {
  width: number;
  height: number;
  angle: number;
}

export interface ITextUniverseSet extends IUniverseSet, ITextLocation {}

export interface IVennDiagramLayoutGenerator {
  readonly maxSets: number;
  compute<T>(sets: ISets<T>, combinations: ISetCombinations<T>, width: number, height: number): IVennDiagramLayout;
}

export interface IVennDiagramLayout {
  sets: (ITextCircle | ITextEllipse)[];
  universe?: ITextUniverseSet;
  intersections: ITextArcSlice[];
}

export function isEllipse(d: ICircle | IEllipse): d is ITextEllipse {
  return typeof (d as ITextEllipse).rx === 'number';
}
