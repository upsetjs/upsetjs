/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

export default observer(() => {
  const store = useStore();

  const ds = store.dataset;
  return (
    <SidePanelEntry id="datasetinfo" title="Dataset Information">
      <Typography variant="subtitle2">Name:</Typography>
      <Typography>{ds?.name}</Typography>
      <Typography variant="subtitle2">#Sets: {store.sets.length}</Typography>
      <Typography variant="subtitle2">#Items: {store.elems.length}</Typography>
      <Typography variant="subtitle2">#Attributes: {store.dataset?.attrs.length ?? 0}</Typography>
      <Typography variant="subtitle2">Author:</Typography>
      <Typography>{ds?.author}</Typography>
      <Typography variant="subtitle2">Description:</Typography>
      <Typography>{ds?.description}</Typography>
    </SidePanelEntry>
  );
});
