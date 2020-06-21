/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { circleIntersectionPoints, DEG2RAD, pointAtCircle } from './math';
import { IArc, ITextArcSlice, ITextCircle, IVennDiagramLayout, IVennDiagramLayoutGenerator } from './interfaces';
import { ISets, ISetCombinations } from '@upsetjs/model';

// could be slice of three

interface IChartArea {
  cx: number;
  cy: number;
  w: number;
  h: number;
  r: number;
}

function one(size: IChartArea): IVennDiagramLayout {
  const p0 = {
    cx: size.cx,
    cy: size.cy - size.r,
  };
  const p1 = {
    cx: size.cx,
    cy: size.cy + size.r,
  };
  return {
    sets: [
      {
        r: size.r,
        cx: size.cx,
        cy: size.cy,
        angle: 180,
        text: pointAtCircle(size.cx, size.cy, size.r * 1.1, 120 - 90),
      },
    ],
    universe: {
      // rect without a circle
      width: size.w,
      height: size.h,
      x1: p0.cx,
      y1: p0.cy,
      // universe at lower left corner
      text: {
        x: (size.w - size.r * 2) / 2,
        y: size.h - (size.h - size.r * 2) / 2,
      },
      angle: 90,
      arcs: [arc(p1, size.r), arc(p0, size.r)],
    },
    intersections: [
      {
        x1: p0.cx,
        y1: p0.cy,
        text: {
          x: size.cx,
          y: size.cy,
        },
        arcs: [arc(p1, size.r), arc(p0, size.r)],
      },
    ],
  };
}

