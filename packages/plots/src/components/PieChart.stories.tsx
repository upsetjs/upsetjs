/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import PieChart, { PieChartProps } from './PieChart';
import { UpSetSelection } from '@upsetjs/react';

export default {
  component: PieChart,
  title: 'Components/PieChart',
};

function InteractivePieChart(props: PieChartProps<any>) {
  const [selection, setSelection] = useState<UpSetSelection<any>>(null);
  return <PieChart selection={selection} onHover={setSelection} {...props} />;
}

const elems = Array(100)
  .fill(0)
  .map(() => ({
    a: Math.floor(Math.random() * 4).toString(),
  }));

export const Default = () => {
  return <PieChart width={500} height={500} elems={elems} attr="a" title="As" />;
};

export const Interactive = () => {
  return <InteractivePieChart width={500} height={500} elems={elems} attr="a" title="As" />;
};

export const Selection = () => {
  return <PieChart width={500} height={500} elems={elems} attr="a" title="As" selection={elems.slice(0, 7)} />;
};
