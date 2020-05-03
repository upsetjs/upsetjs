/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

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
  toKey,
} from './model';

export * from './queries';
export * from './scales';
export { fromIndicesArray, toIndicesArray } from './array';
export * from './dump';

/**
 * helper for validation and type checking
 */
export const validators = {
  isGenerateSetCombinationOptions,
  isSet,
  isSetCombination,
  isSetLike,
  isSetQuery,
};
