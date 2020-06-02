/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import D3Axis from './D3Axis';
import UpSetTitle from './UpSetTitle';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import { addonPositionGenerator, clsx } from './utils';

export default React.memo(function UpSetAxis<T>({
  size,
  style,
  data,
}: PropsWithChildren<{
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
}>) {
  const setPosGen = addonPositionGenerator(size.sets.w + size.labels.w + size.cs.w);
  const combinationPosGen = addonPositionGenerator(size.cs.h + size.sets.h);
  const csNameOffset = style.cs.offset === 'auto' ? data.cs.labelOffset : style.cs.offset;
  const setNameOffset = style.sets.offset === 'auto' ? data.sets.labelOffset : style.sets.offset;
  return (
    <g>
      <UpSetTitle style={style} width={size.cs.x - csNameOffset - 20} />
      <g transform={`translate(${size.cs.x},${size.cs.y})`} data-upset="csaxis">
        <D3Axis scale={data.cs.y} orient="left" size={size.cs.h} shift={size.cs.h - data.cs.yAxisWidth} style={style} />
        <line x1={0} x2={size.cs.w} y1={size.cs.h + 1} y2={size.cs.h + 1} className={`axisLine-${style.id}`} />
        <text
          className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${-csNameOffset}, ${size.cs.h / 2})rotate(-90)`}
        >
          {style.cs.name}
        </text>
        {size.cs.addons.map((addon) => (
          <text
            key={addon.name}
            className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
            style={style.styles.chartLabel}
            transform={`translate(${-csNameOffset}, ${combinationPosGen(addon) + addon.size / 2})rotate(-90)`}
          >
            {addon.name}
          </text>
        ))}
      </g>
      <g transform={`translate(${size.sets.x},${size.sets.y})`} data-upset="setaxis">
        <D3Axis
          scale={data.sets.x}
          orient="bottom"
          size={size.sets.w}
          shift={size.sets.w - data.sets.xAxisWidth}
          transform={`translate(0, ${size.sets.h})`}
          style={style}
        />
        <text
          className={clsx(`sChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${size.sets.w / 2}, ${size.sets.h + setNameOffset})`}
        >
          {style.sets.name}
        </text>
        {size.sets.addons.map((addon) => (
          <text
            key={addon.name}
            className={clsx(`sChartTextStyle-${style.id}`, style.classNames.chartLabel)}
            style={style.styles.chartLabel}
            transform={`translate(${setPosGen(addon) + addon.size / 2}, ${size.sets.h + setNameOffset})`}
          >
            {addon.name}
          </text>
        ))}
      </g>
    </g>
  );
});
