import React from 'react';
import { StoreProvider } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import SidePanel from './SidePanel';
import UpSetWrapper from './UpSetWrapper';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <StoreProvider>
        <SidePanel />
        <UpSetWrapper />
      </StoreProvider>
    </div>
  );
}
