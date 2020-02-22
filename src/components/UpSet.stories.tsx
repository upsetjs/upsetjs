import React from 'react';
import UpSet from './UpSet';

export default {
  component: UpSet,
  title: 'UpSet',
};

const style = {};
const data = Array(100)
  .fill(0)
  .map(() => Math.random());

const common = { data, width: 1200, height: 500, style };

export const Default = () => {
  return <UpSet {...common} />;
};
