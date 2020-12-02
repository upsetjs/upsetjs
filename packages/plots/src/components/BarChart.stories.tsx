/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import BarChart, { BarChartProps } from './BarChart';
import { UpSetSelection } from '@upsetjs/react';

const stories = {
  component: BarChart,
  title: 'Components/BarChart',
};
export default stories;

function InteractiveBarChart(props: BarChartProps<any>) {
  const [selection, setSelection] = useState<UpSetSelection<any>>(null);
  return <BarChart selection={selection} onHover={setSelection} {...props} />;
}

const elems = Array(10)
  .fill(0)
  .map((_, i) => ({
    n: i.toString(),
    a: Math.random(),
  }));

export const Default = () => {
  return <BarChart width={500} height={100} elems={elems} vAttr="a" iAttr="n" />;
};

export const Interactive = () => {
  return <InteractiveBarChart width={500} height={100} elems={elems} vAttr="a" iAttr="n" />;
};

export const Selection = () => {
  return <BarChart width={500} height={100} elems={elems} vAttr="a" iAttr="n" selection={elems.slice(0, 7)} />;
};

export const Queries = () => {
  return (
    <BarChart
      width={500}
      height={100}
      elems={elems}
      vAttr="a"
      iAttr="n"
      queries={[{ name: 'test', color: 'green', elems: elems.slice(0, 10) }]}
    />
  );
};
