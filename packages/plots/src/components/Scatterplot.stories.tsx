/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import Scatterplot from './Scatterplot';

export default {
  component: Scatterplot,
  title: 'Components/Scatterplot',
};

export const Default = () => {
  const elems = Array(100)
    .fill(0)
    .map(() => ({
      a: Math.random(),
      b: Math.random(),
    }));
  return (
    <Scatterplot
      width={500}
      height={500}
      elems={elems}
      xAttr="a"
      yAttr="b"
      title="As"
      onClick={(s) => console.log(s)}
    />
  );
};
