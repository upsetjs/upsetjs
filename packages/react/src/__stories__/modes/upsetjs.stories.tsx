/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { common } from '../data';
import UpSetJS from '../../UpSetJS';
import { InteractiveUpSetJS } from '../Interactive';

export default {
  component: UpSetJS,
  title: 'UpSetJS/Combination Modes',
};

export const Default = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        type: 'intersection',
      }}
    />
  );
};

export const SetUnion = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        type: 'union',
      }}
      combinationName="Union Size"
    />
  );
};

export const DistinctSetIntersection = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        type: 'distinctIntersection',
      }}
      combinationName="Distinct Intersection Size"
    />
  );
};

export const ShowEmpty = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        empty: true,
      }}
    />
  );
};

export const TwoSetsIntersections = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        min: 2,
      }}
    />
  );
};

export const LimitTop10 = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        limit: 10,
      }}
    />
  );
};

export const SortByDegree = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        order: 'degree:desc',
      }}
    />
  );
};

export const SortBySetGroup = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      combinations={{
        order: ['group:asc', 'degree:desc'],
      }}
    />
  );
};
