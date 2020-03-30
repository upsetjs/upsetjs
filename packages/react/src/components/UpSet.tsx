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
    labelStyle,
    fontSize,
    axisFontSize,
    setLabelStyle,
    combinationNameStyle,
    setNameStyle,
    axisStyle,
    widthRatios,
    heightRatios,
    queries = [],
    queryLegend,
    exportButtons,
    linearScaleFactory,
    bandScaleFactory,
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
  const scales = React.useMemo(() => generateScales(sets, cs, styles, linearScaleFactory, bandScaleFactory), [
    sets,
    cs,
    styles,
    linearScaleFactory,
    bandScaleFactory,
  ]);

  const r = (Math.min(scales.sets.y.bandwidth(), scales.combinations.x.bandwidth()) / 2) * (1 - styles.padding);

  const rules = `
  .labelStyle {
    font-size: ${axisFontSize};
    font-family: sans-serif;
    fill: ${textColor};
  }
  .nameStyle {
    font-size: ${fontSize};
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
  .fillAlternating { fill: ${alternatingBackgroundColor}; }
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

  .legend {
    text-anchor: middle;
    dominant-baseline: hanging;
    pointer-events: none;
  }

  .interactive:hover > rect {
    // filter: drop-shadow(0 0 2px #cccccc);
    stroke: ${hoverHintColor};
  }

  .exportButtons {
    text-anchor: middle;
    font-size: 10px;
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
  .exportButton > text {
    fill: ${textColor};
  }
  `;

  return (
    <svg className={className} style={style} width={width} height={height} ref={ref} data-theme={theme ?? 'light'}>
      <style>{rules}</style>
      {queryLegend && <QueryLegend queries={queries} transform={`translate(${styles.legend.x},2)`} />}
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
          axisStyle={axisStyle}
          combinationNameStyle={combinationNameStyle}
          setNameStyle={setNameStyle}
        />
        <UpSetChart
          cs={cs}
          r={r}
          scales={scales}
          sets={sets}
          styles={styles}
          labelStyle={labelStyle}
          onClick={onClick}
          onHover={onHover}
          setLabelStyle={setLabelStyle}
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
        />
        <UpSetSelection
          cs={cs}
          scales={scales}
          sets={sets}
          styles={styles}
          onHover={onHover}
          selection={selection}
          triangleSize={triangleSize}
        />
      </g>
      {props.children}
    </svg>
  );
});
