/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren, ReactElement } from 'react';
import Axis from './Axis';
import UpSetTitle from './UpSetTitle';
import type { UpSetDataInfo } from '../derive/deriveDataDependent';
import type { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import type { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import { addonPositionGenerator } from './utils';
import { clsx } from '../utils';

export type UpSetAxisProps<T> = PropsWithChildren<{
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
}>;

const UpSetAxis = /*!#__PURE__*/ React.memo(function UpSetAxis<T>({ size, style, data }: UpSetAxisProps<T>) {
  const setPosGen = addonPositionGenerator(size.sets.w + size.labels.w + size.cs.w, size.sets.addonPadding);
  const combinationPosGen = addonPositionGenerator(size.cs.h + size.sets.h, size.cs.addonPadding);
  const csNameOffset = style.cs.offset === 'auto' ? data.cs.labelOffset : style.cs.offset;
  const setNameOffset = style.sets.offset === 'auto' ? data.sets.labelOffset : style.sets.offset;
  return (
    <g>
      <UpSetTitle style={style} width={size.cs.x - csNameOffset - 20} />
      <g transform={`translate(${size.cs.x},${size.cs.y})`} data-upset="csaxis">
        <Axis scale={data.cs.y} orient="left" size={size.cs.h} start={size.cs.h - data.cs.yAxisWidth} style={style} />
        <line x1={0} x2={size.cs.w} y1={size.cs.h + 1} y2={size.cs.h + 1} className={`axisLine-${style.id}`} />
        <text
          className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${-csNameOffset}, ${size.cs.h / 2})rotate(-90)`}
        >
          {style.cs.name}
        </text>
        {size.cs.addons.map((addon) => {
          const pos = combinationPosGen(addon);
          const title = (
            <text
              key={addon.name}
              className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
              style={style.styles.chartLabel}
              transform={`translate(${-csNameOffset}, ${pos + addon.size / 2})rotate(-90)`}
            >
              {addon.name}
            </text>
          );
          if (!addon.scale) {
            return title;
          }
          return (
            <React.Fragment key={addon.name}>
              <Axis
                scale={addon.scale}
                orient="left"
                size={addon.size}
                start={0}
                style={style}
                transform={`translate(0,${pos})`}
              />
              {title}
            </React.Fragment>
          );
        })}
      </g>
      <g transform={`translate(${size.sets.x},${size.sets.y})`} data-upset="setaxis">
        <Axis
          scale={data.sets.x}
          orient="bottom"
          size={size.sets.w}
          start={size.sets.w - data.sets.xAxisWidth}
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
        {size.sets.addons.map((addon) => {
          const pos = setPosGen(addon);
          const title = (
            <text
              key={addon.name}
              className={clsx(`sChartTextStyle-${style.id}`, style.classNames.chartLabel)}
              style={style.styles.chartLabel}
              transform={`translate(${pos + addon.size / 2}, ${size.sets.h + setNameOffset})`}
            >
              {addon.name}
            </text>
          );
          if (!addon.scale) {
            return title;
          }
          return (
            <React.Fragment key={addon.name}>
              <Axis
                scale={addon.scale}
                orient="bottom"
                size={addon.size}
                start={0}
                transform={`translate(${pos}, ${size.sets.h})`}
                style={style}
              />
              {title}
            </React.Fragment>
          );
        })}
      </g>
    </g>
  );
});

export default UpSetAxis as <T>(props: UpSetAxisProps<T>) => ReactElement;
