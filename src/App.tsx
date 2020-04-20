import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Container, Backdrop, CircularProgress, } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";

import Navbar from './components/Navbar/Navbar';
import UserProvider from './Contexts/UserProvider';
import './App.scss';

const Homepage = lazy(() => import('./components/Homepage/Homepage'));
const Login = lazy(() => import('./components/Login/Login'));
const Rooms = lazy(() => import('./components/Rooms/Rooms'));
const Game = lazy(() => import('./components/Game/GameManager'));

function RouteLoadingFallback() {
  return <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>;
}

const firebaseConfig = {
  apiKey: "AIzaSyCZLzkZG3s1KZOnASu_RrSL_C2_1PaJTNA",
  authDomain: "cards-against-formality.firebaseapp.com",
  databaseURL: "https://cards-against-formality.firebaseio.com",
  projectId: "cards-against-formality",
  storageBucket: "cards-against-formality.appspot.com",
  messagingSenderId: "963787405555",
  appId: "1:963787405555:web:9a16ebc50e7de8e02d5f86",
  measurementId: "G-CC9C8EF5ZP"
};

function App() {
  const [isFirebaseInit, setIsFirebaseInit] = useState(false);
  useEffect(() => {
    // Initialize Firebase
    console.log('initialize app');
    firebase.initializeApp(firebaseConfig);

    if (process.env.NODE_ENV === 'production') {
      firebase.analytics();
    }

    setIsFirebaseInit(true);
  }, []);

  return <>
    <Switch>

      <Route exact={true} path="/">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Homepage />
        </Suspense>
      </Route>

      <UserProvider isFirebaseInit={isFirebaseInit}>
        <Navbar />
        <Route path="/login">
          <Container className="app-container" maxWidth="lg">
            <div className="app">
              <Suspense fallback={<RouteLoadingFallback />}>
                <Login />
              </Suspense>
            </div>
          </Container>
        </Route>

        <Route path="/rooms">
          <Container className="app-container" maxWidth="lg">
            <div className="app">
              <Suspense fallback={<RouteLoadingFallback />}>
                <Rooms />
              </Suspense>
            </div>
          </Container>
        </Route>

        <Route path="/game">
          <Container className="app-container" maxWidth="lg">
            <div className="app">
              <Suspense fallback={<RouteLoadingFallback />}>
                <Game />
              </Suspense>
            </div>
          </Container>
        </Route>
      </UserProvider>
    </Switch>
  </>;
}

export default App;
