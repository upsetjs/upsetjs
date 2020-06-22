/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { ISetCombinations, ISetLike, queryOverlap } from '@upsetjs/model';
import React, { useCallback, useMemo } from 'react';
import deriveVennSizeDependent from '../derive/deriveVennSizeDependent';
import deriveVennStyleDependent from '../derive/deriveVennStyleDependent';
import { exportSVG } from '../../exporter';
import { exportDump, exportSharedLink } from '../../exporter/exportDump';
import useHandler from '../../hooks/useHandler';
import { UpSetBaseDataProps, UpSetProps, VennDiagramDataProps, VennDiagramFullProps } from '../../interfaces';
import { baseRules } from '../../rules';
import { generateId, generateSelectionName, generateSelectionOverlap, isSetLike } from '../../utils';

export function useCreateCommon<T>(
  p: Omit<VennDiagramFullProps, keyof VennDiagramDataProps<T>> &
    UpSetBaseDataProps<T> & { toKey: (set: ISetLike<T>) => string }
) {
  const { selection = null, queries = [], fontSizes } = p;
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
  const selectionKey = selection != null && isSetLike(selection) ? p.toKey(selection) : null;
  const selectionOverlap = selection == null ? null : generateSelectionOverlap(selection, p.toElemKey);
  const selectionName = generateSelectionName(selection);
  const qs = React.useMemo(() => queries.map((q) => queryOverlap(q, 'intersection', p.toElemKey)), [
    queries,
    p.toElemKey,
  ]);

  const exportButtonsPatch = useMemo(
    () =>
      !p.exportButtons ? false : Object.assign({}, p.exportButtons === true ? {} : p.exportButtons, { vega: false }),
    [p.exportButtons]
  );

  const rulesHelper = baseRules(styleId, p, p.fontFamily, fontSizes);

  return {
    styleId,
    sizeInfo,
    styleInfo,
    h,
    exportButtonsPatch,
    selectionKey,
    selectionName,
    selectionOverlap,
    qs,
    rulesHelper,
  };
}

export function useExportChart(dataInfo: { cs: { v: ISetCombinations<any> } }, props: UpSetProps<any>) {
  return useCallback(
    (evt: React.MouseEvent<SVGElement>) => {
      const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
      const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'dump' | 'share';
      switch (type) {
        case 'dump':
          exportDump(svg, props, dataInfo);
          break;
        case 'share':
          exportSharedLink(props, dataInfo);
          break;
        case 'svg':
        case 'png':
          exportSVG(svg, {
            type,
            toRemove: `.${evt.currentTarget.getAttribute('class')}`,
          });
      }
    },
    [dataInfo, props]
  );
}
