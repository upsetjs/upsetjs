/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { StoreProvider, useStore } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Content from './Content';
// import gray from '@material-ui/core/colors/gray';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    // secondary: gray,
  },
});

const AppWrapper = observer(() => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const store = useStore();
  useEffect(() => {
    if (store.ui.defaultTheme == null) {
      store.ui.defaultTheme = prefersDarkMode ? 'dark' : 'light';
    }
  });
  return (
    <ThemeProvider
      theme={
        store.ui.defaultTheme === 'dark' || (store.ui.defaultTheme == null && prefersDarkMode) ? darkTheme : lightTheme
      }
    >
      <CssBaseline />
      <Content />
    </ThemeProvider>
  );
});

export default function App(): JSX.Element {
  return (
    <StoreProvider>
      <AppWrapper />
    </StoreProvider>
  );
}
