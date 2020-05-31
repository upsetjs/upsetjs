/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import UpSetJS, { extractSets, UpSetSelection } from '@upsetjs/react';
import Scatterplot from './Scatterplot';
import Histogram from './Histogram';
import BarChart from './BarChart';
import PieChart from './PieChart';

export default {
  title: 'UpSetJS Plot Addons',
};

interface IElem {
  name: string;
  sets: string[];
  a: number;
  b: number;
  c: string;
}

const cats = ['c1', 'c2', 'c3'];

const elems: IElem[] = [
  {
    name: '1',
    sets: ['one', 'two', 'three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '2',
    sets: ['one', 'two'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '3',
    sets: ['one'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '4',
    sets: ['two'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '5',
    sets: ['one', 'two', 'three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '6',
    sets: ['three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '7',
    sets: ['one', 'three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '8',
    sets: ['one', 'three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '9',
    sets: ['three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '10',
    sets: ['two', 'three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '11',
    sets: ['one'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '12',
    sets: ['one', 'three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
  {
    name: '13',
    sets: ['one', 'three'],
    a: Math.random(),
    b: Math.random(),
    c: cats[Math.min(cats.length - 1, Math.floor(Math.random() * cats.length))],
  },
];
const sets = extractSets(elems);

export const UpSetScatterplot = () => {
  const [selection, setSelection] = useState<UpSetSelection<IElem>>(null);

  const f = 0.75;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <UpSetJS selection={selection} onHover={setSelection} sets={sets} width={1200 * f} height={500 * f} />
      <Scatterplot
        selection={selection}
        onClick={setSelection}
        // onHover={setSelection}
        width={500 * f}
        height={500 * f}
        xAttr="a"
        yAttr="b"
        elems={elems}
        actions={false}
      />
      <Histogram
        selection={selection}
        onHover={setSelection}
        width={500 * f}
        height={300 * f}
        attr="a"
        elems={elems}
        actions={false}
      />
      <BarChart
        selection={selection}
        onHover={setSelection}
        width={500 * f}
        height={300 * f}
        vAttr="a"
        iAttr="name"
        elems={elems}
        actions={false}
      />
      <PieChart
        selection={selection}
        onHover={setSelection}
        width={500 * f}
        height={500 * f}
        attr="c"
        elems={elems}
        actions={false}
      />
    </div>
  );
};