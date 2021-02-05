/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import type { ISetCombinations } from '@upsetjs/model';
import React, { Ref } from 'react';
import ExportButtons from '../../components/ExportButtons';
import QueryLegend from '../../components/QueryLegend';
import type { Handlers } from '../../hooks/useHandler';
import type {
  UpSetBaseElementProps,
  UpSetBaseLayoutProps,
  UpSetBaseMultiStyle,
  UpSetBaseStyleProps,
  UpSetBaseThemeProps,
  UpSetSelectionProps,
} from '../../interfaces';
import { clsx } from '../../utils';

export interface SVGWrapperStyle {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  styles: UpSetBaseMultiStyle<React.CSSProperties>;
  classNames: UpSetBaseMultiStyle<string>;
}

export interface SVGWrapperData {
  id: string;
  cs: { v: ISetCombinations<any> };
  sets: { format(v: number): string };
}

export default function SVGWrapper<T>({
  rules,
  style,
  size,
  p,
  data,
  tRef,
  children,
  exportChart,
  selectionName,
  h,
}: React.PropsWithChildren<{
  rules: string;
  style: SVGWrapperStyle;
  selectionName?: string;
  size: { w: number; h: number; legend: { x: number }; area: { w: number } };
  p: UpSetBaseElementProps<React.CSSProperties> &
    UpSetBaseLayoutProps &
    UpSetBaseThemeProps &
    UpSetBaseStyleProps<React.ReactNode> &
    UpSetSelectionProps<T> &
    UpSetBaseLayoutProps & {
      children?: React.ReactNode;
    };
  data: SVGWrapperData;
  tRef: Ref<SVGSVGElement>;
  h: Handlers;
  exportChart: (evt: React.MouseEvent<SVGElement>) => void;
}>) {
  return (
    <svg
      id={p.id}
      className={clsx(`root-${style.id}`, p.className)}
      style={p.style}
      width={p.width}
      height={p.height}
      ref={tRef}
      viewBox={`0 0 ${p.width} ${p.height}`}
      data-theme={p.theme ?? 'light'}
      data-selection={selectionName ? selectionName : undefined}
    >
      <style>{rules}</style>
      {p.onClick && <rect width={size.w} height={size.h} onClick={h.reset} className={`fillTransparent-${style.id}`} />}
      {p.queryLegend && <QueryLegend queries={p.queries ?? []} x={size.legend.x} style={style} data={data} />}
      <ExportButtons
        transform={`translate(${size.w - 2},${size.h - 3})`}
        styleId={style.id}
        exportButtons={p.exportButtons}
        exportChart={exportChart}
      />
      <g transform={`translate(${p.padding},${p.padding})`} data-upset="base">
        {children}
      </g>
      {p.children}
    </svg>
  );
}
