/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { common, darkBackgroundColor, sets, colors, mergeColors } from '../data';
import UpSetJS from '../../UpSetJS';
import { InteractiveUpSetJS } from '../Interactive';

export default {
  component: UpSetJS,
  title: 'UpSetJS/Themes+Colors',
};

export const Default = () => {
  return <InteractiveUpSetJS {...common} />;
};

export const DarkTheme = () => {
  return <InteractiveUpSetJS {...common} theme="dark" style={{ backgroundColor: darkBackgroundColor }} />;
};

export const VegaTheme = () => {
  return <InteractiveUpSetJS {...common} theme="vega" />;
};

export const CustomTheming = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      color="darkorchid"
      selectionColor="darkorchid"
      hasSelectionOpacity={0.6}
      alternatingBackgroundColor={false}
    />
  );
};

export const SetColors = () => {
  return (
    <InteractiveUpSetJS
      {...common}
      sets={sets.map((s, i) => ({ ...s, color: colors[i] }))}
      combinations={{
        mergeColors,
      }}
      hasSelectionOpacity={0.6}
      selectionColor=""
    />
  );
};
