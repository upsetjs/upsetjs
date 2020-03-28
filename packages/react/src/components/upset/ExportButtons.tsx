import React from 'react';
import { exportSVG } from '../exporter';

function exportChart(evt: React.MouseEvent<SVGElement>) {
  const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
  const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png';
  exportSVG(svg, type);
}

export default function ExportButtons({ transform }: { transform: string }) {
  return (
    <text className="exportButtons" transform={transform}>
      <tspan className="exportButton" onClick={exportChart} data-type="png">
        PNG
      </tspan>{' '}
      <tspan className="exportButton" onClick={exportChart} data-type="svg">
        SVG
      </tspan>
    </text>
  );
}
