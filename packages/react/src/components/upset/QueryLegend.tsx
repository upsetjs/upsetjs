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
    <g {...extras} style={{ fontSize: 10 }}>
      {queries.map((q, i) => {
        let count: number | null = null;
        if (isSetQuery(q)) {
          count = q.set.cardinality;
        } else if (isElemQuery(q)) {
          count = q.elems instanceof Set ? q.elems.size : q.elems.length;
        }
        return (
          <g key={q.name} transform={`translate(0, ${i * 12 + 7})`}>
            <rect y={1} width={8} height={8} style={{ fill: q.color }} />
            <text x={12} y={5} style={{ dominantBaseline: 'central' }}>
              {q.name} {count != null && <tspan>({count})</tspan>}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export default QueryLegend;
