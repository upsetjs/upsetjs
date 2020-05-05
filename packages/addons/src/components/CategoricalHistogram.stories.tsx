/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import CategoricalHistogram from './CategoricalHistogram';

export default {
  component: CategoricalHistogram,
  title: 'CategoricalHistogram Component',
};

export const Default = () => {
  const categories = ['c1', 'c2', 'c3'];
  const values = Array(100)
    .fill(0)
    .map(() => categories[Math.floor(Math.random() * 3 - 0.01)]);
  return (
    <svg width={200} height={50}>
      <CategoricalHistogram width={200} height={50} categories={categories} values={values} />
    </svg>
  );
};

export const Vertical = () => {
  const categories = ['c1', 'c2', 'c3'];
  const values = Array(100)
    .fill(0)
    .map(() => categories[Math.floor(Math.random() * 3 - 0.01)]);
  return (
    <svg width={50} height={200}>
      <CategoricalHistogram width={50} height={200} categories={categories} values={values} />
    </svg>
  );
};
