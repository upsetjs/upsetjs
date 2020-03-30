import React from 'react';
import { exportSVG } from '@upsetjs/ui-utils';

function exportChart(evt: React.MouseEvent<SVGElement>) {
  const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
  const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png';
  exportSVG(svg, { type, toRemove: '.exportButtons', theme: svg.dataset.theme as 'light' | 'dark' });
}

export default function ExportButtons({ transform }: { transform: string }) {
  return (
    <g className="exportButtons" transform={transform}>
      <g className="exportButton" onClick={exportChart} data-type="png" transform="translate(-50, 0)">
        <title>Download PNG Image</title>
        <rect y={-9} width={24} height={11} rx={2} ry={2} />
        <text x={12}>PNG</text>
      </g>
      <g className="exportButton" onClick={exportChart} data-type="svg" transform="translate(-24, 0)">
        <title>Download SVG Image</title>
        <rect y={-9} width={24} height={11} rx={2} ry={2} />
        <text x={12}>SVG</text>
      </g>
    </g>
  );
}
