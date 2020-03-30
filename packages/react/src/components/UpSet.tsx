import { generateCombinations, GenerateSetCombinationsOptions, ISetCombinations } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { fillDefaults, UpSetProps } from './config';
import defineStyle from './upset/defineStyle';
import ExportButtons from './upset/ExportButtons';
import generateScales from './upset/generateScales';
import QueryLegend from './upset/QueryLegend';
import UpSetAxis from './upset/UpSetAxis';
import UpSetChart from './upset/UpSetChart';
import UpSetQueries from './upset/UpSetQueries';
import UpSetSelection from './upset/UpSetSelection';

function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

export default React.forwardRef(function UpSet<T>(
  props: PropsWithChildren<UpSetProps<T>>,
  ref: React.Ref<SVGSVGElement>
) {
  const {
    className,
    style,
    width,
    height,
    padding: margin,
    barPadding,
    sets,
    combinations,
    selection = null,
    onClick,
    onHover,
    theme,
    combinationName,
    combinationNameAxisOffset,
    setName,
    selectionColor,
    color,
    textColor,
    hoverHintColor,
    notMemberColor,
    alternatingBackgroundColor,
    triangleSize,
    fontSizes,
    classNames,
    styles: cStyles,
    fontFamily,
    widthRatios,
    heightRatios,
    queries = [],
    queryLegend,
    exportButtons,
    numericScale,
    bandScale,
  } = fillDefaults(props);

  const cs = areCombinations(combinations) ? combinations : generateCombinations(sets, combinations);
  const styles = React.useMemo(() => defineStyle({ width, height, margin, barPadding, widthRatios, heightRatios }), [
    width,
    height,
    margin,
    barPadding,
    widthRatios,
    heightRatios,
  ]);
  const scales = React.useMemo(() => generateScales(sets, cs, styles, numericScale, bandScale), [
    sets,
    cs,
    styles,
    numericScale,
    bandScale,
  ]);

  const r = (Math.min(scales.sets.y.bandwidth(), scales.combinations.x.bandwidth()) / 2) * (1 - styles.padding);

  const rules = `
  .textStyle {
    ${fontFamily ? `font-family: ${fontFamily};` : ''}
    fill: ${textColor};
  }
  .axisTextStyle {
    ${fontSizes.axisTick ? `font-size: ${fontSizes.axisTick};` : ''}
  }
  .barTextStyle {
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
  }
  .setTextStyle {
    ${fontSizes.setLabel ? `font-size: ${fontSizes.setLabel};` : ''}
  }
  .chartTextStyle {
    ${fontSizes.chartLabel ? `font-size: ${fontSizes.chartLabel};` : ''}
  }
  .legendTextStyle {
    ${fontSizes.legend ? `font-size: ${fontSizes.legend};` : ''}
    text-anchor: middle;
    dominant-baseline: hanging;
    pointer-events: none;
  }
  .middleText {
    text-anchor: middle;
  }
  .startText {
    text-anchor: start;
  }
  .endText {
    text-anchor: end;
  }
  .centralText {
    dominant-baseline: central;
  }
  .upsetLine {
    stroke-width: ${r * 0.6};
  }
  .pnone {
    pointer-events: none;
  }
  .fillPrimary { fill: ${color}; }
  .fillSelection { fill: ${selectionColor}; }
  .fillNotMember { fill: ${notMemberColor}; }
  .fillAlternating { fill: ${alternatingBackgroundColor || 'transparent'}; }
  .fillNone { fill: none; }
  .fillTransparent { fill: transparent; }
  ${queries.map((q, i) => `.fillQ${i} { fill: ${q.color}; }`).join('\n')}

  .strokePrimary { stroke: ${color}; }
  .strokeSelection { stroke: ${selectionColor}; }

  .strokeScaledSelection { stroke-width: ${r * 0.6 * 1.1}; }

  .axisLine {
    fill: none;
    stroke: ${textColor};
  }
  .clickAble {
    cursor: pointer;
  }

  .interactive:hover > rect {
    // filter: drop-shadow(0 0 2px #cccccc);
    stroke: ${hoverHintColor};
  }

  .exportButtons {
    text-anchor: middle;
  }
  .exportButton {
    cursor: pointer;
    opacity: 0.5;
  }
  .exportButton:hover {
    opacity: 1;
  }
  .exportButton > rect {
    fill: none;
    stroke: ${textColor};
  }
  `;

  return (
    <svg className={className} style={style} width={width} height={height} ref={ref} data-theme={theme ?? 'light'}>
      <style>{rules}</style>
      {queryLegend && (
        <QueryLegend
          queries={queries}
          transform={`translate(${styles.legend.x},2)`}
          className={classNames.legend}
          style={cStyles.legend}
        />
      )}
      {exportButtons && <ExportButtons transform={`translate(${styles.w - 2},${styles.h - 3})`} />}
      <g transform={`translate(${margin},${margin})`}>
        {onClick && (
          <rect
            width={styles.sets.w + styles.labels.w}
            height={styles.combinations.h}
            onClick={() => onClick(null)}
            className="fillTransparent"
          />
        )}
        <UpSetAxis
          combinationName={combinationName}
          combinationNameAxisOffset={combinationNameAxisOffset}
          scales={scales}
          setName={setName}
          styles={styles}
          cStyles={cStyles}
          classNames={classNames}
        />
        <UpSetChart
          cs={cs}
          r={r}
          scales={scales}
          sets={sets}
          styles={styles}
          onClick={onClick}
          onHover={onHover}
          cStyles={cStyles}
          classNames={classNames}
        />
        <UpSetQueries
          cs={cs}
          scales={scales}
          sets={sets}
          styles={styles}
          onHover={onHover}
          queries={queries}
          secondary={selection != null}
          triangleSize={triangleSize}
          cStyles={cStyles}
          classNames={classNames}
        />
        <UpSetSelection
          cs={cs}
          scales={scales}
          sets={sets}
          styles={styles}
          onHover={onHover}
          selection={selection}
          triangleSize={triangleSize}
          cStyles={cStyles}
          classNames={classNames}
        />
      </g>
      {props.children}
    </svg>
  );
});
