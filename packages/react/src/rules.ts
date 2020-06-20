import { UpSetBaseFontSizes, UpSetBaseThemeProps } from './interfaces';

function propRule(value: string | number | undefined | false, prop = 'font-size') {
  return value ? `${prop}: ${value};` : '';
}

export function baseRules(
  styleId: string,
  theme: Required<UpSetBaseThemeProps>,
  fontFamily: string | false,
  fontSizes: UpSetBaseFontSizes
) {
  const hasS: string[] = [];
  if (theme.hasSelectionColor) {
    hasS.push(`fill: ${theme.hasSelectionColor};`);
  }
  if (theme.hasSelectionOpacity != null && theme.hasSelectionOpacity >= 0) {
    hasS.push(`fill-opacity: ${theme.hasSelectionOpacity};`);
  }
  return {
    p: propRule,
    root: `
  .root-${styleId} {
    ${propRule(fontFamily, 'font-family')}
  }
  `,
    text: `
  .titleTextStyle-${styleId} {
    fill: ${theme.textColor};
    ${propRule(fontSizes.title)}
  }
  .descTextStyle-${styleId} {
    fill: ${theme.textColor};
    ${propRule(fontSizes.description)}
  }

  .legendTextStyle-${styleId} {
    fill: ${theme.textColor};
    ${propRule(fontSizes.legend)}
    text-anchor: middle;
    dominant-baseline: hanging;
    pointer-events: none;
  }
  `,
    hasSFill: hasS.join(' '),
    hasSStroke: hasS.join(' ').replace('fill:', 'stroke:').replace('fill-', 'stroke-'),
    fill: `
  .fillPrimary-${styleId} { fill: ${theme.color}; fill-opacity: ${theme.opacity}; }
  ${hasS.length > 0 ? `.root-${styleId}[data-selection] .fillPrimary-${styleId} { ${hasS.join(' ')} }` : ''}
  ${theme.selectionColor ? `.fillSelection-${styleId} { fill: ${theme.selectionColor}; }` : ''}
  .fillTransparent-${styleId} { fill: transparent; }

  .selectionHint-${styleId} {
    fill: transparent;
    pointer-events: none;
    ${propRule(theme.selectionColor, 'stroke')}
  }
  .clickAble-${styleId} {
    cursor: pointer;
  }

  .startText-${styleId} {
    text-anchor: start;
  }
  .endText-${styleId} {
    text-anchor: end;
  }
  .pnone-${styleId} {
    pointer-events: none;
  }`,
    export: `
  .exportTextStyle-${styleId} {
    fill: ${theme.textColor};
    ${propRule(fontSizes.exportLabel)}
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
    stroke: ${theme.textColor};
  }
  `,
  };
}
