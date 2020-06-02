export function baseRules(
  styleId: string,
  textColor: string,
  color: string,
  selectionColor: string,
  fontFamily?: string | false,
  fontTitle?: string,
  fontDescription?: string,
  fontLegend?: string,
  fontExportLabel?: string
) {
  return `
  .root-${styleId} {
    ${fontFamily ? `font-family: ${fontFamily};` : ''}
  }
  .titleTextStyle-${styleId} {
    fill: ${textColor};
    ${fontTitle ? `font-size: ${fontTitle};` : ''}
  }
  .descTextStyle-${styleId} {
    fill: ${textColor};
    ${fontDescription ? `font-size: ${fontDescription};` : ''}
  }

  .legendTextStyle-${styleId} {
    fill: ${textColor};
    ${fontLegend ? `font-size: ${fontLegend};` : ''}
    text-anchor: middle;
    dominant-baseline: hanging;
    pointer-events: none;
  }
  .startText-${styleId} {
    text-anchor: start;
  }
  .endText-${styleId} {
    text-anchor: end;
  }
  .pnone-${styleId} {
    pointer-events: none;
  }
  .fillPrimary-${styleId} { fill: ${color}; }
  .fillSelection-${styleId} { fill: ${selectionColor}; }
  .fillTransparent-${styleId} { fill: transparent; }

  .selectionHint-${styleId} {
    fill: transparent;
    pointer-events: none;
    stroke: ${selectionColor};
  }
  .clickAble-${styleId} {
    cursor: pointer;
  }

  .exportTextStyle-${styleId} {
    fill: ${textColor};
    ${fontExportLabel ? `font-size: ${fontExportLabel};` : ''}
  }
  .exportButtons-${styleId} {
    text-anchor: middle;
  }
  .exportButton-${styleId} {
    cursor: pointer;
    opacity: 0.5;
  }
  .exportButton-${styleId}:hover {
    opacity: 1;
  }
  .exportButton-${styleId} > rect {
    fill: none;
    stroke: ${textColor};
  }
  `;
}
