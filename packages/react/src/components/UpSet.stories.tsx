import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import React from 'react';
import UpSet from './UpSet';
import { extractSets, ISetLike, generateUnions, asSets } from '@upsetjs/model';

export default {
  component: UpSet,
  title: 'UpSet',
  parameters: {
    docs: {
      container: DocsContainer,
      page: DocsPage,
    },
  },
};

const style = {};
const elems = [
  { name: 'Lisa', sets: ['School'] },
  { name: 'Bart', sets: ['School', 'Male'] },
  { name: 'Homer', sets: ['Duff Fan', 'Male'] },
  { name: 'Marge', sets: ['Blue Hair'] },
  { name: 'Maggie', sets: [] },
  { name: 'Barney', sets: ['Duff Fan', 'Male'] },
  { name: 'Mr. Burns', sets: ['Evil', 'Male'] },
  { name: 'Mo', sets: ['Duff Fan', 'Male'] },
  { name: 'Ned', sets: ['Male'] },
  { name: 'Milhouse', sets: ['School', 'Blue Hair', 'Male'] },
  { name: 'Grampa', sets: ['Male'] },
  { name: 'Krusty', sets: ['Duff Fan', 'Evil', 'Male'] },
  { name: 'Smithers', sets: ['Evil', 'Male'] },
  { name: 'Ralph', sets: ['School', 'Male'] },
  { name: 'Sideshow Bob', sets: ['Evil', 'Male'] },
  { name: 'Kent Brockman', sets: ['Male'] },
  { name: 'Fat Tony', sets: ['Evil', 'Male'] },
  { name: 'Jacqueline Bouvier ', sets: ['Blue Hair'] },
  { name: 'Patty Bouvier', sets: [] },
  { name: 'Selma Bouvier', sets: [] },
  { name: 'Lenny Leonard', sets: ['Duff Fan', 'Male'] },
  { name: 'Carl Carlson', sets: ['Duff Fan', 'Male'] },
  { name: 'Nelson', sets: ['School', 'Evil', 'Male'] },
  { name: 'Martin Prince', sets: ['School', 'Male'] },
];
const sets = extractSets(elems);

const queries = [
  { name: 'Q1', color: 'steelblue', elems: elems.filter(() => Math.random() > 0.7) },
  { name: 'Q2', color: 'red', elems: elems.filter(() => Math.random() > 0.8) },
];

const common = { sets, width: 1200, height: 500, style };

export const Default = () => {
  return <UpSet {...common} />;
};

export const DarkTheme = () => {
  return <UpSet {...common} theme="dark" style={{ backgroundColor: '#303030' }} />;
};

export const Unions = () => {
  return <UpSet {...common} combinations={generateUnions(sets)} combinationName="Union Size" />;
};

export const Interactivity = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <UpSet {...common} selection={selection} onHover={setSelection} />;
};

export const Click = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <UpSet {...common} selection={selection} onClick={setSelection} />;
};

export const Queries = () => {
  return <UpSet {...common} queries={queries} queryLegend />;
};

export const SmallSets = () => {
  return (
    <div>
      <UpSet
        {...common}
        sets={asSets([
          { name: 'one', elems: [1, 2, 3, 5, 7, 8, 11, 12, 13] },
          { name: 'two', elems: [1, 2, 4, 5, 10] },
          { name: 'three', elems: [1, 5, 6, 7, 8, 9, 10, 12, 13] },
        ])}
      />
      <UpSet
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
