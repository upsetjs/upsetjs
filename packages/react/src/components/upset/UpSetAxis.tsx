import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import D3Axis from './D3Axis';
import { UpSetStyleClassNames, UpSetReactStyles, UpSetAddons } from '../config';
import { clsx, addonPositionGenerator } from './utils';
import { ISet, ISetCombination } from '../../../../model/dist';

export default React.memo(function UpSetAxis<T>({
  scales,
  styles,
  setName,
  combinationName,
  setNameAxisOffset,
  combinationNameAxisOffset,
  classNames,
  cStyles,
  setAddons,
  combinationAddons,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  setName: string | React.ReactNode;
  combinationName: string | React.ReactNode;
  setNameAxisOffset: number;
  combinationNameAxisOffset: number;
  classNames: UpSetStyleClassNames;
  cStyles: UpSetReactStyles;
  setAddons: UpSetAddons<ISet<T>, T>;
  combinationAddons: UpSetAddons<ISetCombination<T>, T>;
}>) {
  const setPosGen = addonPositionGenerator(styles.sets.w + styles.labels.w + styles.combinations.w);
  const combinationPosGen = addonPositionGenerator(styles.combinations.h + styles.sets.h);
  return (
    <g>
      <g transform={`translate(${styles.combinations.x},${styles.combinations.y})`}>
        <D3Axis
          d3Scale={scales.combinations.y}
          orient="left"
          integersOnly
          tickClassName={classNames.axisTick}
          tickStyle={cStyles.axisTick}
        />
        <line
          x1={0}
          x2={styles.combinations.w}
          y1={styles.combinations.h + 1}
          y2={styles.combinations.h + 1}
          className="axisLine"
        />
        <text
          className={clsx('textStyle', 'chartTextStyle', classNames.chartLabel)}
          style={cStyles.chartLabel}
          transform={`translate(${-combinationNameAxisOffset}, ${styles.combinations.h / 2})rotate(-90)`}
        >
          {combinationName}
        </text>
        {combinationAddons.map((addon) => (
          <text
            key={addon.name}
            className={clsx('textStyle', 'chartTextStyle', classNames.chartLabel)}
            style={cStyles.chartLabel}
            transform={`translate(${-combinationNameAxisOffset}, ${
              combinationPosGen(addon) + addon.size / 2
            })rotate(-90)`}
          >
            {addon.name}
          </text>
        ))}
      </g>
      <g transform={`translate(${styles.sets.x},${styles.sets.y})`}>
        <D3Axis
          d3Scale={scales.sets.x}
          orient="bottom"
          transform={`translate(0, ${styles.sets.h})`}
          integersOnly
          tickClassName={classNames.axisTick}
          tickStyle={cStyles.axisTick}
        />
        <text
          className={clsx('textStyle', 'chartTextStyle', 'hangingText', classNames.chartLabel)}
          style={cStyles.chartLabel}
          transform={`translate(${styles.sets.w / 2}, ${styles.sets.h + setNameAxisOffset})`}
        >
          {setName}
        </text>
        {setAddons.map((addon) => (
          <text
            key={addon.name}
            className={clsx('textStyle', 'chartTextStyle', 'hangingText', classNames.chartLabel)}
            style={cStyles.chartLabel}
            transform={`translate(${setPosGen(addon) + addon.size / 2}, ${styles.sets.h + setNameAxisOffset})`}
          >
            {addon.name}
          </text>
        ))}
      </g>
    </g>
  );
});
