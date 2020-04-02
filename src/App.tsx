import React, { useContext } from 'react';
import { Container } from '@material-ui/core';

import { UserContext } from './Contexts/UserProvider';
import Login from './components/Login/Login';

import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Rooms from './components/Rooms/Rooms';

function App() {
  const { user, login } = useContext(UserContext);

  return <>
    <Navbar />
    <Container className="app-container">
      <div className="app">
        {!user ? <Login login={login} /> : <Rooms />}
      </div>
    </Container >
  </>;
}

export default App;
