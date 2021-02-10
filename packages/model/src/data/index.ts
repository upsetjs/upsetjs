/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export { default as generateCombinations, GenerateSetCombinationsOptions } from './generateCombinations';
export { default as asSets, asSet, PostprocessSetOptions } from './asSets';
export { default as extractFromExpression, ExtractFromExpressionOptions } from './extractFromExpression';
export { default as extractCombinations, ExtractCombinationsOptions } from './extractCombinations';
export {
  default as asCombinations,
  asCombination,
  fromSetName,
  PostprocessCombinationsOptions,
} from './asCombinations';

export { default as extractSets } from './extractSets';

export * from './setOverlap';
export { default as setOverlap } from './setOverlap';
export {
  generateDistinctOverlapFunction,
  generateIntersectionOverlapFunction,
  generateUnionOverlapFunction,
  generateOverlapFunction,
} from './generateOverlapFunction';
export {
  GenerateOverlapLookupOptions,
  generateOverlapLookup,
  generateOverlapLookupFunction,
} from './generateOverlapLookup';
