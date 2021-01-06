/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { UpSetQuery, isSetQuery, isElemQuery } from '@upsetjs/model';
import { clsx } from '../utils';

const QueryLegend = /*!#__PURE__*/ React.memo(function QueryLegend<T>({
  queries,
  x,
  style,
  data,
}: PropsWithChildren<{
  queries: readonly UpSetQuery<T>[];
  x: number;
  style: { id: string; styles: { legend?: React.CSSProperties }; classNames: { legend?: string } };
  data: { id: string; sets: { format(v: number): string } };
}>) {
  return (
    <text
      transform={`translate(${x},4)`}
      style={style.styles.legend}
      className={clsx(`legendTextStyle-${style.id}`, style.classNames.legend)}
    >
      {queries.map((q, i) => {
        let count: number | null = null;
        if (isSetQuery(q)) {
          count = q.set.cardinality;
        } else if (isElemQuery(q)) {
          count = q.elems instanceof Set ? q.elems.size : q.elems.length;
        }
        return (
          <React.Fragment key={q.name}>
            <tspan className={`fillQ${i}-${data.id}`}>{'  ⬤ '}</tspan>
            <tspan>
              {q.name}
              {count != null ? `: ${data.sets.format(count)}` : ''}
            </tspan>
          </React.Fragment>
        );
      })}
    </text>
  );
});

export default QueryLegend;
