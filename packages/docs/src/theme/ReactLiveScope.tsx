import React from 'react';
import * as model from '@upsetjs/model';
import * as plots from '@upsetjs/plots';
import * as react from '@upsetjs/react';
import * as addons from '@upsetjs/addons';

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  ...model,
  ...addons,
  ...plots,
  ...react,
};
delete ReactLiveScope.default;

export default ReactLiveScope;
