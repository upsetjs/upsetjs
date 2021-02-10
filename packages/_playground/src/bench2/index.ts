import { extractCombinations, ISetCombinations, ISets } from '@upsetjs/react';
import data from './data.txt';

const setNames = Array.from('abcdefghijklmnopqrstuvwxyz01234567');

let sets: ISets<any> = [];
let combinations: ISetCombinations<any> = [];

export const loader = fetch(data as string)
  .then((r) => r.text())
  .then((r) => {
    const items = r
      .split('\n')
      .map((encoded, i) => ({ i, sets: setNames.filter((_, i) => encoded.charAt(i) === '1') }));

    const out = extractCombinations(items, {
      type: 'distinctIntersection',
    });
    sets = out.sets;
    combinations = out.combinations;
    return { items, ...out };
  });

export function useData() {
  if (sets.length === 0 || combinations.length === 0) {
    throw loader;
  }
  return { sets, combinations };
}
