import React from 'react';
import UpSet, { InteractiveUpSet } from './UpSet';
import { extractSets } from '../data';

export default {
  component: UpSet,
  title: 'UpSet',
};

const style = {};
const base = Array.from('ABCDEF');
const elems = Array(100)
  .fill(0)
  .map(() => ({ sets: base.filter(() => Math.random() > 0.7) }));
const sets = extractSets(elems);

const queries = [
  { name: 'Q1', color: 'steelblue', elems: elems.filter(() => Math.random() > 0.7) },
  { name: 'Q2', color: 'red', elems: elems.filter(() => Math.random() > 0.8) },
];

const common = { sets, width: 1200, height: 500, style };

export const Default = () => {
  return <UpSet {...common} />;
};

export const Selection = () => {
  return <InteractiveUpSet {...common} />;
};

export const Queries = () => {
  return <UpSet {...common} queries={queries} />;
};
