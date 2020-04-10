import { generateCombinations, GenerateSetCombinationsOptions, ISetCombinations } from '@upsetjs/model';
import React, { PropsWithChildren, useMemo } from 'react';
import { fillDefaults, UpSetProps } from './config';
import defineStyle from './upset/defineStyle';
import ExportButtons from './upset/ExportButtons';
import generateScales from './upset/generateScales';
import QueryLegend from './upset/QueryLegend';
import UpSetAxis from './upset/UpSetAxis';
import UpSetChart from './upset/UpSetChart';
import UpSetQueries from './upset/UpSetQueries';
import UpSetSelection from './upset/UpSetSelection';
import { clsx } from './upset/utils';

function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

function generateId(_args: any) {
  return `upset-${Math.random().toString(36).slice(4)}`;
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

  // generate a "random" but attribute stable id to avoid styling conflicts
  const styleId = useMemo(
    () =>
      generateId([
        fontFamily,
        fontSizes,
        textColor,
        hoverHintColor,
        color,
        selectionColor,
        notMemberColor,
        alternatingBackgroundColor,
      ]),
    [
      fontFamily,
      fontSizes,
      textColor,
      hoverHintColor,
      color,
      selectionColor,
      notMemberColor,
      alternatingBackgroundColor,
    ]
  );

  const styles = React.useMemo(
    () =>
      defineStyle({
        width,
        height,
        margin,
        barPadding,
        widthRatios,
        heightRatios,
        setAddons,
        combinationAddons,
        styleId,
      }),
    [width, height, margin, barPadding, widthRatios, heightRatios, setAddons, combinationAddons, styleId]
  );
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

  const sizeId = React.useMemo(() => generateId([styles.labels.w, styles.sets.h, r, queries]), [
    styles.labels.w,
    styles.sets.h,
    r,
    queries,
  ]);
  const rules = `
  .root-${styleId} {
    ${fontFamily ? `font-family: ${fontFamily};` : ''}
  }
  .axisTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.axisTick ? `font-size: ${fontSizes.axisTick};` : ''}
    text-anchor: middle;
  }
  .barTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
  }
  .cBarTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
    text-anchor: middle;
  }
  .sBarTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
    text-anchor: end;
    dominant-baseline: central;
  }
  .hoverBarTextStyle-${styleId} {
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
    fill: ${hoverHintColor};
    display: none;
    text-anchor: middle;
  }
  .setTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.setLabel ? `font-size: ${fontSizes.setLabel};` : ''}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .cChartTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.chartLabel ? `font-size: ${fontSizes.chartLabel};` : ''}
    text-anchor: middle;
  }
  .sChartTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.chartLabel ? `font-size: ${fontSizes.chartLabel};` : ''}
    text-anchor: middle;
    dominant-baseline: hanging;
  }
  .exportTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.barLabel ? `font-size: ${fontSizes.barLabel};` : ''}
  }
  .legendTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSizes.legend ? `font-size: ${fontSizes.legend};` : ''}
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
  .fillNotMember-${styleId} { fill: ${notMemberColor}; }
  .fillAlternating-${styleId} { fill: ${alternatingBackgroundColor || 'transparent'}; }
  .fillTransparent-${styleId} { fill: transparent; }

  .selectionHint-${styleId} {
    fill: transparent;
    pointer-events: none;
    stroke: ${selectionColor};
  }

  .axisLine-${styleId} {
    fill: none;
    stroke: ${textColor};
  }
  .clickAble-${styleId} {
    cursor: pointer;
  }

  .hoverBar-${styleId} {
    fill: transparent;
  }

  .interactive-${styleId}:hover > .hoverBar-${styleId} {
    stroke: ${hoverHintColor};
  }
  .interactive-${styleId}:hover > .hoverBarTextStyle-${styleId} {
    display: unset;
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

  .upsetLine-${sizeId} {
    stroke-width: ${r * 0.6};
    stroke: ${color};
  }

  .upsetSelectionLine-${sizeId} {
    stroke-width: ${r * 0.6 * 1.1};
    stroke: ${selectionColor};
    pointer-events: none;
  }
  ${queries.map((q, i) => `.fillQ${i}-${sizeId} { fill: ${q.color}; }`).join('\n')}

  `;

  const triangleSize = Math.max(
    2,
    (Math.min(scales.sets.y.bandwidth(), scales.combinations.x.bandwidth()) / 2) * barPadding
  );

  return (
    <svg
      className={clsx(`root-${styleId}`, className)}
      style={style}
      width={width}
      height={height}
      ref={ref}
      data-theme={theme ?? 'light'}
    >
      <style>{rules}</style>
      <defs>
        <clipPath id={sizeId}>
          <rect x={styles.sets.w} y={0} width={styles.labels.w} height={styles.sets.h} />
        </clipPath>
      </defs>
      {queryLegend && (
        <QueryLegend
          queries={queries}
          transform={`translate(${styles.legend.x},4)`}
          className={classNames.legend}
          style={cStyles.legend}
          styles={styles}
        />
      )}
      {exportButtons && <ExportButtons transform={`translate(${styles.w - 2},${styles.h - 3})`} styleId={styleId} />}
      <g transform={`translate(${margin},${margin})`}>
        {onClick && (
          <rect
            width={styles.combinations.x}
            height={styles.sets.y}
            onClick={() => onClick(null)}
            className={`fillTransparent-${styles.styleId}`}
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
          setAddons={setAddons}
          combinationAddons={combinationAddons}
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
          clipId={sizeId}
          childrens={childrenFactories}
          barLabelOffset={barLabelOffset}
          setAddons={setAddons}
          combinationAddons={combinationAddons}
        />
        <UpSetSelection
          cs={cs}
          scales={scales}
          selectionColor={selectionColor}
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
