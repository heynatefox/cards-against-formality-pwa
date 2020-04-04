import React, { useCallback, useState, useEffect } from "react";
import axios from 'axios';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import useFetchData, { FetchType } from "../Hooks/useFetchData";
axios.defaults.withCredentials = true;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface UserContextInterface {
  login: (username: string) => Promise<string>
  logout: () => void;
  user: { username: string; _id: string, displayName: string } | null;
}

export const UserContext = React.createContext<UserContextInterface>(
  { login: () => Promise.resolve(''), logout: () => { }, user: null }
);

export default function UserProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [renewData] = useFetchData<any>('http://localhost/api/login/renew', FetchType.GET);
  const [loginData, , , next] = useFetchData<any>('http://localhost/api/login', FetchType.POST);
  const login = useCallback(_login, [next]);

  useEffect(() => {
    setUser(renewData);
  }, [renewData]);
  useEffect(() => {
    setUser(loginData);
  }, [loginData]);

  function _login(username: string) {
    return next({ username })
      .catch(err => {
        throw err.response?.data ? err.response.data.message : 'Something went wrong.'
      });
  }

  const logout = useCallback(_logout, []);
  function _logout() {
    document.cookie = 'auth=;'
    setUser(null);
  }

  return <UserContext.Provider value={{ login, logout, user }}>
    {children}

    <Snackbar open={hasLoggedIn} autoHideDuration={3000} onClose={() => setHasLoggedIn(false)} >
      <Alert severity="success">
        Successfully logged in!
        </Alert>
    </Snackbar>
  </UserContext.Provider>
}