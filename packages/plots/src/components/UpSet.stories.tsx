/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import UpSetJS, { extractSets, UpSetSelection } from '@upsetjs/react';
import Scatterplot from './Scatterplot';

export default {
  title: 'UpSetJS Plot Addons',
};

interface IElem {
  name: string;
  sets: string[];
  a: number;
  b: number;
}

const elems: IElem[] = [
  { name: '1', sets: ['one', 'two', 'three'], a: Math.random(), b: Math.random() },
  { name: '2', sets: ['one', 'two'], a: Math.random(), b: Math.random() },
  { name: '3', sets: ['one'], a: Math.random(), b: Math.random() },
  { name: '4', sets: ['two'], a: Math.random(), b: Math.random() },
  { name: '5', sets: ['one', 'two', 'three'], a: Math.random(), b: Math.random() },
  { name: '6', sets: ['three'], a: Math.random(), b: Math.random() },
  { name: '7', sets: ['one', 'three'], a: Math.random(), b: Math.random() },
  { name: '8', sets: ['one', 'three'], a: Math.random(), b: Math.random() },
  { name: '9', sets: ['three'], a: Math.random(), b: Math.random() },
  { name: '10', sets: ['two', 'three'], a: Math.random(), b: Math.random() },
  { name: '11', sets: ['one'], a: Math.random(), b: Math.random() },
  { name: '12', sets: ['one', 'three'], a: Math.random(), b: Math.random() },
  { name: '13', sets: ['one', 'three'], a: Math.random(), b: Math.random() },
];
const sets = extractSets(elems);

export const UpSetScatterplot = () => {
  const [selection, setSelection] = useState<UpSetSelection<IElem>>(null);

  return (
    <div>
      <UpSetJS selection={selection} onHover={setSelection} sets={sets} width={1200} height={500} />
      <Scatterplot
        selection={selection}
        onClick={setSelection}
        width={500}
        height={500}
        xAttr="a"
        yAttr="b"
        elems={elems}
      />
    </div>
  );
};
