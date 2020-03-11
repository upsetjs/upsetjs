import { ISetCombinations, ISets, NumericScaleLike, BandScaleLike } from '@upsetjs/model';
import { UpSetStyles } from './defineStyle';

export declare type UpSetScales = {
  sets: {
    x: NumericScaleLike;
    y: BandScaleLike;
  };
  combinations: {
    x: BandScaleLike;
    y: NumericScaleLike;
  };
};

export default function generateScales(
  sets: ISets<any>,
  combinations: ISetCombinations<any>,
  styles: UpSetStyles,
  linearScaleFactory: (domain: [number, number], range: [number, number]) => NumericScaleLike,
  bandScaleFactory: (domain: string[], range: [number, number], padding: number) => BandScaleLike
): UpSetScales {
  return {
    sets: {
      x: linearScaleFactory([0, sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0)], [styles.sets.w, 0]),
      y: bandScaleFactory(
        sets.map(d => d.name),
        [0, styles.sets.h],
        styles.padding
      ),
    },
    combinations: {
      x: bandScaleFactory(
        combinations.map(d => d.name),
        [0, styles.combinations.w],
        styles.padding
      ),
      y: linearScaleFactory(
        [0, combinations.reduce((acc, d) => Math.max(acc, d.cardinality), 0)],
        [styles.combinations.h, 0]
      ),
    },
  };
}
