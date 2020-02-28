import React from 'react';
import UpSet, { InteractiveUpSet } from './UpSet';
import { extractSets } from '../data';

export default {
  component: UpSet,
  title: 'UpSet',
};

const style = {};
const base = Array.from('ABCDEF');
const sets = extractSets(
  Array(100)
    .fill(0)
    .map(() => ({ sets: base.filter(() => Math.random() > 0.7) }))
);

const common = { sets, width: 1200, height: 500, style };

export const Default = () => {
  return <UpSet {...common} />;
};

export const Selection = () => {
  return <InteractiveUpSet {...common} />;
};
