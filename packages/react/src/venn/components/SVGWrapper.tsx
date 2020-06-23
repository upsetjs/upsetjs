/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { ISetCombinations } from '@upsetjs/model';
import React, { Ref } from 'react';
import ExportButtons from '../../components/ExportButtons';
import QueryLegend from '../../components/QueryLegend';
import UpSetTitle from '../../components/UpSetTitle';
import { VennDiagramFullProps } from '../../interfaces';
import { useExportChart, CreateCommon } from '../hooks';
import { clsx } from '../../utils';

export interface SVGWrapperData {
  id: string;
  cs: { v: ISetCombinations<any> };
  sets: { format(v: number): string };
}

export default function SVGWrapper({
  rules,
  p,
  data,
  tRef,
  children,
  v,
}: React.PropsWithChildren<{
  rules: string;
  v: CreateCommon;
  p: Omit<VennDiagramFullProps, 'valueFormat'>;
  data: SVGWrapperData;
  tRef: Ref<SVGSVGElement>;
}>) {
  const exportChart = useExportChart(data, p);

  return (
    <svg
      id={p.id}
      className={clsx(`root-${v.style.id}`, p.className)}
      style={p.style}
      width={p.width}
      height={p.height}
      ref={tRef}
      viewBox={`0 0 ${p.width} ${p.height}`}
      data-theme={p.theme ?? 'light'}
      data-selection={v.selectionName ? v.selectionName : undefined}
    >
      <style>{rules}</style>
      {p.queryLegend && <QueryLegend queries={p.queries ?? []} x={v.size.legend.x} style={v.style} data={data} />}
      <ExportButtons
        transform={`translate(${v.size.w - 2},${v.size.h - 3})`}
        styleId={v.style.id}
        exportButtons={v.exportButtons}
        exportChart={exportChart}
      />
      <g transform={`translate(${p.padding},${p.padding})`} data-upset="base">
        {p.onClick && (
          <rect width={v.size.w} height={v.size.h} onClick={v.h.reset} className={`fillTransparent-${v.style.id}`} />
        )}
        <UpSetTitle style={v.style} width={v.size.area.w} />
        {children}
      </g>
      {p.children}
    </svg>
  );
}
