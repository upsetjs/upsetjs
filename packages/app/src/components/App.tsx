import React from 'react';
import { StoreProvider } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import SidePanel from './SidePanel';
import UpSetWrapper from './UpSetWrapper';
import Header from './Header';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <StoreProvider>
        <SidePanel />
        <main className={classes.main}>
          <Header />
          <UpSetWrapper />
        </main>
      </StoreProvider>
    </div>
  );
}
