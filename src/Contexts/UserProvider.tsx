import React, { useCallback, useState, useEffect, useContext, useRef } from "react";
import { Backdrop, CircularProgress } from '@material-ui/core';
import { auth } from "firebase/app";
import "firebase/auth";

import useFetchData, { FetchType } from "../Hooks/useFetchData";
import { RouterContext } from "./RouteProvider";
import { SnackbarContext } from "./SnackbarProvider";

export interface UserContextInterface {
  login: (username: string) => Promise<string>;
  signup: (provider: string) => Promise<any>;
  logout: () => void;
  user: { _id: string, username: string, isAnonymous: boolean } | null;
  authUser: any | null;
}

export const UserContext = React.createContext<UserContextInterface>(
  { login: () => Promise.resolve(''), logout: () => { }, signup: () => Promise.resolve(), user: null, authUser: null }
);

export default function UserProvider({ children, isFirebaseInit }: any) {
  const { openSnack } = useContext(SnackbarContext);
  const routerContext = useContext(RouterContext);
  const routerRef = useRef(routerContext);
  useEffect(() => {
    routerRef.current = routerContext;
  }, [routerContext]);

  const [user, setUser] = useState<{ _id: string, username: string, isAnonymous: boolean } | null>(null);

  const [isProviderSigningIn, setIsProviderSigningIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [renewData, isRenewing, , renew] = useFetchData<any>(`/api/login/renew`, FetchType.PUT);
  const [, , , logoutHttp] = useFetchData<any>(`/api/logout`, FetchType.PUT);
  const [loginData, isSigningin, , next] = useFetchData<any>(`/api/login`, FetchType.POST);

  const logout = useCallback(_logout, [setUser, logoutHttp]);

  const [authUser, setAuthUser] = useState<any | null>(null);
  const login = useCallback(_login, [next, authUser]);
  useEffect(() => {
    // get the initial state of the user.
    let unsubscribe: any;
    if (isFirebaseInit) {
      unsubscribe = auth().onAuthStateChanged((_user) => {
        if (_user) {
          _user.getIdToken(true).then(() => {
            const { uid, displayName, photoURL, email, emailVerified, phoneNumber, isAnonymous } = _user;
            setAuthUser({ uid, displayName, photoURL, email, emailVerified, phoneNumber, isAnonymous });
            setIsProviderSigningIn(false);
          })
        } else {
          setAuthUser(null);
          if (routerRef.current.location.pathname !== '/') {
            routerRef.current.history.push('/login')
          }
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

  useEffect(() => {
    setInterval(() => {
      auth().currentUser?.getIdToken(true)
        .catch(() => { });
      // Refresh token every 30 minutes.
    }, 60000 * 30)
  }, [])

  // called after it is determined whether a firebase user is logged in.
  useEffect(() => {
    // if there is an auth user. Try login.
    if (authUser && renew) {
      renew({}, false)
        .catch((err) => {
          if (err.message === 'Network Error') {
            // api servers are down, redirect to /rooms to see the error page.
            routerRef.current.history.push('/rooms');
            return;
          }
        })
    }
  }, [authUser, renew, next]);

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
    if (user && authUser) {
      openSnack({ text: 'Successfully logged in!', severity: 'success' })
      redirect();
    }
  }, [user, authUser, openSnack]);

  // Handle smoother transitions between multiple loading states
  useEffect(() => {
    const newIsLoading = isLoadingAuth || isRenewing || isSigningin || isProviderSigningIn;
    let timeout: NodeJS.Timeout;
    // If the next loading state is false. Set a timeout.
    if (!newIsLoading) {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(true);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoadingAuth, isRenewing, isSigningin, isProviderSigningIn])

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
      if (userDest !== '/login' && userDest !== '/') {
        redirectPath = userDest;
      }
    }

    history.push(redirectPath);
  }

  function signup(providerStr: string): Promise<any> {
    setIsProviderSigningIn(true);
    // here we should handle the different sign up types.
    if (providerStr === 'anonymous') {
      return auth().signInAnonymously()
        .catch((err) => { });
    }

    let provider: auth.GoogleAuthProvider | auth.FacebookAuthProvider;
    if (providerStr === 'facebook') {
      provider = new auth.FacebookAuthProvider();
    } else {
      // must be google.
      provider = new auth.GoogleAuthProvider();
    }

    if (window.innerWidth < 600) {
      return auth().signInWithRedirect(provider)
        .catch(err => { });
    }

    return auth().signInWithPopup(provider)
      .catch(err => { });
  }

  function _login(username: string) {
    return next({ username, ...authUser });
  }

  function _logout() {
    const handleComplete = () => {
      setUser(null);
      setAuthUser(null);
      routerRef.current.history.push('/');
      document.cookie = 'auth=;'
    };

    return auth().signOut()
      .then(() => logoutHttp())
      .then(() => {
        handleComplete();
      })
      .catch(() => {
        handleComplete();
      })
  }

  return <UserContext.Provider value={{ login: (login as any), logout, user, authUser, signup }}>
    {isLoading ? null : children}
    <Backdrop className="backdrop" open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  </UserContext.Provider>
}