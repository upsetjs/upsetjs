/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback } from 'react';
import { exportSVG, exportVegaLite } from '../exporter';
import { exportDump, exportSharedLink } from '../exporter/exportDump';
import { UpSetProps, UpSetExportOptions } from '../interfaces';
import { UpSetDataInfo } from './deriveDataDependent';

export default function ExportButtons({
  transform,
  styleId,
  exportButtons,
  props,
  data,
}: {
  transform: string;
  styleId: string;
  exportButtons?: boolean | UpSetExportOptions;
  props: UpSetProps<any>;
  data: UpSetDataInfo<any>;
}) {
  const exportChart = useCallback(
    (evt: React.MouseEvent<SVGElement>) => {
      const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
      const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'vega' | 'dump' | 'share';
      switch (type) {
        case 'vega':
          exportVegaLite(svg);
          break;
        case 'dump':
          exportDump(svg, props, data);
          break;
        case 'share':
          exportSharedLink(props, data);
          break;
        case 'svg':
        case 'png':
          exportSVG(svg, {
            type,
            toRemove: `.${evt.currentTarget.getAttribute('class')}`,
          });
      }
    },
    [data, props]
  );
  if (!exportButtons) {
    return null;
  }
  const svgWidth = 26;
  const pngWidth = 26;
  const vegaWidth = 34;
  const dumpWidth = 34;
  const shareWidth = 42;
  const space = 2;
  let acc = 0;
  const buttons: React.ReactNode[] = [];
  if (exportButtons === true || exportButtons.svg) {
    acc += svgWidth;
    buttons.push(
      <g
        key="svg"
        className={`exportButton-${styleId}`}
        onClick={exportChart}
        data-type="svg"
        transform={`translate(-${acc}, 0)`}
      >
        <title>Download SVG Image</title>
        <rect y={-9} width={svgWidth} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={svgWidth / 2}>
          SVG
        </text>
      </g>
    );
    acc += space;
  }
  if (exportButtons === true || exportButtons.png) {
    acc += pngWidth;
    buttons.push(
      <g
        key="png"
        className={`exportButton-${styleId}`}
        onClick={exportChart}
        data-type="png"
        transform={`translate(-${acc}, 0)`}
      >
        <title>Download PNG Image</title>
        <rect y={-9} width={pngWidth} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={pngWidth / 2}>
          PNG
        </text>
      </g>
    );
    acc += space;
  }
  if (exportButtons === true || exportButtons.vega) {
    acc += vegaWidth;
    buttons.push(
      <g
        key="vega"
        className={`exportButton-${styleId}`}
        onClick={exportChart}
        data-type="vega"
        transform={`translate(-${acc}, 0)`}
      >
        <title>Download VEGA-Lite Specification</title>
        <rect y={-9} width={vegaWidth} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={vegaWidth / 2}>
          VEGA
        </text>
      </g>
    );
    acc += space;
  }
  if (exportButtons === true || exportButtons.vega) {
    acc += dumpWidth;
    buttons.push(
      <g
        key="dump"
        className={`exportButton-${styleId}`}
        onClick={exportChart}
        data-type="dump"
        transform={`translate(-${acc}, 0)`}
      >
        <title>Download UpSet.js JSON Dump</title>
        <rect y={-9} width={dumpWidth} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={dumpWidth / 2}>
          DUMP
        </text>
      </g>
    );
    acc += space;
  }
  if (exportButtons === true || exportButtons.share) {
    acc += shareWidth;
    buttons.push(
      <g
        key="dump"
        className={`exportButton-${styleId}`}
        onClick={exportChart}
        data-type="share"
        transform={`translate(-${acc}, 0)`}
      >
        <title>Open a shareable URL</title>
        <rect y={-9} width={shareWidth} height={11} rx={2} ry={2} />
        <text className={`exportTextStyle-${styleId}`} x={shareWidth / 2}>
          SHARE
        </text>
      </g>
    );
    acc += space;
  }
  return (
    <g className={`exportButtons-${styleId}`} transform={transform}>
      {buttons}
    </g>
  );
}
