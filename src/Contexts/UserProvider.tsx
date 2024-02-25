import React, { useCallback, useState, useEffect, useContext, useRef } from "react";
import { Backdrop, CircularProgress } from '@material-ui/core';
import firebase from "firebase/app";
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
      unsubscribe = firebase.auth().onAuthStateChanged((_user) => {
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
      firebase.auth().currentUser?.getIdToken(true)
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

  function isPhoneOrTablet() {
    let check = false;
    // eslint-disable-next-line no-useless-escape
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || (window as any).opera);
    return check;
  }

  function signup(providerStr: string): Promise<any> {
    setIsProviderSigningIn(true);
    // here we should handle the different sign up types.
    if (providerStr === 'anonymous') {
      return firebase.auth().signInAnonymously()
        .catch((err) => { });
    }

    let provider: firebase.auth.GoogleAuthProvider | firebase.auth.FacebookAuthProvider;
    if (providerStr === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    } else {
      // must be google.
      provider = new firebase.auth.GoogleAuthProvider();
    }

    return firebase.auth().signInWithPopup(provider)
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

    return firebase.auth().signOut()
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