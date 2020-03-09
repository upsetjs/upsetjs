import React, { PropsWithChildren } from 'react';
import { UpSetQuery, isSetQuery, isElemQuery } from './queries';

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
      {queries.map(q => {
        let count: number | null = null;
        if (isSetQuery(q)) {
          count = q.set.cardinality;
        } else if (isElemQuery(q)) {
          count = q.elems instanceof Set ? q.elems.size : q.elems.length;
        }
        return (
          <g key={q.name}>
            <rect x={2} width={5} height={5} style={{ fill: q.color }} />
            <text x={7} style={{ dominantBaseline: 'central' }}>
              {q.name} {count != null && <tspan>({count})</tspan>}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export default QueryLegend;
