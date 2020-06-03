/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombinations, ISets } from '@upsetjs/model';
import { circleIntersectionPoints } from './math';

export interface ICircle {
  r: number;
  x: number;
  y: number;
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
  arcs: ReadonlyArray<IArc>;
}

export interface IUniverseSet extends IArcSlice {
  width: number;
  height: number;
}
// could be slice of three

export interface IVennDiagramLayout {
  sets: ICircle[];
  universe: IUniverseSet;
  intersections: IArcSlice[];
}

interface IChartArea {
  cx: number;
  cy: number;
  w: number;
  h: number;
  r: number;
}

function one(size: IChartArea): IVennDiagramLayout {
  return {
    sets: [
      {
        r: size.r,
        x: size.cx,
        y: size.cy,
      },
    ],
    universe: {
      // rect without a circle
      width: size.w,
      height: size.h,
      x1: size.cx,
      y1: size.cy - size.r,
      arcs: [
        {
          rx: size.r,
          ry: size.r,
          rotation: 0,
          largeArcFlag: false,
          sweepFlag: false,
          x2: size.cx,
          y2: size.cy + size.r,
        },
        {
          rx: size.r,
          ry: size.r,
          rotation: 0,
          largeArcFlag: false,
          sweepFlag: true,
          x2: size.cx,
          y2: size.cy - size.r,
        },
      ],
    },

    intersections: [],
  };
}

function two(size: IChartArea): IVennDiagramLayout {
  // 3.5 x 2 radi box
  const r = Math.floor(Math.min(size.h / 2, size.w / 3.5));
  const c0: ICircle = {
    r,
    x: size.cx - (3 * r) / 4,
    y: size.cy,
  };
  const c1: ICircle = {
    r,
    x: size.cx + (3 * r) / 4,
    y: size.cy,
  };
  const [p0, p1] = circleIntersectionPoints(c0, c1);
  return {
    sets: [c0, c1],
    universe: {
      // TODO
      // rect without a circle
      width: size.w,
      height: size.h,
      x1: p0.x,
      y1: p0.y,
      arcs: [
        {
          rx: r,
          ry: r,
          rotation: 0,
          largeArcFlag: true,
          sweepFlag: false,
          x2: p1.x,
          y2: p1.y,
        },
        {
          rx: r,
          ry: r,
          rotation: 0,
          largeArcFlag: true,
          sweepFlag: false,
          x2: p0.x,
          y2: p0.y,
        },
      ],
    },
    intersections: [
      {
        x1: p0.x,
        y1: p0.y,
        arcs: [
          {
            rx: r,
            ry: r,
            rotation: 0,
            largeArcFlag: false,
            sweepFlag: false,
            x2: p1.x,
            y2: p1.y,
          },
          {
            rx: r,
            ry: r,
            rotation: 0,
            largeArcFlag: false,
            sweepFlag: false,
            x2: p0.x,
            y2: p0.y,
          },
        ],
      },
    ],
  };
}

export default function vennDiagramLayout<T>(
  sets: ISets<T>,
  _combinations: ISetCombinations<T>,
  size: IChartArea
): IVennDiagramLayout {
  switch (sets.length) {
    case 0:
      return {
        sets: [],
        universe: {
          width: size.w,
          height: size.h,
          x1: 0,
          y1: 0,
          arcs: [],
        },
        intersections: [],
      };
    case 1:
      return one(size);
    case 2:
      return two(size);
    default:
      // TODO
      return two(size);
  }
}
