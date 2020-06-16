/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';
import VennDiagramWrapper from './VennDiagramWrapper';

export default observer(() => {
  const store = useStore();
  return (
    <SidePanelEntry id="venn" title="Venn Diagram">
      {store.ui.sidePanelExpanded.has('venn') && <VennDiagramWrapper />}
    </SidePanelEntry>
  );
});
