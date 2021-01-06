/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import Scatterplot, { ScatterplotProps } from './Scatterplot';
import { UpSetSelection } from '@upsetjs/react';

const stories = {
  component: Scatterplot,
  title: 'Components/Scatterplot',
};
export default stories;

function InteractiveScatterplot(props: ScatterplotProps<any>) {
  const [selection, setSelection] = useState<UpSetSelection<any>>(null);
  return <Scatterplot selection={selection} onClick={setSelection} {...props} />;
}
const elems = Array(100)
  .fill(0)
  .map(() => ({
    a: Math.random(),
    b: Math.random(),
  }));

export const Default = () => {
  return <Scatterplot width={500} height={500} elems={elems} xAttr="a" yAttr="b" title="As" />;
};

export const Interactive = () => {
  return <InteractiveScatterplot width={500} height={500} elems={elems} xAttr="a" yAttr="b" title="As" />;
};

export const Hover = () => {
  return (
    <InteractiveScatterplot
      width={500}
      height={500}
      elems={elems}
      xAttr="a"
      yAttr="b"
      title="As"
      onHover={(v) => console.log(v)}
    />
  );
};

export const Queries = () => {
  return (
    <InteractiveScatterplot
      width={500}
      height={500}
      elems={elems}
      xAttr="a"
      yAttr="b"
      title="As"
      queries={[{ name: 'test', color: 'green', elems: elems.slice(0, 10) }]}
    />
  );
};
