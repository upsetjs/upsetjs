/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { exportSVG, exportVegaLite } from '../../exporter';

function exportChart(evt: React.MouseEvent<SVGElement>) {
  const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
  const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'vega';
  if (type === 'vega') {
    exportVegaLite(svg);
    return;
  }
  exportSVG(svg, {
    type,
    toRemove: `.${evt.currentTarget.getAttribute('class')}`,
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
      <g className={`exportButton-${styleId}`} onClick={exportChart} data-type="vega" transform="translate(-84, 0)">
        <title>Download VEGA-Lite Specification</title>
        <rect y={-9} width={32} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={16}>
          VEGA
        </text>
      </g>
    </g>
  );
}
