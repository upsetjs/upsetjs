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

function generateId(width: number, height: number) {
  return `clip-w${Math.round(width)}-h${Math.round(height)}-${Math.random().toString(36).slice(4)}`;
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
    fontSizes,
    classNames,
    styles: cStyles,
    childrenFactories,
    fontFamily,
    widthRatios,
    heightRatios,
    barLabelOffset,
    setNameAxisOffset,
    queries = [],
    dotPadding,
    queryLegend,
    exportButtons,
    numericScale,
    bandScale,
    setAddons,
    combinationAddons,
  } = fillDefaults(props);

  const cs = areCombinations(combinations) ? combinations : generateCombinations(sets, combinations);
  const styles = React.useMemo(
    () => defineStyle({ width, height, margin, barPadding, widthRatios, heightRatios, setAddons, combinationAddons }),
    [width, height, margin, barPadding, widthRatios, heightRatios, setAddons, combinationAddons]
  );
  const clipId = React.useMemo(() => generateId(styles.labels.w, styles.sets.h), [styles.labels.w, styles.sets.h]);
  const scales = React.useMemo(
    () =>
      generateScales(
        sets,
        cs,
        styles,
        numericScale,
        bandScale,
        barLabelOffset + Number.parseInt(fontSizes.barLabel ?? '10')
      ),
    [sets, cs, styles, numericScale, bandScale, barLabelOffset, fontSizes.barLabel]
  );

  const r = (Math.min(scales.sets.y.bandwidth(), scales.combinations.x.bandwidth()) / 2) * dotPadding;

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
  .hoverBarTextStyle {
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
    fill: ${hoverHintColor};
    display: none;
  }
  .setTextStyle {
    ${fontSizes.setLabel ? `font-size: ${fontSizes.setLabel};` : ''}
  }
  .chartTextStyle {
    ${fontSizes.chartLabel ? `font-size: ${fontSizes.chartLabel};` : ''}
  }
  .exportTextStyle {
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
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
  .hangingText {
    dominant-baseline: hanging;
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

  .hoverOnly {
    display: none;
  }

  .interactive:hover > .hoverBar {
    // filter: drop-shadow(0 0 2px #cccccc);
    stroke: ${hoverHintColor};
  }
  .interactive:hover > .hoverBarTextStyle {
    display: unset;
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
  const triangleSize = Math.max(
    2,
    (Math.min(scales.sets.y.bandwidth(), scales.combinations.x.bandwidth()) / 2) * barPadding
  );

  return (
    <svg className={className} style={style} width={width} height={height} ref={ref} data-theme={theme ?? 'light'}>
      <style>{rules}</style>
      <defs>
        <clipPath id={clipId}>
          <rect x={styles.sets.w} y={0} width={styles.labels.w} height={styles.sets.h} />
        </clipPath>
      </defs>
      {queryLegend && (
        <QueryLegend
          queries={queries}
          transform={`translate(${styles.legend.x},4)`}
          className={classNames.legend}
          style={cStyles.legend}
        />
      )}
      {exportButtons && <ExportButtons transform={`translate(${styles.w - 2},${styles.h - 3})`} />}
      <g transform={`translate(${margin},${margin})`}>
        {onClick && (
          <rect
            width={styles.combinations.x}
            height={styles.sets.y}
            onClick={() => onClick(null)}
            className="fillTransparent"
          />
        )}
        <UpSetAxis
          combinationName={combinationName}
          combinationNameAxisOffset={combinationNameAxisOffset}
          setNameAxisOffset={setNameAxisOffset}
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
          clipId={clipId}
          childrens={childrenFactories}
          barLabelOffset={barLabelOffset}
          setAddons={setAddons}
          combinationAddons={combinationAddons}
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
          setAddons={setAddons}
          combinationAddons={combinationAddons}
        />
        <UpSetQueries
          cs={cs}
          scales={scales}
          sets={sets}
          styles={styles}
          onHover={onHover}
          queries={queries}
          secondary={onHover != null || selection != null}
          triangleSize={triangleSize}
          cStyles={cStyles}
          classNames={classNames}
          setAddons={setAddons}
          combinationAddons={combinationAddons}
        />
      </g>
      {props.children}
    </svg>
  );
}) as <T>(p: UpSetProps<T> & React.RefAttributes<SVGSVGElement>) => React.ReactElement;
