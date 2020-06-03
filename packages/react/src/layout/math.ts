/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export function circleIntersectionPoints(
  c0: { x: number; y: number; r: number },
  c1: { x: number; y: number; r: number }
): [{ x: number; y: number }, { x: number; y: number }] {
  const d = Math.sqrt((c0.x - c1.x) ** 2 + (c0.y - c1.y) ** 2);
  // based on http://paulbourke.net/geometry/circlesphere/
  const a = (c0.r * c0.r - c1.r * c1.r + d * d) / (2 * d);

  const x2 = c0.x + (a * (c1.x - c0.x)) / d;
  const y2 = c0.y + (a * (c1.y - c0.y)) / d;
  const h = Math.sqrt(c0.r * c0.r - a * a);

  const x3_1 = x2 - (h * (c1.y - c0.y)) / d;
  const y3_1 = y2 + (h * (c1.x - c0.x)) / d;
  const x3_2 = x2 + (h * (c1.y - c0.y)) / d;
  const y3_2 = y2 - (h * (c1.x - c0.x)) / d;

  return [
    {
      x: x3_1,
      y: y3_1,
    },
    {
      x: x3_2,
      y: y3_2,
    },
  ];
}
