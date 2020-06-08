/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombinations, ISets } from '@upsetjs/model';
import { circleIntersectionPoints } from './math';
import { IArc, IArcSlice, ICircle, IUniverseSet } from './interfaces';

// could be slice of three

export function generateUniverseSetPath(l: IUniverseSet) {
  const { width: w, height: h, x1, y1 } = l;
  const arcs = l.arcs
    .map(
      (arc) =>
        `A ${arc.rx} ${arc.ry} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${arc.x2} ${arc.y2}`
    )
    .join(' ');
  return y1 < h / 2
    ? `M 0 0 L ${x1} 0 L ${x1} ${y1} ${arcs} L ${x1} 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`
    : `M ${w} ${h} L ${x1} ${h} L ${x1} ${y1} ${arcs} L ${x1} ${h} L 0 ${h} L 0 0 L ${w} 0 Z`;
}

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
        angle: 0,
      },
    ],
    universe: {
      // rect without a circle
      width: size.w,
      height: size.h,
      x1: size.cx,
      y1: size.cy - size.r,
      cx: size.cx,
      cy: size.cy,
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

function arc(p1: { x: number; y: number }, r: number, largeArcFlag = false, sweepFlag = false): IArc {
  return {
    rx: r,
    ry: r,
    rotation: 0,
    largeArcFlag,
    sweepFlag,
    x2: p1.x,
    y2: p1.y,
  };
}

function computeCenter(arcs: IArc[]) {
  const sumX = arcs.reduce((acc, a) => acc + a.x2, 0);
  const sumY = arcs.reduce((acc, a) => acc + a.y2, 0);
  return {
    cx: sumX / arcs.length,
    cy: sumY / arcs.length,
  };
}

function arcSlice(p0: { x: number; y: number }, p1: { x: number; y: number }, r: number): IArcSlice {
  const arcs = [arc(p1, r), arc(p0, r)];
  const { cx, cy } = computeCenter(arcs);
  return {
    x1: p0.x,
    y1: p0.y,
    arcs,
    cx,
    cy,
  };
}

function two(size: IChartArea, radiOverlap: number): IVennDiagramLayout {
  // 0.5 radi overlap
  // 3.5 x 2 radi box
  const r = Math.floor(Math.min(size.h / 2, size.w / (4 - radiOverlap)));
  const c0: ICircle = {
    r,
    x: size.cx - r * (1 - radiOverlap),
    y: size.cy,
    angle: 270,
  };
  const c1: ICircle = {
    r,
    x: size.cx + r * (1 - radiOverlap),
    y: size.cy,
    angle: 90,
  };
  const [p0, p1] = circleIntersectionPoints(c0, c1);
  return {
    sets: [c0, c1],
    universe: {
      cx: size.cx,
      cy: size.cy,
      width: size.w,
      height: size.h,
      x1: p0.x,
      y1: p0.y,
      arcs: [arc(p1, r, true), arc(p0, r, true)],
    },
    intersections: [arcSlice(p0, p1, r)],
  };
}

const DEG2RAD = (1 / 180) * Math.PI;

function three(size: IChartArea, radiOverlap: number): IVennDiagramLayout {
  // 3.5 x 2 radi box
  // r + r * (2 - o) * cos(60) + r
  // r (1 + (2- o) * cos(60) + 1)
  const factor = 1 + (2 - radiOverlap * 2) * Math.cos(30 * DEG2RAD) + 1;
  const r = Math.floor(Math.min(size.h / factor, size.w / factor));

  const cx = size.cx;
  const a = r * (2 - radiOverlap * 2);
  const outerRadius = a / Math.sqrt(3);
  const cy = size.h - r - outerRadius; // outer circle

  const offset = outerRadius;

  const c0: ICircle = {
    r,
    x: cx + offset * Math.cos(-90 * DEG2RAD),
    y: cy - offset * Math.sin(-90 * DEG2RAD),
    angle: 180,
  };
  const c1: ICircle = {
    r,
    x: cx - offset * Math.cos(30 * DEG2RAD),
    y: cy - offset * Math.sin(30 * DEG2RAD),
    angle: 300,
  };
  const c2: ICircle = {
    r,
    x: cx - offset * Math.cos(150 * DEG2RAD),
    y: cy - offset * Math.sin(150 * DEG2RAD),
    angle: 60,
  };

  const [p12_0, p12_1] = circleIntersectionPoints(c1, c2);
  const [p20_0, p20_1] = circleIntersectionPoints(c2, c0);
  const [p01_0, p01_1] = circleIntersectionPoints(c0, c1);

  const inner = [arc(p20_0, r, false, true), arc(p01_0, r, false, true), arc(p12_0, r, false, true)];
  return {
    sets: [c0, c1, c2],
    universe: {
      cx: size.cx,
      cy: size.cy,
      width: size.w,
      height: size.h,
      x1: p12_0.x,
      y1: p12_0.y,
      arcs: [arc(p20_0, r, true), arc(p01_0, r, true), arc(p12_0, r, true)],
    },
    intersections: [
      arcSlice(p01_0, p01_1, r),
      arcSlice(p20_0, p20_1, r),
      arcSlice(p12_0, p12_1, r),
      Object.assign(
        {
          x1: p12_0.x,
          y1: p12_0.y,
          arcs: inner,
        },
        computeCenter(inner)
      ),
    ],
  };
}

export default function vennDiagramLayout<T>(
  sets: ISets<T>,
  _combinations: ISetCombinations<T>,
  size: IChartArea,
  radiOverlap = 0.25
): IVennDiagramLayout {
  switch (sets.length) {
    case 0:
      return {
        sets: [],
        universe: {
          cx: size.cx,
          cy: size.cy,
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
      return two(size, radiOverlap);
    default:
      return three(size, radiOverlap);
  }
}
