import { isGenerateSetCombinationOptions, isSet, isSetCombination, isSetLike, isSetQuery } from './validators';

export * from './data';
export {
  ISetCombination,
  ISetCombinations,
  ISetComposite,
  ISetIntersection,
  ISetLike,
  ISetLikes,
  ISet,
  ISets,
  IBaseSet,
} from './model';

export * from './queries';
export { BandScaleLike, NumericScaleLike, BandScaleFactory, NumericScaleFactory } from './scales';

export const validators = {
  isGenerateSetCombinationOptions,
  isSet,
  isSetCombination,
  isSetLike,
  isSetQuery,
};
