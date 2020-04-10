import React, { useCallback, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import useFetchData, { FetchType } from "../Hooks/useFetchData";
import { RouterContext } from "./RouteProvider";
axios.defaults.withCredentials = true;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface UserContextInterface {
  login: (username: string) => Promise<string>
  logout: () => void;
  user: { username: string; _id: string, displayName: string } | null;
  token: string;
}

export const UserContext = React.createContext<UserContextInterface>(
  { login: () => Promise.resolve(''), logout: () => { }, user: null, token: '' }
);

export default function UserProvider({ children }: any) {
  const { history, prevLocation } = useContext(RouterContext);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [renewData] = useFetchData<any>('http://localhost/api/login/renew', FetchType.GET);
  const [loginData, , , next] = useFetchData<any>('http://localhost/api/login', FetchType.POST);

  // NEED TO MAKE HISTORY AND PREV LOCATION AS REFS SO LOGIN DOESNT RE-RENDER
  const login = useCallback(_login, [next, history, prevLocation]);

  useEffect(() => {
    if (renewData) {
      const { jwt, ..._user } = renewData;
      setUser(_user);
      setToken(jwt);
    }
  }, [renewData]);

  useEffect(() => {
    if (loginData) {
      const { jwt, ..._user } = loginData;
      setUser(_user);
      setToken(jwt);
    }
  }, [loginData]);

  function _login(username: string) {
    return next({ username })
      .then((res) => {
        setHasLoggedIn(true);
        let redirectPath = '/rooms';
        if (prevLocation) {
          const userDest = `${prevLocation.pathname}${prevLocation.search}`;
          if (userDest !== '/login') {
            redirectPath = userDest;
          }
        }

        history.push(redirectPath);
        return res;
      })
      .catch(err => {
        throw err.response?.data ? err.response.data.message : 'Something went wrong.'
      });
  }

  const logout = useCallback(_logout, [history, setUser, setToken]);
  function _logout() {
    // investigate why token and user aren't being reset.
    setUser(null);
    setToken('');
    history.push('/');
    document.cookie = 'auth=;'
  }

  return <UserContext.Provider value={{ login, logout, user, token }}>
    {children}

    <Snackbar open={hasLoggedIn} autoHideDuration={3000} onClose={() => setHasLoggedIn(false)} >
      <Alert severity="success">
        Successfully logged in!
        </Alert>
    </Snackbar>
  </UserContext.Provider>
}