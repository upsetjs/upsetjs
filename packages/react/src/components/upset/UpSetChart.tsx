import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import { ISets, ISetCombinations, ISetLike } from '@upsetjs/model';
import SetChart from './SetChart';
import CombinationChart from './CombinationChart';
import { wrap } from './utils';
import { UpSetStyleClassNames, UpSetReactStyles } from '../config';

export default React.memo(function UpSetChart<T>({
  scales,
  styles,
  sets,
  cs,
  r,
  onHover,
  onClick,
  classNames,
  cStyles,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  sets: ISets<T>;
  cs: ISetCombinations<T>;
  r: number;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;
  classNames: UpSetStyleClassNames;
  cStyles: UpSetReactStyles;
}>) {
  // const [selection, setSelection] = useState(null as ISet<T> | null);
  const onClickImpl = wrap(onClick);
  const onMouseEnterImpl = wrap(onHover);
  const onMouseLeaveImpl = wrap(onHover ? () => onHover(null) : undefined);

  const setBarWidth = scales.sets.x.range()[0];
  const setBarHeight = scales.sets.y.bandwidth();
  const combinationBarWidth = scales.combinations.x.bandwidth();
  const cx = combinationBarWidth / 2;
  const combinationBarHeight = scales.combinations.y.range()[0];
  const cy = scales.sets.y.bandwidth() / 2 + combinationBarHeight;

  const rsets = sets.slice().reverse();

  return (
    <g className={onClick ? 'clickAble' : undefined}>
      <g transform={`translate(0,${styles.combinations.h})`}>
        {sets.map((d, i) => (
          <SetChart
            key={d.name}
            scales={scales}
            d={d}
            i={i}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            className={onClick || onHover ? 'interactive' : undefined}
            styles={styles}
            setBarWidth={setBarWidth}
            setBarHeight={setBarHeight}
            barClassName={classNames.bar}
            barLabelClassName={classNames.barLabel}
            barLabelStyle={cStyles.barLabel}
            barStyle={cStyles.bar}
            setClassName={classNames.setLabel}
            setStyle={cStyles.setLabel}
          />
        ))}
      </g>

      <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
        {cs.map((d) => (
          <CombinationChart
            key={d.name}
            scales={scales}
            styles={styles}
            d={d}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            className={onClick || onHover ? 'interactive' : undefined}
            sets={sets}
            r={r}
            rsets={rsets}
            cx={cx}
            cy={cy}
            combinationBarWidth={combinationBarWidth}
            combinationBarHeight={combinationBarHeight}
            barClassName={classNames.bar}
            barLabelClassName={classNames.barLabel}
            barLabelStyle={cStyles.barLabel}
            barStyle={cStyles.bar}
            dotClassName={classNames.dot}
            dotStyle={cStyles.dot}
          />
        ))}
      </g>
    </g>
  );
});
