import React from 'react';
import { Container, } from '@material-ui/core';

import UserProvider from './Contexts/UserProvider';
import Login from './components/Login/Login';

import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Rooms from './components/Rooms/Rooms';
import { Route, Switch } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';

function App() {
  return <>
    <Switch>

      <Route exact={true} path="/">
        <Homepage />
      </Route>;

      <UserProvider>
        <Navbar />
        <Route path="/login">
          <Container className="app-container" maxWidth="lg">
            <div className="app">
              <Login />
            </div>
          </Container>
        </Route>;

                <Route path="/rooms">
          <Container className="app-container" maxWidth="lg">
            <div className="app">
              <Rooms />
            </div>
          </Container>
        </Route>;
      </UserProvider>
    </Switch>
  </>;
}

export default App;
