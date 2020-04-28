import React, { useState, useCallback } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

export interface SnackbarMessage {
  severity: 'success' | 'info' | 'warning' | 'error';
  text: string;
  autoHideDuration?: number;
}

export interface SnackbarInterface {
  message: SnackbarMessage | null;
  openSnack: (data: SnackbarMessage | null) => void;
}

export const SnackbarContext = React.createContext<SnackbarInterface>({ message: null, openSnack: () => { } });

export default function ThemeProvider({ children }: any) {
  const [message, setMessage] = useState<SnackbarMessage | null>(null)

  const onClose = useCallback(() => {
    setMessage(null);
  }, []);

  const openSnack = useCallback((data: SnackbarMessage | null) => {
    setMessage(data);
  }, []);

  return <SnackbarContext.Provider value={{ message, openSnack }}>
    <Snackbar
      open={!!message}
      autoHideDuration={message?.autoHideDuration ? message?.autoHideDuration : 3000}
      onClose={onClose}
    >
      {message ? <MuiAlert severity={message?.severity} elevation={6} variant="filled" >
        {message?.text}
      </MuiAlert> : null as any}
    </Snackbar>
    {children}
  </SnackbarContext.Provider >;
}
