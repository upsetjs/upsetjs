import React, { PropsWithChildren } from 'react';
import D3Axis from './D3Axis';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
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
  const setPosGen = addonPositionGenerator(size.sets.w + size.labels.w + size.combinations.w);
  const combinationPosGen = addonPositionGenerator(size.combinations.h + size.sets.h);
  return (
    <g>
      <g transform={`translate(${size.combinations.x},${size.combinations.y})`}>
        <D3Axis d3Scale={data.combinations.y} orient="left" style={style} />
        <line
          x1={0}
          x2={size.combinations.w}
          y1={size.combinations.h + 1}
          y2={size.combinations.h + 1}
          className="axisLine"
        />
        <text
          className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${-style.combinationNameAxisOffset}, ${size.combinations.h / 2})rotate(-90)`}
        >
          {style.combinationName}
        </text>
        {size.combinations.addons.map((addon) => (
          <text
            key={addon.name}
            className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
            style={style.styles.chartLabel}
            transform={`translate(${-style.combinationNameAxisOffset}, ${
              combinationPosGen(addon) + addon.size / 2
            })rotate(-90)`}
          >
            {addon.name}
          </text>
        ))}
      </g>
      <g transform={`translate(${size.sets.x},${size.sets.y})`}>
        <D3Axis d3Scale={data.sets.x} orient="bottom" transform={`translate(0, ${size.sets.h})`} style={style} />
        <text
          className={clsx(`sChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${size.sets.w / 2}, ${size.sets.h + style.setNameAxisOffset})`}
        >
          {style.setName}
        </text>
        {size.sets.addons.map((addon) => (
          <text
            key={addon.name}
            className={clsx(`sChartTextStyle-${style.id}`, style.classNames.chartLabel)}
            style={style.styles.chartLabel}
            transform={`translate(${setPosGen(addon) + addon.size / 2}, ${size.sets.h + style.setNameAxisOffset})`}
          >
            {addon.name}
          </text>
        ))}
      </g>
    </g>
  );
});
