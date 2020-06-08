import { IArcSlice, ICircle } from '../layout/interfaces';

export function generateArcSlicePath(slice: IArcSlice) {
  return `M ${slice.x1},${slice.y1} ${slice.arcs
    .map(
      (arc) =>
        `A ${arc.rx} ${arc.ry} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${arc.x2} ${arc.y2}`
    )
    .join(' ')}`;
}

export function generatePieSlice(c: ICircle, ratio: number, _secondary?: boolean) {
  if (ratio <= 0) {
    return '';
  }
  if (ratio >= 1) {
    return `M ${c.x} ${c.y - c.r} A ${c.r} ${c.r} 0 1 0 ${c.x} ${c.y + c.r} A ${c.r} ${c.r} 0 1 0 ${c.x} ${c.y - c.r}`;
  }
  const pt = (angle: number) => ({
    x: c.x + Math.cos(angle) * c.r,
    y: c.y + Math.sin(angle) * c.r,
  });
  const deg2rad = Math.PI / 180;
  const span = 360 * ratio;
  const start = (c.align === 'center' ? 0 : c.align === 'left' ? 270 : 90) - 90 + (360 - span) / 2;
  const end = start + span;

  const startPt = pt(start * deg2rad);
  const endPt = pt(end * deg2rad);
  return `M ${c.x} ${c.y} L ${startPt.x} ${startPt.y} A ${c.r} ${c.r} 0 ${ratio > 0.5 ? 1 : 0} 1 ${endPt.x} ${
    endPt.y
  } Z`;
}
