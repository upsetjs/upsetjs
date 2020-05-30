/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import Histogram from './Histogram';

export default {
  component: Histogram,
  title: 'Components/Histogram',
};

export const Default = () => {
  const elems = Array(100)
    .fill(0)
    .map(() => ({
      a: Math.random(),
    }));
  return <Histogram width={500} height={100} elems={elems} attr="a" title="As" />;
};
