import React, { useCallback, useState, useEffect } from "react";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
axios.defaults.withCredentials = true;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface UserContextInterface {
  login: (username: string) => Promise<string>
  logout: () => void;
  user: { username: string; _id: string } | null;
  getAuthCookie: () => string;
}

export const UserContext = React.createContext<UserContextInterface>(
  { login: () => Promise.resolve(''), logout: () => { }, user: null, getAuthCookie: () => '' }
);

export default function UserProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  function login(username: string) {
    return axios.post('http://localhost/api/login', { username })
      .then(res => {
        // only have here for dev.
        document.cookie = 'auth=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJvaWRob3VzZSIsIl9pZCI6IjVlODRmNjg5NTk0MjY2MDAyMjA0Njk2YSIsImlhdCI6MTU4NTc3MjE2OSwiZXhwIjoxNTg1ODE1MzY5fQ.bThf_s6Gg8adfNEj346nyllaxY6cfkFq2dy-drE-T9s';
        const token = getAuthCookie();
        const data: any = jwt.decode(token);
        setUser(data)
        setHasLoggedIn(true);
        const { message } = res.data;
        return message;
      })
      .catch(err => {
        throw err.response?.data ? err.response.data.message : 'Something went wrong.'
      });
  }

  const logout = useCallback(_logout, [setUser]);
  function _logout() {
    document.cookie = 'auth=;'
    setUser(null);
  }

  function getAuthCookie() {
    var cn = "auth=";
    var idx = document.cookie.indexOf(cn)

    if (idx !== -1) {
      var end = document.cookie.indexOf(";", idx + 1);
      if (end === -1) end = document.cookie.length;
      return unescape(document.cookie.substring(idx + cn.length, end));
    } else {
      return "";
    }
  }

  useEffect(() => {
    const token = getAuthCookie();
    const data: any = jwt.decode(token.slice(7));
    setUser(data)
  }, [logout, setUser]);

  return <UserContext.Provider value={{ login, logout, user, getAuthCookie }}>
    {children}

    <Snackbar open={hasLoggedIn} autoHideDuration={3000} onClose={() => setHasLoggedIn(false)} >
      <Alert severity="success">
        Successfully logged in!
        </Alert>
    </Snackbar>
  </UserContext.Provider>
}