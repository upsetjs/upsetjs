/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import { renderUpSet, createElement, extractCombinations } from '@upsetjs/bundle';
import elems, { Row } from './data';

const rootElement = document.getElementById('root')!;

const { sets, combinations } = extractCombinations(elems);

function customStyleFactory(rules: string) {
  return createElement(
    'style',
    {
      nonce: 'abc',
    },
    rules
  );
}

renderUpSet(rootElement, {
  id: 'abc',
  sets,
  combinations,
  width: 780,
  height: 500,
  styleFactory: customStyleFactory,
});
