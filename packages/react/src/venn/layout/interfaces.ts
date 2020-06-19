/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISets, ISetCombinations } from '../../../../model/dist';

export interface ITextLocation {
  text: { x: number; y: number };
}

export interface ICircle {
  r: number;
  cx: number;
  cy: number;
  angle: number;
}

export interface ITextCircle extends ICircle, ITextLocation {}

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
  sets: ITextCircle[];
  universe?: ITextUniverseSet;
  intersections: ITextArcSlice[];
}
