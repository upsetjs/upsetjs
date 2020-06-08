/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

declare type Point = { cx: number; cy: number };

function len(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}

function dist(a: Point, b: Point) {
  return len(a.cx - b.cx, a.cy - b.cy);
}

export function circleIntersectionPoints(
  c0: { cx: number; cy: number; r: number },
  c1: { cx: number; cy: number; r: number }
): [Point, Point] {
  const d = dist(c0, c1);
  // based on http://paulbourke.net/geometry/circlesphere/
  const a = (c0.r * c0.r - c1.r * c1.r + d * d) / (2 * d);

  const x2 = c0.cx + (a * (c1.cx - c0.cx)) / d;
  const y2 = c0.cy + (a * (c1.cy - c0.cy)) / d;
  const h = Math.sqrt(c0.r * c0.r - a * a);

  const x3_1 = x2 - (h * (c1.cy - c0.cy)) / d;
  const y3_1 = y2 + (h * (c1.cx - c0.cx)) / d;
  const x3_2 = x2 + (h * (c1.cy - c0.cy)) / d;
  const y3_2 = y2 - (h * (c1.cx - c0.cx)) / d;

  return [
    {
      cx: x3_1,
      cy: y3_1,
    },
    {
      cx: x3_2,
      cy: y3_2,
    },
  ];
}
