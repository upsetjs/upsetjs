import generateIntersections, { GenerateSetIntersectionsOptions } from './generateIntersections';
import { ISets, ISetCombinations } from '../model';
import generateUnions, { GenerateSetUnionsOptions } from './generateUnions';

export declare type GenerateSetCombinationsOptions = {
  type: 'intersection' | 'union';
} & GenerateSetIntersectionsOptions &
  GenerateSetUnionsOptions;

export default function generateCombinations<T>(
  sets: ISets<T>,
  options: GenerateSetCombinationsOptions
): ISetCombinations<T> {
  if (options.type === 'union') {
    return generateUnions(sets, options);
  }
  return generateIntersections(sets, options);
}
