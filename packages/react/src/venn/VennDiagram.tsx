/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { isSet } from '@upsetjs/model';
import React, { forwardRef, Ref, useMemo } from 'react';
import { fillVennDiagramDefaults } from '../fillDefaults';
import { VennDiagramProps } from '../interfaces';
import { clsx } from '../utils';
import SVGWrapper from './components/SVGWrapper';
import VennArcSliceSelection from './components/VennArcSliceSelection';
import deriveVennDataDependent from './derive/deriveVennDataDependent';
import { useCreateCommon, useExportChart } from './hooks';

const VennDiagram = forwardRef(function VennDiagram<T = any>(props: VennDiagramProps<T>, ref: Ref<SVGSVGElement>) {
  const p = fillVennDiagramDefaults<T>(props);
  const { selection = null, queries = [], fontSizes } = p;
  const v = useCreateCommon(p);
  const { size, style, rulesHelper } = v;

  const dataInfo = useMemo(
    () => deriveVennDataDependent(p.sets, p.combinations, size, p.layout, p.valueFormat, p.toKey, p.toElemKey, p.id),
    [p.sets, p.combinations, size, p.valueFormat, p.toKey, p.toElemKey, p.id, p.layout]
  );

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
    dominant-baseline: central;
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

  const exportChart = useExportChart(dataInfo, p);

  return (
    <SVGWrapper
      rules={rules}
      style={style}
      selectionName={v.selectionName}
      size={size}
      p={p}
      data={dataInfo}
      tRef={ref}
      h={v.h}
      exportChart={exportChart}
    >
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
              d.l.angle > 200 && `endText-${style.id}`,
              d.l.angle < 200 && `startText-${style.id}`
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
            h={v.h}
            selectionName={v.selectionName}
            selected={v.selectionKey === l.key || (isSet(selection) && dataInfo.cs.has(l.v, selection))}
            elemOverlap={v.selectionOverlap}
            queries={queries}
            qs={v.qs}
          />
        ))}
      </g>
      <g>
        {dataInfo.sets.d.map((l) => (
          <circle
            key={l.key}
            cx={l.l.cx}
            cy={l.l.cy}
            r={l.l.r}
            className={clsx(`stroke-circle-${style.id}`, style.classNames.set)}
            style={style.styles.set}
          />
        ))}
      </g>
    </SVGWrapper>
  );
});

export { VennDiagram };
