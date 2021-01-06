/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import Boxplot from './Boxplot';

const stories = {
  component: Boxplot,
  title: 'Components/Box plot',
};
export default stories;

export const Default = () => {
  const values = Array(100)
    .fill(0)
    .map(() => Math.random());
  return (
    <svg width={200} height={50}>
      <Boxplot width={200} height={50} min={0} max={1} values={values} />
    </svg>
  );
};

export const Vertical = () => {
  const values = Array(100)
    .fill(0)
    .map(() => Math.random());
  return (
    <svg width={50} height={200}>
      <Boxplot width={50} height={200} min={0} max={1} values={values} orient="vertical" />
    </svg>
  );
};
