/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { common, darkBackgroundColor } from '../data';
import { InteractiveVennDiagram } from '../Interactive';
import VennDiagram from '../../venn/VennDiagram';

export default {
  component: VennDiagram,
  title: 'VennDiagram/Themes+Colors',
};

export const Default = () => {
  return <InteractiveVennDiagram {...common} />;
};

export const DarkTheme = () => {
  return <InteractiveVennDiagram {...common} theme="dark" style={{ backgroundColor: darkBackgroundColor }} />;
};

export const VegaTheme = () => {
  return <InteractiveVennDiagram {...common} theme="vega" />;
};

export const CustomTheming = () => {
  return (
    <InteractiveVennDiagram {...common} color="darkorchid" selectionColor="darkorchid" hasSelectionOpacity={0.6} />
  );
};
