import React, { lazy, Suspense, useState } from 'react';
import { Container, Backdrop, CircularProgress, } from '@material-ui/core';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import UserProvider from './Contexts/UserProvider';
import './App.scss';
import { FirebaseProvider } from './Contexts/FirebaseProvider';
import { Banner } from './components/Newsletter/Banner';
import { initialNagRecency, NagRecency, NewsletterContext } from './components/Newsletter/Context';

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
              <Banner medium="rooms-banner" />
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
    <NewsletterContext.Provider value={{ campaign: "newsletter", recency: nagContext, setRecency: setNagContext }}>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <Banner medium="home-banner" />
              <Homepage />
            </Suspense>
          }
        />

        <Route
          path="/*"
          element={<LoggedIn />}
        />
      </Routes>
    </NewsletterContext.Provider>
  );
}

export default App;
