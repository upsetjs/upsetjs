/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { IArcSlice, IUniverseSet } from './interfaces';

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

export function generateArcSlicePath(s: IArcSlice, p = 0) {
  if (s.path) {
    return s.path;
  }
  return `M ${s.x1 - p},${s.y1 - p} ${s.arcs
    .map(
      (arc) =>
        `A ${arc.rx - p} ${arc.ry - p} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${
          arc.x2 - p
        } ${arc.y2 - p}`
    )
    .join(' ')}`;
}
