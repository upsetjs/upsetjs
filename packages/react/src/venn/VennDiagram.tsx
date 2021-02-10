/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import { isSet, isSetLike } from '@upsetjs/model';
import React, { Ref, useMemo } from 'react';
import { fillVennDiagramDefaults } from '../fillDefaults';
import type { VennDiagramProps } from '../interfaces';
import { clsx, generateSelectionName, generateSelectionOverlap } from '../utils';
import SVGWrapper from './components/SVGWrapper';
import VennArcSliceSelection from './components/VennArcSliceSelection';
import deriveVennDataDependent from './derive/deriveVennDataDependent';
import { useCreateCommon, useExportChart } from './hooks';
import UpSetTitle from '../components/UpSetTitle';
import { isEllipse } from './layout/interfaces';

export const VennDiagram = /*!#__PURE__*/ React.forwardRef(function VennDiagram<T = any>(
  props: VennDiagramProps<T>,
  ref: Ref<SVGSVGElement>
) {
  const p = fillVennDiagramDefaults<T>(props);
  const { selection = null, queries = [], fontSizes } = p;
  const v = useCreateCommon(p);
  const { size, style, rulesHelper } = v;

  const dataInfo = useMemo(
    () => deriveVennDataDependent(p.sets, p.combinations, size, p.layout, p.valueFormat, p.toKey, p.toElemKey, p.id),
    [p.sets, p.combinations, size, p.valueFormat, p.toKey, p.toElemKey, p.id, p.layout]
  );

  const selectionKey = selection != null && isSetLike(selection) ? p.toKey(selection) : null;
  const selectionOverlap =
    selection == null ? null : generateSelectionOverlap(selection, dataInfo.overlapGuesser, dataInfo.toElemKey);
  const selectionName = generateSelectionName(selection);

  const rules = `
  ${rulesHelper.root}
  ${rulesHelper.text}

  .valueTextStyle-${style.id} {
    fill: ${p.valueTextColor};
    ${rulesHelper.p(fontSizes.valueLabel)}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .setTextStyle-${style.id} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.setLabel)}
    text-anchor: middle;
  }

  .topText-${style.id} {
    dominant-baseline: hanging;
  }

  .stroke-circle-${style.id} {
    fill: none;
    stroke: ${p.strokeColor};
  }

  .arc-${style.id} {
    fill-rule: evenodd;
  }
  .arcP-${style.id} {
    fill: transparent;
    fill-opacity: ${p.opacity};
  }
  ${rulesHelper.fill}
  ${rulesHelper.export}

  ${rulesHelper.hasSFill ? `.root-${style.id}[data-selection] .arcP-${style.id} { ${rulesHelper.hasSFill} }` : ''}

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${dataInfo.id} {
    fill: ${q.color};
  }`
    )
    .join('\n')}
  `;

  const exportChart = useExportChart(dataInfo, p, 'venn');

  const maxWidth = dataInfo.sets.d.reduce(
    (acc, d) => Math.min(acc, d.l.cx - (isEllipse(d.l) ? d.l.rx : d.l.r)),
    size.area.w
  );

  return (
    <SVGWrapper
      rules={rules}
      style={style}
      selectionName={selectionName}
      size={size}
      p={p}
      data={dataInfo}
      tRef={ref}
      h={v.h}
      exportChart={exportChart}
    >
      <UpSetTitle style={style} width={maxWidth} />
      <g className={clsx(p.onClick && `clickAble-${style.id}`)}>
        {dataInfo.sets.d.map((d, i) => (
          <text
            key={d.key}
            x={d.l.text.x}
            y={d.l.text.y}
            onClick={v.h.onClick(dataInfo.sets.v[i], [])}
            onMouseEnter={v.h.onMouseEnter(dataInfo.sets.v[i], [])}
            onMouseLeave={v.h.onMouseLeave}
            onContextMenu={v.h.onContextMenu(dataInfo.sets.v[i], [])}
            onMouseMove={v.h.onMouseMove(dataInfo.sets.v[i], [])}
            className={clsx(
              `setTextStyle-${style.id}`,
              `${d.l.align}Text-${style.id}`,
              `${d.l.verticalAlign}Text-${style.id}`
            )}
          >
            {dataInfo.sets.v[i].name}
          </text>
        ))}
      </g>
      <g className={clsx(p.onClick && `clickAble-${style.id}`)}>
        {dataInfo.cs.d.map((l, i) => (
          <VennArcSliceSelection
            key={l.key}
            d={l.v}
            i={i}
            slice={l.l}
            size={size}
            style={style}
            data={dataInfo}
            fill={p.filled}
            h={v.h}
            selectionName={selectionName}
            selected={selectionKey === l.key || (isSet(selection) && dataInfo.cs.has(l.v, selection))}
            elemOverlap={selectionOverlap}
            queries={queries}
            qs={v.qs}
          />
        ))}
      </g>
      <g>
        {dataInfo.sets.d.map((l) =>
          isEllipse(l.l) ? (
            <ellipse
              key={l.key}
              rx={l.l.rx}
              ry={l.l.ry}
              transform={`translate(${l.l.cx},${l.l.cy})rotate(${l.l.rotation})`}
              className={clsx(`stroke-circle-${style.id}`, style.classNames.set)}
              style={style.styles.set}
            />
          ) : (
            <circle
              key={l.key}
              cx={l.l.cx}
              cy={l.l.cy}
              r={l.l.r}
              className={clsx(`stroke-circle-${style.id}`, style.classNames.set)}
              style={style.styles.set}
            />
          )
        )}
      </g>
    </SVGWrapper>
  );
});

/**
 * VennDiagram main pure functional stateless React component, the generic argument T refers to the type of the elements
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
export default VennDiagram as <T>(p: VennDiagramProps<T> & React.RefAttributes<SVGSVGElement>) => React.ReactElement;
