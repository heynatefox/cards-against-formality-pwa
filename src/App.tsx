import React, { lazy, Suspense } from 'react';
import { Container, Backdrop, CircularProgress, } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import UserProvider from './Contexts/UserProvider';
import './App.scss';

const Homepage = lazy(() => import('./components/Homepage/Homepage'));
const Login = lazy(() => import('./components/Login/Login'));
const Rooms = lazy(() => import('./components/Rooms/Rooms'));
const Game = lazy(() => import('./components/Game/Game'));

function RouteLoadingFallback() {
  return <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>;
}

function App() {
  return <>
    <Switch>

      <Route exact={true} path="/">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Homepage />
        </Suspense>
      </Route>

      <UserProvider>
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
