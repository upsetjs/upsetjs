/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetCombinations, ISets } from '@upsetjs/model';
import type { IVennDiagramLayoutGenerator, ITextCircle } from './interfaces';
import { DEG2RAD, pointAtCircle } from './math';

export interface IVennJSSetOverlap {
  sets: readonly string[];
  size: number;
  weight?: number;
}

export interface IVennJSArc {
  circle: { x: number; y: number; radius: number };
  width: number;
  p1: { x: number; y: number };
  p2: { x: number; y: number };
}

export interface IVennJSVennLayout {
  data: IVennJSSetOverlap;
  text: { x: number; y: number };
  circles: readonly { x: number; y: number; radius: number; set: string }[];
  arcs: readonly IVennJSArc[];
  path?: string;
  distinctPath?: string;
}

export interface IVennJSLayoutFunction<O extends { width?: number; height?: number; distinct?: boolean }> {
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
    compute<T>(sets: ISets<T>, combinations: ISetCombinations<T>, width: number, height: number) {
      const overlaps = combinations.map((c) => ({ sets: Array.from(c.sets).map((s) => s.name), size: c.cardinality }));
      const r = layout(
        overlaps,
        Object.assign(
          ({} as unknown) as O,
          {
            width,
            height,
            distinct: true,
          },
          options ?? {}
        )
      );

      const singleSets = r.filter((d) => d.data.sets.length === 1);
      const setNames = new Map(sets.map((d, i) => [d.name, i]));
      const setCircles = singleSets.map((d) => d.circles[0]);
      const eulerCenter = center(setCircles);

      const asArc = (a: IVennJSArc) => ({
        x2: a.p1.x,
        y2: a.p1.y,
        cx: a.circle.x,
        cy: a.circle.y,
        sweep: true,
        large: a.width > a.circle.radius,
        ref: setCircles.findIndex((d) => Math.abs(d.x - a.circle.x) < 0.05 && Math.abs(d.y - a.circle.y) < 0.05),
        mode: 'i' as 'i',
      });

      return {
        sets: singleSets.map((d) => {
          const c = d.circles[0];
          const angle = angleAtCircle(c, eulerCenter);
          return {
            cx: c.x,
            cy: c.y,
            r: c.radius,
            align: angle > 90 ? 'end' : 'start',
            verticalAlign: 'bottom',
            text: pointAtCircle(c.x, c.y, c.radius * 1.1, angle),
          } as ITextCircle;
        }),
        intersections: r.map((d) => {
          const arcs = d.arcs;
          const text = {
            x: d.text.x,
            y: d.text.y,
          };
          if (arcs.length === 0) {
            return {
              sets: d.data.sets.map((s) => setNames.get(s)!),
              text,
              x1: 0,
              y1: 0,
              arcs: [],
            };
          }
          if (arcs.length === 1) {
            const c = d.arcs[0].circle;
            return {
              sets: d.data.sets.map((s) => setNames.get(s)!),
              text,
              x1: d.arcs[0].p2.x,
              y1: c.y - c.radius,
              arcs: [asArc(d.arcs[0]), Object.assign(asArc(d.arcs[0]), { y2: c.y - c.radius })],
              path: d.distinctPath || d.path,
            };
          }
          return {
            sets: d.data.sets.map((s) => setNames.get(s)!),
            text,
            x1: d.arcs[0].p2.x,
            y1: d.arcs[0].p2.y,
            arcs: d.arcs.map((e) => asArc(e)),
            path: d.distinctPath || d.path,
          };
        }),
      };
    },
  };
}
