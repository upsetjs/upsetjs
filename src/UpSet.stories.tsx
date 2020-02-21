import React from 'react';
import UpSet from './UpSet';

export default {
  component: UpSet,
  title: 'UpSet',
};

const style = {
  height: 50,
};
const data = Array(100)
  .fill(0)
  .map(() => Math.random());

const common = { data, style };

export const Default = () => {
  return <UpSet {...common} />;
};
