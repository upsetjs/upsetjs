/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { VennArcSliceText } from './VennArcSlice';
import VennCircleText from './VennCircleText';

export default React.memo(function VennChartLabels<T>({
  style,
  data,
}: PropsWithChildren<{
  style: VennDiagramStyleInfo;
  data: VennDiagramDataInfo<T>;
}>) {
  return (
    <g className={`pnone-${style.id}`}>
      {data.sets.l.map((l, i) => (
        <VennCircleText key={data.sets.keys[i]} d={data.sets.v[i]} circle={l} style={style} data={data} />
      ))}
      {data.cs.l.map((l, i) => (
        <VennArcSliceText key={data.cs.keys[i]} d={data.cs.v[i]} slice={l} style={style} data={data} />
      ))}
    </g>
  );
});
