import React, { useContext } from 'react';
import { Container, } from '@material-ui/core';

import { UserContext } from './Contexts/UserProvider';
import Login from './components/Login/Login';

import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Rooms from './components/Rooms/Rooms';
import { Route, Switch } from 'react-router-dom';
import { RouterContext } from './Contexts/RouteProvider';
import Homepage from './components/Homepage/Homepage';

function App() {
  const { login } = useContext(UserContext);
  const { history: { location } } = useContext(RouterContext);
  console.log(location)
  return <>
    {location?.pathname !== '/' ? <Navbar /> : null}

    <Switch>

      <Route exact={true} path="/">
        <Homepage />
      </Route>;

            <Route path="/login">
        <Container className="app-container" maxWidth="lg">
          <div className="app">
            <Login login={login} />
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

          </Switch>
  </>;
}

export default App;
