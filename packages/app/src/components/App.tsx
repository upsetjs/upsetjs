import React from 'react';
import { StoreProvider } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SidePanel from './SidePanel';
import RightSidePanel from './RightSidePanel';
import UpSetWrapper from './UpSetWrapper';
import Header from './Header';

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

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoreProvider>
          <Header />
          <main className={classes.main}>
            <SidePanel />
            <UpSetWrapper />
            <RightSidePanel />
          </main>
        </StoreProvider>
      </ThemeProvider>
    </div>
  );
}
