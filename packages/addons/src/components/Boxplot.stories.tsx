import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import React from 'react';
import { boxplotAddon } from './Boxplot';
import UpSet, { extractSets } from '@upsetjs/react';

export default {
  title: 'UpSet Box plot Addon',
  parameters: {
    docs: {
      container: DocsContainer,
      page: DocsPage,
    },
  },
};

interface IElem {
  name: string;
  sets: string[];
  value: number;
}
const elems: IElem[] = [];
const sets = extractSets(elems);

export const Default = () => {
  return <UpSet sets={sets} width={1200} height={500} setAddons={[boxplotAddon('value', elems)]} />;
};
