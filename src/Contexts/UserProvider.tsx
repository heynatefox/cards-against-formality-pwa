import React, { useCallback, useState, useEffect, useContext, useRef } from "react";
import axios from 'axios';
import { Snackbar, Backdrop, CircularProgress } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import * as firebase from "firebase/app";

import useFetchData, { FetchType } from "../Hooks/useFetchData";
import { RouterContext } from "./RouteProvider";
axios.defaults.withCredentials = true;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export interface UserContextInterface {
  login: (username: string) => Promise<string>;
  signup: (provider: string) => Promise<any>;
  logout: () => void;
  user: { _id: string, username: string, isAnonymous: boolean } | null;
  authUser: any | null;
  token: string;
}

export const UserContext = React.createContext<UserContextInterface>(
  { login: () => Promise.resolve(''), logout: () => { }, signup: () => Promise.resolve(), user: null, authUser: null, token: '' }
);

export default function UserProvider({ children, isFirebaseInit }: any) {
  const routerContext = useContext(RouterContext);
  const routerRef = useRef(routerContext);
  useEffect(() => {
    routerRef.current = routerContext;
  }, [routerContext]);

  const [token, setToken] = useState('');
  const [user, setUser] = useState<{ _id: string, username: string, isAnonymous: boolean } | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [renewData, isRenewing, , renew] = useFetchData<any>(`${window.location.protocol}//${window.location.hostname}/api/login/renew`, FetchType.PUT);
  const [loginData, isSigningin, , next] = useFetchData<any>(`${window.location.protocol}//${window.location.hostname}/api/login`, FetchType.POST);

  const logout = useCallback(_logout, [setUser, setToken]);

  const [authUser, setAuthUser] = useState<any | null>(null);
  const login = useCallback(_login, [next, authUser]);
  useEffect(() => {
    // get the initial state of the user.
    let unsubscribe: any;
    if (isFirebaseInit) {
      unsubscribe = firebase.auth().onAuthStateChanged((_user) => {
        if (_user) {
          _user.getIdToken(true).then(idToken => {
            setToken(idToken)
            const { uid, displayName, photoURL, email, emailVerified, phoneNumber, isAnonymous } = _user;
            setAuthUser({ uid, displayName, photoURL, email, emailVerified, phoneNumber, isAnonymous });
          })
        } else {
          setAuthUser(null);
          routerRef.current.history.push('/login')
        }
        setIsLoadingAuth(false)
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [isFirebaseInit]);

  // called after it is determined whether a firebase user is logged in.
  useEffect(() => {
    // if there is an auth user. Try login.
    if (authUser && token && renew) {
      renew({}, false, token)
        .catch(() => {
          if (authUser.isAnonymous) {
            next(authUser).catch(err => console.log(err));
          }
        })
    }
  }, [authUser, token, renew, next]);

  // Called once renewed or logged in.
  useEffect(() => {
    if (renewData) {
      setUser(renewData);
    } else if (loginData) {
      setUser(loginData);
    }
  }, [loginData, renewData])

  // called once the users data is fetched.
  useEffect(() => {
    // if loginData exists, continue to the application.
    if (user && authUser && token) {
      setHasLoggedIn(true);
      redirect();
    }
  }, [user, authUser, token]);

  function redirect() {
    if (!routerRef?.current) {
      return;
    }

    const { prevLocation, history } = routerRef.current;
    // If there's no prevLocation (first request) and the path doesn't equal login. Go to desired path.
    if (!prevLocation && history.location.pathname !== '/login') {
      return;
    }

    let redirectPath = '/rooms';
    if (prevLocation) {
      const userDest = `${prevLocation.pathname}${prevLocation.search}`;
      if (userDest !== '/login') {
        redirectPath = userDest;
      }
    }

    history.push(redirectPath);
  }

  function signup(providerStr: string): Promise<any> {
    // here we should handle the different sign up types.
    if (providerStr === 'anonymous') {
      return firebase.auth().signInAnonymously()
        .catch((err) => { console.log(err) });
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithRedirect(provider)
      .catch(err => console.log(err));

  }

  function _login(username: string) {
    return next({ username, ...authUser });
  }

  function _logout() {
    const handleComplete = () => {
      setHasLoggedIn(false);
      setUser(null);
      setAuthUser(null);
      setToken('');
      routerRef.current.history.push('/');
      document.cookie = 'auth=;'
    };

    return firebase.auth().signOut()
      .then(() => {
        handleComplete();
      })
      .catch(() => {
        handleComplete();
      })
  }

  function renderChildren() {
    if (isLoadingAuth || isRenewing || isSigningin) {
      return <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>;
    }

    return children;
  }
  return <UserContext.Provider value={{ login: (login as any), logout, user, authUser, token, signup }}>
    {renderChildren()}

    <Snackbar open={hasLoggedIn} autoHideDuration={3000} onClose={() => setHasLoggedIn(false)} >
      <Alert severity="success">
        Successfully logged in!
        </Alert>
    </Snackbar>
  </UserContext.Provider>
}