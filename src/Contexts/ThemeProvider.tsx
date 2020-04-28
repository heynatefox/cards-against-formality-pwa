import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

const storageName = 'caf-themeName';
const defaultTheme = localStorage.getItem(storageName) as 'dark' | 'light' | null;

export interface ThemeContextInterface {
  name: 'dark' | 'light';
  onChange: () => void;
}

export const ThemeContext = React.createContext<ThemeContextInterface>({ name: 'dark', onChange: () => { } });

export default function ThemeProvider({ children }: any) {

  const [name, setName] = useState<'dark' | 'light'>(defaultTheme?.length ? defaultTheme : 'dark');
  const theme = useMemo(() => createMuiTheme({
    palette: {
      type: name
    }
  }), [name]);

  const onChange = useCallback(() => {
    setName(prevName => prevName === 'dark' ? 'light' : 'dark')
  }, []);

  useEffect(() => {
    if (name?.length) {
      // Use indexed-db in the future for async storage.
      localStorage.setItem(storageName, name)
    }
  }, [name]);

  return <ThemeContext.Provider value={{ name, onChange }}>
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  </ThemeContext.Provider>
}