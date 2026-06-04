import React, { lazy, Suspense, useState } from "react";
import { Container, Backdrop, CircularProgress, Typography, Button } from "@material-ui/core";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import UserProvider from "./Contexts/UserProvider";
import "./App.scss";
import { FirebaseProvider } from "./Contexts/FirebaseProvider";
import {
  initialNagRecency,
  NagRecency,
  NewsletterContext,
} from "./components/Newsletter/Context";

const Homepage = lazy(() => import("./components/Homepage/Homepage"));
const Login = lazy(() => import("./components/Login/Login"));
const Rooms = lazy(() => import("./components/Rooms/Rooms"));
const Game = lazy(() => import("./components/Game/GameManager"));

function RouteLoadingFallback() {
  return (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

function LoggedIn() {
  return (
    <FirebaseProvider>
      <UserProvider>
        <Routes>
          <Route
            path="/login/*"
            element={
              <>
                <Navbar />
                <Container className="app-container" maxWidth="lg">
                  <div className="app">
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <Login />
                    </Suspense>
                  </div>
                </Container>
              </>
            }
          />

          <Route
            path="/rooms/*"
            element={
              <>
                <Navbar />
                <Container className="app-container" maxWidth="lg">
                  <div className="app">
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <Rooms />
                    </Suspense>
                  </div>
                </Container>
              </>
            }
          />

          <Route
            path="/game/*"
            element={
              <>
                {window.screen.width > 600 ? <Navbar /> : null}
                <Container className="app-container game" maxWidth="xl">
                  <div className="app game-app">
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <Game />
                    </Suspense>
                  </div>
                </Container>
              </>
            }
          />
        </Routes>
      </UserProvider>
    </FirebaseProvider>
  );
}

const BANNER_DISMISSED_KEY = 'ridrunkulous-banner-dismissed';

function PromoBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
  });

  if (dismissed) {
    return null;
  }

  function handleDismiss() {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setDismissed(true);
  }

  return (
    <div style={{ background: '#111', color: '#fff', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1400, position: 'relative' }}>
      <Typography variant="body2" style={{ flex: 1, textAlign: 'center' }}>
        🍺 Try our new free drinking game — Ridrunkulous®{' '}
        <a
          href="https://www.ridrunkulous.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#4fc3f7', fontWeight: 'bold', marginLeft: 8, textDecoration: 'none' }}
        >
          Play Now →
        </a>
      </Typography>
      <Button onClick={handleDismiss} size="small" style={{ color: '#fff', minWidth: 'unset', padding: '0 8px', fontSize: '1rem', lineHeight: 1 }}>✕</Button>
    </div>
  );
}

function App() {
  const [nagContext, setNagContext] = useState<NagRecency>(initialNagRecency);

  return (
    <NewsletterContext.Provider
      value={{
        campaign: "bad-cards",
        recency: nagContext,
        setRecency: setNagContext,
      }}
    >
      <PromoBanner />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<RouteLoadingFallback />}>
              <Homepage />
            </Suspense>
          }
        />

        <Route path="/*" element={<LoggedIn />} />
      </Routes>
    </NewsletterContext.Provider>
  );
}

export default App;
