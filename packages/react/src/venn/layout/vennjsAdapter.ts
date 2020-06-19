/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombinations, ISets } from '@upsetjs/model';
import { IVennDiagramLayoutGenerator } from './interfaces';
import { DEG2RAD, pointAtCircle } from './math';

export interface IVennJSSetOverlap {
  sets: readonly string[];
  size: number;
  weight?: number;
}

export interface IVennJSVennLayout {
  data: IVennJSSetOverlap;
  text: { x: number; y: number };
  circles: readonly { x: number; y: number; radius: number; set: string }[];
  arcs: readonly {
    circle: { x: number; y: number; radius: number };
    width: number;
    p1: { x: number; y: number };
    p2: { x: number; y: number };
  }[];
}

export interface IVennJSLayoutFunction<O extends { width?: number; height?: number }> {
  (data: readonly IVennJSSetOverlap[], options: O): readonly IVennJSVennLayout[];
}

export function center(circles: readonly { x: number; y: number; radius: number }[]) {
  const sumX = circles.reduce((acc, a) => acc + a.x, 0);
  const sumY = circles.reduce((acc, a) => acc + a.y, 0);
  return {
    x: sumX / circles.length,
    y: sumY / circles.length,
  };
}

function angleAtCircle(p: { x: number; y: number }, c: { x: number; y: number }) {
  const x = p.x - c.x;
  const y = p.y - c.y;
  return Math.atan2(y, x) / DEG2RAD;
}

export function createVennJSAdapter<O extends { width?: number; height?: number }>(
  layout: IVennJSLayoutFunction<O>,
  options?: O
): IVennDiagramLayoutGenerator {
  return {
    maxSets: Infinity,
    compute<T>(_sets: ISets<T>, combinations: ISetCombinations<T>, width: number, height: number) {
      const overlaps = combinations.map((c) => ({ sets: Array.from(c.sets).map((s) => s.name), size: c.cardinality }));
      const r = layout(
        overlaps,
        Object.assign(
          ({} as unknown) as O,
          {
            width,
            height,
          },
          options ?? {}
        )
      );

      const singleSets = r.filter((d) => d.data.sets.length === 1);
      const eulerCenter = center(singleSets.map((d) => d.circles[0]));

      return {
        sets: singleSets.map((d) => {
          const c = d.circles[0];
          const angle = angleAtCircle(c, eulerCenter);
          return {
            cx: c.x,
            cy: c.y,
            r: c.radius,
            angle: angle + 90,
            text: pointAtCircle(c.x, c.y, c.radius * 1.1, angle),
          };
        }),
        intersections: r.map((d) => {
          const arcs = d.arcs;
          const text = {
            x: d.text.x,
            y: d.text.y,
          };
          if (arcs.length === 0) {
            return {
              text,
              x1: 0,
              y1: 0,
              arcs: [],
            };
          }
          if (arcs.length === 1) {
            const c = arcs[0].circle;
            return {
              text,
              x1: c.x,
              y1: c.y - c.radius,
              arcs: [
                {
                  cx: c.x,
                  cy: c.y,
                  rx: c.radius,
                  ry: c.radius,
                  rotation: 0,
                  x2: c.x,
                  y2: c.y + c.radius,
                  largeArcFlag: false,
                  sweepFlag: false,
                  mode: 'inside',
                },
                {
                  cx: c.x,
                  cy: c.y,
                  rx: c.radius,
                  ry: c.radius,
                  rotation: 0,
                  x2: c.x,
                  y2: c.y - c.radius,
                  largeArcFlag: false,
                  sweepFlag: false,
                  mode: 'inside',
                },
              ],
            };
          }
          return {
            text,
            x1: d.arcs[0].p2.x,
            y1: d.arcs[0].p2.y,
            arcs: d.arcs.map((a) => ({
              rx: a.circle.radius,
              ry: a.circle.radius,
              rotation: 0,
              x2: a.p1.x,
              y2: a.p1.y,
              cx: a.circle.x,
              cy: a.circle.y,
              sweepFlag: true,
              largeArcFlag: a.width > a.circle.radius,
              mode: 'inside',
            })),
          };
        }),
      };
    },
  };
}
