/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React, { forwardRef, Ref, useMemo } from 'react';
import { fillKarnaughMapDefaults } from '../fillDefaults';
import { KarnaughMapProps } from '../interfaces';
import SVGWrapper from '../venn/components/SVGWrapper';
import { useCreateCommon } from '../venn/hooks';
import deriveKarnaughDataDependent from './derive/deriveKarnaughDataDependent';

const KarnaughMap = forwardRef(function KarnaughMap<T = any>(props: KarnaughMapProps<T>, ref: Ref<SVGSVGElement>) {
  const p = fillKarnaughMapDefaults<T>(props);
  const { queries = [], fontSizes } = p;
  // selection = null,
  const v = useCreateCommon(p);
  const { size, style, rulesHelper } = v;

  const dataInfo = useMemo(
    () => deriveKarnaughDataDependent(p.sets, p.combinations, size, p.valueFormat, p.toKey, p.toElemKey, p.id),
    [p.sets, p.combinations, size, p.valueFormat, p.toKey, p.toElemKey, p.id]
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

  .stroke-cell-${style.id} {
    fill: none;
    stroke: ${p.strokeColor};
  }

  ${rulesHelper.fill}
  ${rulesHelper.export}

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${dataInfo.id} {
    fill: ${q.color};
  }`
    )
    .join('\n')}
  `;

  return <SVGWrapper p={p} v={v} data={dataInfo} rules={rules} tRef={ref}></SVGWrapper>;
});

export { KarnaughMap };
