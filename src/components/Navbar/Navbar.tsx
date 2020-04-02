import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { UserContext } from '../../Contexts/UserProvider';
import './Navbar.scss';

export default function Navbar() {
  const { user, logout } = useContext(UserContext);

  return <AppBar position="static">
    <Toolbar className="inner-nav">
      <IconButton edge="start" color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Typography variant="caption" >
        Cards Against Formality
      </Typography>
      <div className="spacer" />
      <Typography variant="h6" >
        {user ? user.username : null}
      </Typography>
      <Button onClick={logout} color="inherit">Logout</Button>
    </Toolbar>
  </AppBar>
}