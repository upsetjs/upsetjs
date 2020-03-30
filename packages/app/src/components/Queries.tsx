import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../store';
import SidePanelEntry from './SidePanelEntry';

const useStyles = makeStyles(() => ({
  root: {},
}));

export default observer(() => {
  const store = useStore();
  const classes = useStyles();

  return (
    <SidePanelEntry id="queries" title="Queries" className={classes.root}>
      {store.queries.map((q) => q.name)}
    </SidePanelEntry>
  );
});
