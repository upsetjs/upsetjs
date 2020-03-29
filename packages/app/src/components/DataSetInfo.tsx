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
      <Typography variant="subtitle2">#Sets:</Typography>
      <Typography>{store.sets.length}</Typography>
      <Typography variant="subtitle2">Author:</Typography>
      <Typography>{ds?.author}</Typography>
      <Typography variant="subtitle2">Description:</Typography>
      <Typography>{ds?.description}</Typography>
    </SidePanelEntry>
  );
});
