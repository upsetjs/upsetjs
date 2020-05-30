/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import Histogram, { HistogramProps } from './Histogram';
import { UpSetSelection } from '../../../../.yarn/$$virtual/@upsetjs-react-virtual-66d30e5a77/1/packages/react/dist';

export default {
  component: Histogram,
  title: 'Components/Histogram',
};

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
