import React, { PropsWithChildren } from 'react';
import { UpSetQuery, isSetQuery, isElemQuery } from '@upsetjs/model';
import { clsx } from './utils';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import { UpSetDataInfo } from './deriveDataDependent';

const QueryLegend = React.memo(function QueryLegend<T>({
  queries,
  size,
  style,
  data,
}: PropsWithChildren<{
  queries: ReadonlyArray<UpSetQuery<T>>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
}>) {
  return (
    <text
      transform={`translate(${size.legend.x},4)`}
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
