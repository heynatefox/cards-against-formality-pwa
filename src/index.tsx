import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './App';
import ConfigContext from './Contexts/ConfigContext';
import ThemeProvider from './Contexts/ThemeProvider';
import SnackbarProvider from './Contexts/SnackbarProvider';
import './index.scss';

const config = { baseUrl: 'https://api.cardsagainstformality.io' };
if (!import.meta.env.PROD) {
  config.baseUrl = `http://${window.location.hostname}:8000`;
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ConfigContext.Provider value={config}>
      <ThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ConfigContext.Provider>
  </React.StrictMode>
);
