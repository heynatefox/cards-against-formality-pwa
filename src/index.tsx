import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import App from './App';
import UserProvider from './Contexts/UserProvider';
import * as serviceWorker from './serviceWorker';
import './index.scss';

const theme = createMuiTheme({
  palette: {
    type: "light"
  }
});

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
