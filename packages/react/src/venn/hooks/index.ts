/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import { ISetCombinations, ISetLike, queryOverlap } from '@upsetjs/model';
import React, { useCallback, useMemo } from 'react';
import { exportSVG } from '../../exporter';
import { exportDump, exportSharedLink } from '../../exporter/exportDump';
import useHandler, { Handlers } from '../../hooks/useHandler';
import type {
  UpSetBaseDataProps,
  UpSetExportOptions,
  UpSetProps,
  VennDiagramDataProps,
  VennDiagramFullProps,
} from '../../interfaces';
import { baseRules } from '../../rules';
import { generateId } from '../../utils';
import deriveVennSizeDependent, { VennDiagramSizeInfo } from '../derive/deriveVennSizeDependent';
import deriveVennStyleDependent, { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';

export function useCreateCommon<T>(
  p: Omit<VennDiagramFullProps, keyof VennDiagramDataProps<T>> &
    UpSetBaseDataProps<T> & { toKey: (set: ISetLike<T>) => string }
) {
  const { queries = [], fontSizes } = p;
  // generate a "random" but attribute stable id to avoid styling conflicts
  const styleId = useMemo(
    () =>
      p.id
        ? p.id
        : generateId([
            p.fontFamily,
            fontSizes.valueLabel,
            fontSizes.legend,
            fontSizes.setLabel,
            fontSizes.title,
            fontSizes.exportLabel,
            fontSizes.description,
            p.textColor,
            p.color,
            p.hasSelectionColor,
            p.strokeColor,
            p.valueTextColor,
            p.selectionColor,
            p.opacity,
            p.hasSelectionOpacity,
          ]),
    [
      p.id,
      p.fontFamily,
      fontSizes.valueLabel,
      fontSizes.legend,
      fontSizes.setLabel,
      fontSizes.title,
      fontSizes.exportLabel,
      fontSizes.description,
      p.textColor,
      p.color,
      p.hasSelectionColor,
      p.strokeColor,
      p.valueTextColor,
      p.selectionColor,
      p.opacity,
      p.hasSelectionOpacity,
    ]
  );

  const styleInfo = useMemo(
    () =>
      deriveVennStyleDependent(
        p.theme,
        p.styles,
        p.classNames,
        styleId,
        p.selectionColor,
        p.title,
        p.description,
        p.tooltips
      ),
    [p.theme, p.styles, p.classNames, styleId, p.selectionColor, p.title, p.description, p.tooltips]
  );

  const sizeInfo = useMemo(() => deriveVennSizeDependent(p.width, p.height, p.padding, p.id), [
    p.width,
    p.height,
    p.padding,
    p.id,
  ]);

  const h = useHandler(p);
  const qs = React.useMemo(() => queries.map((q) => queryOverlap(q, 'intersection', p.toElemKey)), [
    queries,
    p.toElemKey,
  ]);

  const rulesHelper = baseRules(styleId, p, p.fontFamily, fontSizes);

  return {
    styleId,
    size: sizeInfo,
    style: styleInfo,
    h,
    qs,
    rulesHelper,
  };
}

export declare type CreateCommon = {
  selectionName?: string;
  styleId: string;
  size: VennDiagramSizeInfo;
  style: VennDiagramStyleInfo;
  h: Handlers;
  exportButtons: UpSetExportOptions | boolean;
};

export function useExportChart(
  dataInfo: { cs: { v: ISetCombinations<any> } },
  props: UpSetProps<any>,
  mode: 'kmap' | 'venn'
) {
  return useCallback(
    (evt: React.MouseEvent<SVGElement>) => {
      const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
      const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'dump' | 'share';
      switch (type) {
        case 'dump':
          exportDump(svg, props, dataInfo, mode);
          break;
        case 'share':
          exportSharedLink(props, dataInfo, mode);
          break;
        case 'svg':
        case 'png':
          exportSVG(svg, {
            type,
            toRemove: `.${evt.currentTarget.getAttribute('class')}`,
          });
      }
    },
    [dataInfo, props, mode]
  );
}
