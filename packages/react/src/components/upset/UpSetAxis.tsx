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
  const setPosGen = addonPositionGenerator(size.sets.w + size.labels.w + size.cs.w);
  const combinationPosGen = addonPositionGenerator(size.cs.h + size.sets.h);
  return (
    <g>
      <g transform={`translate(${size.cs.x},${size.cs.y})`}>
        <D3Axis scale={data.cs.y} orient="left" size={size.cs.h} style={style} />
        <line x1={0} x2={size.cs.w} y1={size.cs.h + 1} y2={size.cs.h + 1} className="axisLine" />
        <text
          className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${-style.cs.offset}, ${size.cs.h / 2})rotate(-90)`}
        >
          {style.cs.name}
        </text>
        {size.cs.addons.map((addon) => (
          <text
            key={addon.name}
            className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
            style={style.styles.chartLabel}
            transform={`translate(${-style.cs.offset}, ${combinationPosGen(addon) + addon.size / 2})rotate(-90)`}
          >
            {addon.name}
          </text>
        ))}
      </g>
      <g transform={`translate(${size.sets.x},${size.sets.y})`}>
        <D3Axis
          scale={data.sets.x}
          orient="bottom"
          size={size.sets.w}
          transform={`translate(0, ${size.sets.h})`}
          style={style}
        />
        <text
          className={clsx(`sChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${size.sets.w / 2}, ${size.sets.h + style.sets.offset})`}
        >
          {style.sets.name}
        </text>
        {size.sets.addons.map((addon) => (
          <text
            key={addon.name}
            className={clsx(`sChartTextStyle-${style.id}`, style.classNames.chartLabel)}
            style={style.styles.chartLabel}
            transform={`translate(${setPosGen(addon) + addon.size / 2}, ${size.sets.h + style.sets.offset})`}
          >
            {addon.name}
          </text>
        ))}
      </g>
    </g>
  );
});
