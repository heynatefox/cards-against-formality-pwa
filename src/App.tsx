import React, { lazy, Suspense, useState } from 'react';
import { Container, Backdrop, CircularProgress, } from '@material-ui/core';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import UserProvider from './Contexts/UserProvider';
import './App.scss';
import { initialNagRecency, NagRecency, NewsletterNagContext } from './components/Newsletter/Nag';
import { FirebaseProvider } from './Contexts/FirebaseProvider';
import { Banner } from './components/Newsletter/Banner';

const Homepage = lazy(() => import('./components/Homepage/Homepage'));
const Login = lazy(() => import('./components/Login/Login'));
const Rooms = lazy(() => import('./components/Rooms/Rooms'));
const Game = lazy(() => import('./components/Game/GameManager'));

function RouteLoadingFallback() {
  return <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>;
}

function LoggedIn() {
  return (
    <FirebaseProvider>
      <UserProvider>
        <Routes>
          <Route
            path="/login/*"
            element={<>
              <Navbar />
              <Container className="app-container" maxWidth="lg">
                <div className="app">
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Login />
                  </Suspense>
                </div>
              </Container>
            </>}
          />

          <Route
            path="/rooms/*"
            element={<>
              <Navbar />
              <Banner />
              <Container className="app-container" maxWidth="lg">
                <div className="app">
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Rooms />
                  </Suspense>
                </div>
              </Container>
            </>}
          />

          <Route
            path="/game/*"
            element={<>
              {window.screen.width > 600 ? <Navbar /> : null}
              <Container className="app-container game" maxWidth="xl">
                <div className="app game-app">
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Game />
                  </Suspense>
                </div>
              </Container>
            </>}
          />
        </Routes>
      </UserProvider>
    </FirebaseProvider >
  );
}

function App() {
  const [nagContext, setNagContext] = useState<NagRecency>(initialNagRecency);

  return (
    <NewsletterNagContext.Provider value={{ recency: nagContext, setRecency: setNagContext }}>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <Banner />
              <Homepage />
            </Suspense>
          }
        />

        <Route
          path="/*"
          element={<LoggedIn />}
        />
      </Routes>
    </NewsletterNagContext.Provider >
  );
}

export default App;
