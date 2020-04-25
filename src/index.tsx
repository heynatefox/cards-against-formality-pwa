import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'


import App from './App';
import ConfigContext from './Contexts/ConfigContext';
import RouteProvider from './Contexts/RouteProvider';
import * as serviceWorker from './serviceWorker';
import './index.scss';

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const config = { baseUrl: 'https://api.cardsagainstformality.io' };
if (process.env.NODE_ENV !== 'production') {
  config.baseUrl = `http://${window.location.hostname}`;
}


ReactDOM.render(
  <React.StrictMode>
    <ConfigContext.Provider value={config}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <RouteProvider>
          <App />
        </RouteProvider>
      </MuiThemeProvider>
    </ConfigContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
