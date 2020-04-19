import React from 'react';
import { exportSVG } from '../../exporter';

function exportChart(evt: React.MouseEvent<SVGElement>) {
  const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
  const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png';
  exportSVG(svg, {
    type,
    toRemove: `.${evt.currentTarget.getAttribute('class')}`,
    theme: svg.dataset.theme as 'light' | 'dark',
  });
}

export default function ExportButtons({ transform, styleId }: { transform: string; styleId: string }) {
  return (
    <g className={`exportButtons-${styleId}`} transform={transform}>
      <g className={`exportButton-${styleId}`} onClick={exportChart} data-type="png" transform="translate(-50, 0)">
        <title>Download PNG Image</title>
        <rect y={-9} width={24} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={12}>
          PNG
        </text>
      </g>
      <g className={`exportButton-${styleId}`} onClick={exportChart} data-type="svg" transform="translate(-24, 0)">
        <title>Download SVG Image</title>
        <rect y={-9} width={24} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={12}>
          SVG
        </text>
      </g>
    </g>
  );
}
