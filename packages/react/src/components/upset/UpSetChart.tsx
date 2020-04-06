import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import { ISets, ISetCombinations, ISetLike, ISet, ISetCombination } from '@upsetjs/model';
import SetChart from './SetChart';
import CombinationChart from './CombinationChart';
import { wrap } from './utils';
import { UpSetStyleClassNames, UpSetReactStyles, UpSetReactChildrens, UpSetAddons } from '../config';

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
  childrens,
  clipId,
  barLabelOffset,
  setAddons,
  combinationAddons,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  sets: ISets<T>;
  cs: ISetCombinations<T>;
  r: number;
  clipId: string;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;
  classNames: UpSetStyleClassNames;
  cStyles: UpSetReactStyles;
  childrens: UpSetReactChildrens<T>;
  barLabelOffset: number;
  setAddons: UpSetAddons<ISet<T>, T>;
  combinationAddons: UpSetAddons<ISetCombination<T>, T>;
}>) {
  // const [selection, setSelection] = useState(null as ISet<T> | null);
  const onClickImpl = wrap(onClick);
  const onMouseEnterImpl = wrap(onHover);
  const onMouseLeaveImpl = wrap(onHover ? () => onHover(null) : undefined);

  const setBarHeight = scales.sets.y.bandwidth();
  const combinationBarWidth = scales.combinations.x.bandwidth();
  const cx = combinationBarWidth / 2;
  const cy = scales.sets.y.bandwidth() / 2 + styles.combinations.h;

  const rsets = sets.slice().reverse();

  return (
    <g className={onClick ? 'clickAble' : undefined}>
      <g transform={`translate(${styles.sets.x},${styles.sets.y})`}>
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
            clipId={clipId}
            setBarHeight={setBarHeight}
            barClassName={classNames.bar}
            barLabelClassName={classNames.barLabel}
            barLabelStyle={cStyles.barLabel}
            barStyle={cStyles.bar}
            setClassName={classNames.setLabel}
            setStyle={cStyles.setLabel}
            barLabelOffset={barLabelOffset}
            setAddons={setAddons}
          >
            {childrens.set && childrens.set(d)}
          </SetChart>
        ))}
      </g>

      <g transform={`translate(${styles.combinations.x},${styles.combinations.y})`}>
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
            barClassName={classNames.bar}
            barLabelClassName={classNames.barLabel}
            barLabelStyle={cStyles.barLabel}
            barStyle={cStyles.bar}
            dotClassName={classNames.dot}
            dotStyle={cStyles.dot}
            barLabelOffset={barLabelOffset}
            combinationAddons={combinationAddons}
          >
            {childrens.combinations && childrens.combinations(d)}
          </CombinationChart>
        ))}
      </g>
    </g>
  );
});
