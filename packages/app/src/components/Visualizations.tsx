/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { observer } from 'mobx-react-lite';
import React from 'react';
// import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

export default observer(() => {
  // const store = useStore();

  return (
    <SidePanelEntry id="vis" title="Attribute Vis">
      TODO
    </SidePanelEntry>
  );
});
