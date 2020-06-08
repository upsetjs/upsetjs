/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { VennDiagram } from './VennDiagram';
import { extractSets, ISetLike, asSets } from '@upsetjs/model';
import got from '../data/got.json';

export default {
  component: VennDiagram,
  title: 'VennDiagram',
};

const style = {};
const elems = got;
const sets = extractSets(elems).slice(0, 3);

const queries = [
  { name: 'Q1', color: 'steelblue', elems: elems.filter(() => Math.random() > 0.7) },
  { name: 'Q2', color: 'red', elems: elems.filter(() => Math.random() > 0.8) },
];

const common = { sets, width: 1200, height: 500, style };

export const Default = () => {
  return <VennDiagram sets={sets} width={1200} height={500} />;
};

export const Title = () => {
  return (
    <VennDiagram
      sets={sets}
      width={1200}
      height={500}
      title="Game of Thrones"
      description="Information about the characters of the tv series Game of Thrones"
    />
  );
};

export const Interactivity = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <VennDiagram {...common} selection={selection} onHover={setSelection} />;
};

export const DarkTheme = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return (
    <VennDiagram
      {...common}
      selection={selection}
      onHover={setSelection}
      theme="dark"
      style={{ backgroundColor: '#303030' }}
    />
  );
};

export const Click = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <VennDiagram {...common} selection={selection} onClick={setSelection} />;
};

export const Queries = () => {
  return <VennDiagram {...common} queries={queries} queryLegend />;
};

export const SmallSets = () => {
  return (
    <div>
      <VennDiagram
        {...common}
        sets={asSets([
          { name: 'one', elems: [1, 2, 3, 5, 7, 8, 11, 12, 13] },
          { name: 'two', elems: [1, 2, 4, 5, 10] },
          { name: 'three', elems: [1, 5, 6, 7, 8, 9, 10, 12, 13] },
        ])}
      />
      <VennDiagram
        {...common}
        sets={asSets([
          { name: 'one', elems: [1, 2, 3] },
          { name: 'two', elems: [1, 2, 4, 5] },
          { name: 'three', elems: [1, 5] },
        ])}
      />
    </div>
  );
};
