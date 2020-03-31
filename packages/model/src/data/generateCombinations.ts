import generateIntersections, { GenerateSetIntersectionsOptions } from './generateIntersections';
import { ISets, ISetCombinations } from '../model';
import generateUnions, { GenerateSetUnionsOptions } from './generateUnions';

export declare type GenerateSetCombinationsOptions<T = any> = {
  type: 'intersection' | 'union';
} & GenerateSetIntersectionsOptions<T> &
  GenerateSetUnionsOptions<T>;

export default function generateCombinations<T>(
  sets: ISets<T>,
  options: GenerateSetCombinationsOptions<T>
): ISetCombinations<T> {
  if (options.type === 'union') {
    return generateUnions(sets, options);
  }
  return generateIntersections(sets, options);
}
