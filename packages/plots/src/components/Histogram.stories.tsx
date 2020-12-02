/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import Histogram, { HistogramProps } from './Histogram';
import { UpSetSelection } from '@upsetjs/react';

const stories = {
  component: Histogram,
  title: 'Components/Histogram',
};
export default stories;

function InteractiveHistogram(props: HistogramProps<any>) {
  const [selection, setSelection] = useState<UpSetSelection<any>>(null);
  return <Histogram selection={selection} onHover={setSelection} {...props} />;
}

const elems = Array(100)
  .fill(0)
  .map(() => ({
    a: Math.random(),
  }));

export const Default = () => {
  return <Histogram width={500} height={100} elems={elems} attr="a" title="As" />;
};

export const Interactive = () => {
  return <InteractiveHistogram width={500} height={100} elems={elems} attr="a" title="As" />;
};

export const Selection = () => {
  return <Histogram width={500} height={100} elems={elems} attr="a" title="As" selection={elems.slice(0, 7)} />;
};

export const Queries = () => {
  return (
    <InteractiveHistogram
      width={500}
      height={100}
      elems={elems}
      attr="a"
      title="As"
      queries={[{ name: 'test', color: 'green', elems: elems.slice(0, 10) }]}
    />
  );
};
