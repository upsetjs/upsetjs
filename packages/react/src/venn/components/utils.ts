import { IArcSlice } from '../layout/interfaces';

export function generateArcSlicePath(slice: IArcSlice) {
  return `M ${slice.x1},${slice.y1} ${slice.arcs
    .map(
      (arc) =>
        `A ${arc.rx} ${arc.ry} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${arc.x2} ${arc.y2}`
    )
    .join(' ')}`;
}
