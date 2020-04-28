import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';


import App from './App';
import ConfigContext from './Contexts/ConfigContext';
import ThemeProvider from './Contexts/ThemeProvider';
import RouteProvider from './Contexts/RouteProvider';
import SnackbarProvider from './Contexts/SnackbarProvider';
import * as serviceWorker from './serviceWorker';
import './index.scss';

const config = { baseUrl: 'https://api.cardsagainstformality.io' };
if (process.env.NODE_ENV !== 'production') {
  config.baseUrl = `http://${window.location.hostname}`;
}


ReactDOM.render(
  <React.StrictMode>
    <ConfigContext.Provider value={config}>
      <ThemeProvider>
        <CssBaseline />
        <RouteProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </RouteProvider>
      </ThemeProvider>
    </ConfigContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
