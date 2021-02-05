import React from 'react';

// Add react-live imports you need here
const ReactLiveScope = {
  // TODO
  React,
  ...React,
};
delete ReactLiveScope.default;

export default ReactLiveScope;
