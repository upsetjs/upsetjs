/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import type { UpSetExportOptions } from '../interfaces';

export default function ExportButtons({
  transform,
  styleId,
  exportButtons,
  exportChart,
}: {
  transform: string;
  styleId: string;
  exportButtons?: boolean | UpSetExportOptions;
  exportChart: (evt: React.MouseEvent<SVGElement>) => void;
}) {
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
  if (exportButtons === true || exportButtons.svg !== false) {
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
  if (exportButtons === true || exportButtons.png !== false) {
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
  if (exportButtons === true || exportButtons.vega !== false) {
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
  if (exportButtons === true || exportButtons.dump !== false) {
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
  if (exportButtons === true || exportButtons.share !== false) {
    acc += shareWidth;
    buttons.push(
      <g
        key="share"
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
