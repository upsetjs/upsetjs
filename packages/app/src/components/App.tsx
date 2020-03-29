import React from 'react';
import { StoreProvider } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import SidePanel from './SidePanel';
import UpSetWrapper from './UpSetWrapper';
import Header from './Header';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  main: {
    flexGrow: 1,
    display: 'flex',
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CssBaseline />
      <StoreProvider>
        <Header />
        <main className={classes.main}>
          <SidePanel />
          <UpSetWrapper />
        </main>
      </StoreProvider>
    </Card>
  );
}
