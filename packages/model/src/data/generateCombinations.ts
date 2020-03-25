import generateIntersections, { GenerateSetIntersectionsOptions } from './generateIntersections';
import { ISets } from '../model';
import generateUnions, { GenerateSetUnionsOptions } from './generateUnions';

export declare type GenerateSetCombinationsOptions = {
  type: 'intersection' | 'union';
} & GenerateSetIntersectionsOptions &
  GenerateSetUnionsOptions;

export default function generateCombinations<T>(sets: ISets<T>, options: GenerateSetCombinationsOptions) {
  if (options.type === 'intersection') {
    return generateIntersections(sets, options);
  }
  return generateUnions(sets, options);
}
