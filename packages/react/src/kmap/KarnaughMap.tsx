/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React, { Ref, useMemo } from 'react';
import { fillKarnaughMapDefaults } from '../fillDefaults';
import useHandler from '../hooks/useHandler';
import type { KarnaughMapProps } from '../interfaces';
import { baseRules } from '../rules';
import { generateId, generateSelectionName, parseFontSize } from '../utils';
import SVGWrapper from '../venn/components/SVGWrapper';
import deriveVennSizeDependent from '../venn/derive/deriveVennSizeDependent';
import { useExportChart } from '../venn/hooks';
import KMapChart from './components/KMapChart';
import KMapQueries from './components/KMapQueries';
import KMapSelection from './components/KMapSelection';
import deriveKarnaughDataDependent from './derive/deriveDataDependent';
import deriveKarnaughStyleDependent from './derive/deriveStyleDependent';
import UpSetTitle from '../components/UpSetTitle';

export const KarnaughMap = /*!#__PURE__*/ React.forwardRef(function KarnaughMap<T = any>(
  props: KarnaughMapProps<T>,
  ref: Ref<SVGSVGElement>
) {
  const p = fillKarnaughMapDefaults<T>(props);
  const { queries = [], fontSizes, selection = null } = p;
  // generate a "random" but attribute stable id to avoid styling conflicts
  const styleId = useMemo(
    () =>
      p.id
        ? p.id
        : generateId([
            p.fontFamily,
            fontSizes.axisTick,
            fontSizes.barLabel,
            fontSizes.legend,
            fontSizes.setLabel,
            fontSizes.title,
            fontSizes.exportLabel,
            fontSizes.description,
            p.textColor,
            p.color,
            p.hasSelectionColor,
            p.strokeColor,
            p.selectionColor,
            p.opacity,
            p.hasSelectionOpacity,
          ]),
    [
      p.id,
      p.fontFamily,
      fontSizes.axisTick,
      fontSizes.barLabel,
      fontSizes.legend,
      fontSizes.setLabel,
      fontSizes.title,
      fontSizes.exportLabel,
      fontSizes.description,
      p.textColor,
      p.color,
      p.hasSelectionColor,
      p.strokeColor,
      p.selectionColor,
      p.opacity,
      p.hasSelectionOpacity,
    ]
  );

  const style = useMemo(
    () =>
      deriveKarnaughStyleDependent(
        p.theme,
        p.styles,
        p.classNames,
        p.combinationName,
        p.combinationNameAxisOffset,
        styleId,
        p.barLabelOffset,
        p.selectionColor,
        p.emptySelection,
        p.title,
        p.description,
        p.tooltips
      ),
    [
      p.theme,
      p.styles,
      p.classNames,
      p.combinationName,
      p.combinationNameAxisOffset,
      styleId,
      p.barLabelOffset,
      p.selectionColor,
      p.emptySelection,
      p.title,
      p.description,
      p.tooltips,
    ]
  );

  const size = useMemo(() => deriveVennSizeDependent(p.width, p.height, p.padding, p.id), [
    p.width,
    p.height,
    p.padding,
    p.id,
  ]);

  const data = useMemo(
    () =>
      deriveKarnaughDataDependent(
        p.sets,
        p.combinations,
        size,
        p.numericScale,
        p.barLabelOffset + parseFontSize(fontSizes.barLabel),
        p.barPadding,
        parseFontSize(fontSizes.setLabel),
        parseFontSize(fontSizes.axisTick),
        p.toKey,
        p.toElemKey,
        p.id,
        p.combinationMaxScale
      ),
    [
      p.sets,
      p.combinations,
      size,
      p.numericScale,
      p.barLabelOffset,
      fontSizes.barLabel,
      p.barPadding,
      fontSizes.axisTick,
      fontSizes.setLabel,
      p.toKey,
      p.toElemKey,
      p.id,
      p.combinationMaxScale,
    ]
  );

  const h = useHandler(p);
  const selectionName = generateSelectionName(selection);

  const rulesHelper = baseRules(styleId, p, p.fontFamily, fontSizes);

  const rules = `
  ${rulesHelper.root}
  ${rulesHelper.text}

  .axisTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.axisTick)}
    text-anchor: end;
  }
  .barTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.barLabel)}
    text-anchor: middle;
  }
  .setTextStyle-${style.id} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.setLabel)}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .cChartTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.chartLabel)}
  }

  .not-${style.id} {
    text-decoration: overline;
  }

  .axisLine-${styleId} {
    fill: none;
    stroke: ${p.textColor};
  }

  .gridStyle-${style.id} {
    fill: none;
    stroke: ${p.strokeColor};
    stroke-linecap: round;
  }
  .gridStyle-${style.id}-1 {
    stroke-width: 2;
  }
  .gridStyle-${style.id}-2 {
    stroke-width: 3;
  }

  ${rulesHelper.fill}
  ${rulesHelper.export}

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${data.id} {
    fill: ${q.color};
  }`
    )
    .join('\n')}
  `;

  const exportChart = useExportChart(data, p, 'kmap');
  const maxWidth = data.sets.l.reduce((acc, d) => Math.min(acc, d.text[0].x - data.sets.labelHeight), size.area.w);

  return (
    <SVGWrapper
      rules={rules}
      style={style}
      size={size}
      p={p}
      data={data}
      tRef={ref}
      selectionName={selectionName}
      h={h}
      exportChart={exportChart}
    >
      <UpSetTitle style={style} width={maxWidth} />
      <KMapChart style={style} data={data} h={h} size={size} />
      <KMapSelection style={style} data={data} hasHover={h.hasHover} selection={selection} />
      <KMapQueries
        style={style}
        data={data}
        hasHover={h.hasHover}
        queries={queries}
        secondary={h.hasHover || selection != null}
      />
    </SVGWrapper>
  );
});

/**
 * KarnaughMap main pure functional stateless React component, the generic argument T refers to the type of the elements
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
export default KarnaughMap as <T>(p: KarnaughMapProps<T> & React.RefAttributes<SVGSVGElement>) => React.ReactElement;
