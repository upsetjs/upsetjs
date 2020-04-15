import { observer } from 'mobx-react-lite';
import React from 'react';
import { StoreProvider, useStore } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Content from './Content';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const AppWrapper = observer(() => {
  const store = useStore();
  return (
    <ThemeProvider theme={store.ui.theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Content />
    </ThemeProvider>
  );
});

export default function App() {
  return (
    <StoreProvider>
      <AppWrapper />
    </StoreProvider>
  );
}
