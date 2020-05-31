/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import Categorical from './Categorical';

export default {
  component: Categorical,
  title: 'Components/Categorical',
};

export const Default = () => {
  const categories = ['c1', 'c2', 'c3'];
  const values = Array(100)
    .fill(0)
    .map(() => categories[Math.floor(Math.random() * 3 - 0.01)]);
  return (
    <svg width={200} height={50}>
      <Categorical width={200} height={50} categories={categories} values={values} />
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
      <Categorical width={50} height={200} categories={categories} values={values} orient="vertical" />
    </svg>
  );
};

export const Dark = () => {
  const categories = ['c1', 'c2', 'c3'];
  const values = Array(100)
    .fill(0)
    .map(() => categories[Math.floor(Math.random() * 3 - 0.01)]);
  return (
    <svg width={200} height={50}>
      <Categorical width={200} height={50} categories={categories} values={values} theme="dark" />
    </svg>
  );
};
