/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

/// <reference types="jest" />
/// <reference types="node" />
import type { ISetLike, SetCombinationType } from '../model';
import extractCombinations from './extractCombinations';
import extractSets from './extractSets';
import generateCombinations from './generateCombinations';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function rand(seed = Date.now()) {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generate(rnd: () => number, numItems: number, numSets: number) {
  const sets = Array(numSets)
    .fill(0)
    .map((_, i) => `s${i}`);
  return Array(numItems)
    .fill(0)
    .map((_, i) => ({
      name: `e${i}`,
      sets: sets.filter(() => rnd() < 1 / sets.length),
    }))
    .filter((d) => d.sets.length > 0);
}

function toString(d: ISetLike<any>) {
  return `${d.name}:${d.cardinality}`;
}

function runScenario(numItems: number, numSets: number, type: SetCombinationType = 'intersection') {
  const items = generate(rand(1), numItems, numSets);
  const sets = extractSets(items);
  const genStart = performance.now();
  const gen = generateCombinations(sets, { type, min: 1 });
  const genEnd = performance.now();
  const { combinations: extract } = extractCombinations(items, { sets, type });
  const extractEnd = performance.now();
  console.log(
    `${type}: ${numItems}x${numSets} generate: ${Math.round(genEnd - genStart)}ms, extract: ${Math.round(
      extractEnd - genEnd
    )}ms`
  );
  return {
    gen: gen.map(toString).sort(),
    extract: extract.map(toString).sort(),
  };
}

describe('generate vs extract', () => {
  const sizes = [
    [100, 5],
    [1000, 5],
    [10000, 5],
    [1000, 8],
    [1000, 15],
    [6000, 30],
    [10000, 40],
    [24000, 6],
  ];
  const types: SetCombinationType[] = ['intersection', 'distinctIntersection'];
  for (const size of sizes) {
    for (const type of types) {
      test(`${type}: ${size[0]}x${size[1]}`, () => {
        const { gen, extract } = runScenario(size[0], size[1], type);
        expect(gen).toStrictEqual(extract);
      });
    }
  }
});

describe('generate vs extract toy', () => {
  const set = readFileSync(resolve(__dirname, './__tests__/bench1.txt')).toString();
  const setNames = Array.from('abcdef');
  const items = set
    .split('\n')
    .map((encoded, i) => ({ i, sets: setNames.filter((_, i) => encoded.charAt(i) === '1') }));
  const sets = extractSets(items);
  const types: SetCombinationType[] = ['intersection', 'distinctIntersection'];
  for (const type of types) {
    test(`${type}`, () => {
      const genStart = performance.now();
      const gen = generateCombinations(sets, {
        type,
        min: 0,
        notPartOfAnySet: items.filter((d) => d.sets.length === 0),
      });
      const genEnd = performance.now();
      const { combinations: extract } = extractCombinations(items, { sets, type });
      const extractEnd = performance.now();
      console.log(
        `${type}: generate(${gen.length}): ${Math.round(genEnd - genStart)}ms, extract(${extract.length}): ${Math.round(
          extractEnd - genEnd
        )}ms`
      );
      expect(gen.map(toString).sort()).toStrictEqual(extract.map(toString).sort());
    });
  }
});

describe('generate vs extract toy2', () => {
  const set = readFileSync(resolve(__dirname, './__tests__/bench2.txt')).toString();
  const setNames = Array.from('abcdefghijklmnopqrstuvwxyz01234567');
  const items = set
    .split('\n')
    .map((encoded, i) => ({ i, sets: setNames.filter((_, i) => encoded.charAt(i) === '1') }));
  const sets = extractSets(items);
  const types: SetCombinationType[] = ['intersection', 'distinctIntersection'];
  for (const type of types) {
    test(`${type}`, () => {
      const genStart = performance.now();
      const gen = generateCombinations(sets, {
        type,
        min: 0,
        notPartOfAnySet: items.filter((d) => d.sets.length === 0),
      });
      const genEnd = performance.now();
      const { combinations: extract } = extractCombinations(items, { sets, type });
      const extractEnd = performance.now();
      console.log(
        `${type}: generate(${gen.length}): ${Math.round(genEnd - genStart)}ms, extract(${extract.length}): ${Math.round(
          extractEnd - genEnd
        )}ms`
      );
      expect(gen.map(toString).sort()).toStrictEqual(extract.map(toString).sort());
    });
  }
});
