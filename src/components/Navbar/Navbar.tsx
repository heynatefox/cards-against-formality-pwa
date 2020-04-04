import React, { useContext } from 'react';
import { Typography, Button } from '@material-ui/core';

import { UserContext } from '../../Contexts/UserProvider';
import './Navbar.scss';

export default function Navbar() {
  const { user, logout } = useContext(UserContext);

  if (!user) {
    return <div className="nav-bar" />
  }

  return <div className="nav-bar">
    <Typography variant="h6" >
      {user ? user.displayName : null}
    </Typography>
    <div className="spacer" />
    <Button className="logout-button" onClick={logout} color="inherit">Logout</Button>
  </div>
}