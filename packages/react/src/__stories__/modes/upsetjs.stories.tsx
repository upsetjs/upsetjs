/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { common, sets } from '../data';
import UpSetJS from '../../UpSetJS';
import { InteractiveUpSetJS } from '../Interactive';
import { generateCombinations } from '@upsetjs/model';

export default {
  component: UpSetJS,
  title: 'UpSetJS/Combination Modes',
};

export const Default = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        type: 'intersection',
        order: ['cardinality:desc', 'name:asc'],
      })}
    />
  );
};

export const SetUnion = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        type: 'union',
        order: ['cardinality:desc', 'name:asc'],
      })}
      combinationName="Union Size"
    />
  );
};

export const DistinctSetIntersection = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        type: 'distinctIntersection',
        order: ['cardinality:desc', 'name:asc'],
      })}
      combinationName="Distinct Intersection Size"
    />
  );
};

export const ShowEmpty = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        empty: true,
        order: ['cardinality:desc', 'name:asc'],
      })}
    />
  );
};

export const TwoSetsIntersections = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        min: 2,
        order: ['cardinality:desc', 'name:asc'],
      })}
    />
  );
};

export const LimitTop10 = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        limit: 10,
        order: ['cardinality:desc', 'name:asc'],
      })}
    />
  );
};

export const SortByDegree = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        order: 'degree:desc',
      })}
    />
  );
};

export const SortBySetGroup = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={generateCombinations(sets, {
        order: ['group:asc', 'degree:desc'],
      })}
    />
  );
};
