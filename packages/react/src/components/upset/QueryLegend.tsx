import React, { PropsWithChildren } from 'react';
import { UpSetQuery, isSetQuery, isElemQuery } from '@upsetjs/model';

const QueryLegend = React.memo(function QueryLegend<T>({
  queries,
  ...extras
}: PropsWithChildren<
  {
    queries: ReadonlyArray<UpSetQuery<T>>;
  } & React.SVGAttributes<SVGGElement>
>) {
  return (
    <g {...extras}>
      {queries.map((q, i) => {
        let count: number | null = null;
        if (isSetQuery(q)) {
          count = q.set.cardinality;
        } else if (isElemQuery(q)) {
          count = q.elems instanceof Set ? q.elems.size : q.elems.length;
        }
        return (
          <g key={q.name} transform={`translate(0, ${i * 12 + 7})`}>
            <rect y={1} width={8} height={8} className={`fillQ${i}`} />
            <text x={12} y={5} className="labelStyle centralText">
              {q.name} {count != null && <tspan>({count})</tspan>}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export default QueryLegend;