function arc(p1: { cx: number; cy: number }, r: number, largeArcFlag = false, sweepFlag = false): IArc {
  return {
    rx: r,
    ry: r,
    rotation: 0,
    largeArcFlag,
    sweepFlag,
    x2: p1.cx,
    y2: p1.cy,
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

function arcSlice(p0: { cx: number; cy: number }, p1: { cx: number; cy: number }, r: number): ITextArcSlice {
  const arcs = [arc(p1, r), arc(p0, r)];
  const { cx, cy } = computeCenter(arcs);
  return {
    x1: p0.cx,
    y1: p0.cy,
    arcs,
    text: { x: cx, y: cy },
  };
}

function arcCenter(p1: { cx: number; cy: number }, arcs: IArc[]): ITextArcSlice {
  const center = computeCenter(arcs);
  return {
    x1: p1.cx,
    y1: p1.cy,
    arcs,
    text: {
      x: center.cx,
      y: center.cy,
    },
  };
}

function two(size: IChartArea, radiOverlap: number): IVennDiagramLayout {
  // 0.5 radi overlap
  // 3.5 x 2 radi box
  const r = Math.floor(Math.min(size.h / 2, size.w / (4 - radiOverlap)));
  const wRest = size.w - r * 3.5;

  const c0x = size.cx - r * (1 - radiOverlap);
  const c0: ITextCircle = {
    r,
    cx: c0x,
    cy: size.cy,
    angle: 270,
    text: pointAtCircle(c0x, size.cy, r * 1.1, 300 - 90),
  };

  const c1x = size.cx + r * (1 - radiOverlap);
  const c1: ITextCircle = {
    r,
    cx: c1x,
    cy: size.cy,
    angle: 90,
    text: pointAtCircle(c1x, size.cy, r * 1.1, 60 - 90),
  };
  const [p0, p1] = circleIntersectionPoints(c0, c1);
  return {
    sets: [c0, c1],
    universe: {
      width: size.w,
      height: size.h,
      x1: p0.cx,
      y1: p0.cy,
      // universe at lower left corner
      angle: 90,
      text: { x: wRest / 2, y: size.h - (size.h - size.r * 2) / 2 },
      arcs: [arc(p1, r, true), arc(p0, r, true)],
    },
    intersections: [
      {
        x1: p0.cx,
        y1: p0.cy,
        arcs: [arc(p1, r, false, true), arc(p0, r, true)],
        text: {
          x: c0x,
          y: size.cy,
        },
      },
      {
        x1: p0.cx,
        y1: p0.cy,
        arcs: [arc(p1, r, true, false), arc(p0, r, false, true)],
        text: {
          x: c1x,
          y: size.cy,
        },
      },
      arcSlice(p0, p1, r),
    ],
  };
}

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

  const c0x = cx + offset * Math.cos(-90 * DEG2RAD);
  const c0y = cy - offset * Math.sin(-90 * DEG2RAD);
  const c0: ITextCircle = {
    r,
    cx: c0x,
    cy: c0y,
    angle: 180,
    text: pointAtCircle(c0x, c0y, r * 1.1, 120 - 90),
  };

  const c1x = cx - offset * Math.cos(30 * DEG2RAD);
  const c1y = cy - offset * Math.sin(30 * DEG2RAD);
  const c1: ITextCircle = {
    r,
    cx: c1x,
    cy: c1y,
    angle: 300,
    text: pointAtCircle(c1x, c1y, r * 1.1, 300 - 90),
  };

  const c2x = cx - offset * Math.cos(150 * DEG2RAD);
  const c2y = cy - offset * Math.sin(150 * DEG2RAD);
  const c2: ITextCircle = {
    r,
    cx: c2x,
    cy: c2y,
    angle: 60,
    text: pointAtCircle(c2x, c2y, r * 1.1, 60 - 90),
  };

  const [p12_0, p12_1] = circleIntersectionPoints(c1, c2);
  const [p20_0, p20_1] = circleIntersectionPoints(c2, c0);
  const [p01_0, p01_1] = circleIntersectionPoints(c0, c1);

  return {
    sets: [c0, c1, c2],
    universe: {
      text: {
        x: (size.cx - r) / 2,
        y: size.h - (size.cy - r) / 2,
      },
      angle: 90,
      width: size.w,
      height: size.h,
      x1: p12_0.cx,
      y1: p12_0.cy,
      arcs: [arc(p20_0, r, true), arc(p01_0, r, true), arc(p12_0, r, true)],
    },
    intersections: [
      {
        x1: p01_1.cx,
        y1: p01_1.cy,
        arcs: [arc(p12_0, r), arc(p20_1, r), arc(p01_1, r, true, true)],
        text: {
          x: c0x,
          y: c0y,
        },
      },
      {
        x1: p12_1.cx,
        y1: p12_1.cy,
        arcs: [arc(p20_0, r), arc(p01_1, r), arc(p12_1, r, true, true)],
        text: {
          x: c1x,
          y: c1y,
        },
      },
      {
        x1: p20_1.cx,
        y1: p20_1.cy,
        arcs: [arc(p01_0, r), arc(p12_1, r), arc(p20_1, r, true, true)],
        text: {
          x: c2x,
          y: c2y,
        },
      },
      arcCenter(p20_0, [arc(p01_1, r), arc(p12_0, r), arc(p20_0, r, false, true)]),
      arcCenter(p12_0, [arc(p20_1, r), arc(p01_0, r), arc(p12_0, r, false, true)]),
      arcCenter(p01_0, [arc(p12_1, r), arc(p20_0, r), arc(p01_0, r, false, true)]),
      arcCenter(p12_0, [arc(p20_0, r, false, true), arc(p01_0, r, false, true), arc(p12_0, r, false, true)]),
    ],
  };
}

export function vennDiagramLayout(sets: number, size: IChartArea, radiOverlap = 0.25): IVennDiagramLayout {
  switch (sets) {
    case 0:
      return {
        sets: [],
        universe: {
          text: {
            x: size.cx,
            y: size.cy,
          },
          angle: 0,
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

export function createVennDiagramLayoutFunction(radiOverlap = 0.25): IVennDiagramLayoutGenerator {
  return {
    maxSets: 3,
    compute<T>(sets: ISets<T>, _combinations: ISetCombinations<T>, width: number, height: number) {
      const size: IChartArea = {
        w: width,
        h: height,
        cx: width / 2,
        cy: height / 2,
        r: Math.min(width, height) / 2,
      };
      return vennDiagramLayout(sets.length, size, radiOverlap);
    },
  };
}
