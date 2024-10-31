import React, { useCallback, useState, useEffect, useContext, useRef } from "react";
import { Backdrop, Button, CircularProgress } from '@material-ui/core';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

import useFetchData, { FetchType } from "../Hooks/useFetchData";
import { SnackbarContext } from "./SnackbarProvider";
import { useLocation, useNavigate, type Location } from "react-router";
import { FirebaseContext } from "./FirebaseProvider";
import { Nag } from "../components/Newsletter/Nag";

export interface UserContextInterface {
  login: (username: string) => Promise<string>;
  signup: (provider: string) => Promise<any>;
  logout: () => void;
  user: {
    _id: string,
    username: string,
    email?: string | null,
    isAnonymous: boolean,
  } | null;
  authUser: any | null;
}

export const UserContext = React.createContext<UserContextInterface>(
  { login: () => Promise.resolve(''), logout: () => { }, signup: () => Promise.resolve(), user: null, authUser: null }
);

export default function UserProvider({ children }: { children: any }) {
  const firebase = useContext(FirebaseContext);
  const { openSnack } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);
  const location = useLocation();
  const locationRef = useRef<{ current: Location, previous: Location | null }>({ current: location, previous: null });
  useEffect(() => {
    if (locationRef.current?.current) {
      locationRef.current.previous = locationRef.current.current;
    }
    locationRef.current.current = location;
  }, [location]);

  const [user, setUser] = useState<{ _id: string, username: string, email?: string | null, isAnonymous: boolean } | null>(null);

  const [isProviderSigningIn, setIsProviderSigningIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoting, setIsPromoting] = useState(false);
  const [renewData, isRenewing, , renew] = useFetchData<any>(`/api/login/renew`, FetchType.PUT);
  const [, , , logoutHttp] = useFetchData<any>(`/api/logout`, FetchType.PUT);
  const [loginData, isSigningin, , next] = useFetchData<any>(`/api/login`, FetchType.POST);

  const [authUser, setAuthUser] = useState<any | null>(null);

  const login = useCallback(
    (username: string) => next({ username, ...authUser }),
    [next, authUser]
  );

  const logout = useCallback(
    async () => {
      if (firebase) {
        const handleComplete = () => {
          setUser(null);
          setAuthUser(null);
          navigateRef.current('/');
          document.cookie = 'auth=;'
        };

        const auth = getAuth(firebase);
        try {
          await auth.signOut();
          await logoutHttp();
          handleComplete();
        } catch {
          handleComplete();
        }
      } else {
        console.error("No firebase, can't logout.");
        return Promise.resolve();
      }
    },
    [setUser, logoutHttp, firebase]
  )

  useEffect(() => {
    // get the initial state of the user.
    let unsubscribe: any;
    if (firebase) {
      const auth = getAuth(firebase);
      unsubscribe = onAuthStateChanged(auth, (_user) => {
        if (_user) {
          _user.getIdToken(true).then(() => {
            const { uid, displayName, photoURL, email, emailVerified, phoneNumber, isAnonymous } = _user;
            setAuthUser({ uid, displayName, photoURL, email, emailVerified, phoneNumber, isAnonymous });
            setIsProviderSigningIn(false);
          })
        } else {
          setAuthUser(null);
          if (locationRef.current.current.pathname !== '/') {
            navigateRef.current('/login')
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
  }, [firebase]);

  useEffect(() => {
    // Refresh token every 30 minutes.
    const timeout = setInterval(() => {
      if (firebase) {
        const auth = getAuth(firebase);
        auth.currentUser?.getIdToken(true).catch(() => { });
      }
    }, 60000 * 30)
    return () => {
      clearInterval(timeout);
    }
  }, [firebase])

  // called after it is determined whether a firebase user is logged in.
  useEffect(() => {
    // if there is an auth user. Try login.
    if (authUser && renew) {
      renew({}, false)
        .catch((err) => {
          if (err.message === 'Network Error') {
            // api servers are down, redirect to /rooms to see the error page.
            navigateRef.current('/rooms');
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
  }, [loginData, renewData, setUser])

  // called once the users data is fetched.
  useEffect(() => {
    // if loginData exists, continue to promotion.
    if (user && authUser) {
      openSnack({ text: 'Successfully logged in!', severity: 'success' })
      setIsPromoting(true);
    }
  }, [user, authUser, openSnack, setIsPromoting]);

  // Handle smoother transitions between multiple loading states
  useEffect(() => {
    const newIsLoading = isLoadingAuth || isRenewing || isSigningin || isProviderSigningIn;
    const timeout =
      // If the next loading state is false. Set a timeout.
      !newIsLoading ?
        setTimeout(() => {
          setIsLoading(false);
        }, 1000) :
        setIsLoading(true);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoadingAuth, isRenewing, isSigningin, isProviderSigningIn])

  const redirect = useCallback(() => {
    setIsPromoting(false);

    if (!navigateRef?.current || !locationRef?.current) {
      return;
    }

    const { current, previous } = locationRef.current;
    // If there's no prevLocation (first request) and the path doesn't equal login. Go to desired path.
    if (!previous && current.pathname !== '/login') {
      return;
    }

    let redirectPath = '/rooms';
    if (previous) {
      const userDest = `${previous.pathname}${previous.search}`;
      if (userDest !== '/login' && userDest !== '/') {
        redirectPath = userDest;
      }
    }

    navigate(redirectPath);
  }, [setIsPromoting]);

  function isPhoneOrTablet() {
    let check = false;
    // eslint-disable-next-line no-useless-escape
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || (window as any).opera);
    return check;
  }

  const signup = useCallback(
    (providerStr: string): Promise<any> => {
      if (firebase) {
        const auth = getAuth(firebase);
        setIsProviderSigningIn(true);
        // here we should handle the different sign up types.
        if (providerStr === 'anonymous') {
          return signInAnonymously(auth)
            .catch((err) => { });
        }

        let provider: GoogleAuthProvider | FacebookAuthProvider;
        if (providerStr === 'facebook') {
          provider = new FacebookAuthProvider();
        } else {
          // must be google.
          provider = new GoogleAuthProvider();
        }

        return signInWithPopup(auth, provider)
          .catch(err => { });
      } else {
        return Promise.resolve();
      }
    },
    [firebase]
  );

  return <UserContext.Provider value={{ login: (login as any), logout, user, authUser, signup }}>
    {isLoading || isPromoting ? null : children}
    <Backdrop className="backdrop" open={isLoading || isPromoting}>
      {
        isPromoting ?
          <div id="post-log-in">
            <Nag
              id="singular-post-login-nag"
              medium="post-login"
              onClick={redirect}
              onDismiss={redirect}
            ></Nag>
            <img
              src="data:image/avif;base64,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"
              alt="WTF Weekly"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={redirect}
            >
              Not Now
            </Button>
          </div> :
          <CircularProgress color="inherit" />
      }
    </Backdrop>
  </UserContext.Provider>
}
