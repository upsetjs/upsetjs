/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export interface ICircle {
  r: number;
  cx: number;
  cy: number;
  angle: number;
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
  cx: number;
  cy: number;

  x1: number;
  y1: number;
  arcs: ReadonlyArray<IArc>;
}

export interface IUniverseSet extends IArcSlice {
  width: number;
  height: number;
}
