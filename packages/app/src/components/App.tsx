import React from 'react';
import { StoreProvider } from '../store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Content from './Content';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoreProvider>
          <Content />
        </StoreProvider>
      </ThemeProvider>
    </div>
  );
}
