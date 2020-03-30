import React, { PropsWithChildren } from 'react';
import { UpSetQuery, isSetQuery, isElemQuery } from '@upsetjs/model';
import { clsx } from './utils';

const QueryLegend = React.memo(function QueryLegend<T>({
  queries,
  className,
  ...extras
}: PropsWithChildren<
  {
    queries: ReadonlyArray<UpSetQuery<T>>;
  } & React.SVGAttributes<SVGGElement>
>) {
  return (
    <text {...extras} className={clsx('textStyle', 'legendTextStyle', className)}>
      {queries.map((q, i) => {
        let count: number | null = null;
        if (isSetQuery(q)) {
          count = q.set.cardinality;
        } else if (isElemQuery(q)) {
          count = q.elems instanceof Set ? q.elems.size : q.elems.length;
        }
        return (
          <React.Fragment key={q.name}>
            <tspan className={`fillQ${i} x`}>{'  ⬤ '}</tspan>
            <tspan>
              {q.name}
              {count != null ? `: ${count}` : ''}
            </tspan>
          </React.Fragment>
        );
      })}
    </text>
  );
});

export default QueryLegend;
