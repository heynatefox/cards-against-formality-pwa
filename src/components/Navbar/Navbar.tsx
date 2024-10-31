import React, { useContext, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, IconButton, Menu, MenuItem, Switch, Grid, Button } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { UserContext } from '../../Contexts/UserProvider';
import { ThemeContext } from '../../Contexts/ThemeProvider';

import './Navbar.scss';
import * as Newsletter from '../Newsletter/MenuButton';

export default React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, onChange } = useContext(ThemeContext);
  const { user, logout, authUser } = useContext(UserContext);
  const [isOpen, setOpen] = useState(false);
  const anchorEl = useRef(null);
  function handleClose() {
    setOpen(false);
  }

  if (location.pathname === '/') {
    return null;
  }

  const logo = <Typography className="logo" variant="h4" onClick={() => navigate('/')}>
    Cards Against Formality
  </Typography>;
  if (!user) {
    return <div className="nav-bar">
      {logo}
      {authUser ? <><div className="spacer" />
        <Button onClick={() => { handleClose(); logout(); }}>Logout</Button></> : null}
    </div>
  }

  return <div className="nav-bar">
    <Typography className="username" variant="h6" >
      {user?.username}
    </Typography>
    <div className="spacer" />
    {logo}
    <div className="spacer" />
    <IconButton
      ref={anchorEl}
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={() => setOpen(prevOpen => !prevOpen)}
      color="inherit"
    >
      <AccountCircle fontSize="large" />
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl?.current}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      keepMounted={true}
      open={isOpen}
      onClose={handleClose}
    >
      <MenuItem>{user?.username}</MenuItem>
      <MenuItem>
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Light</Grid>
            <Grid item>
              <Switch checked={name === 'dark'} onChange={onChange} />
            </Grid>
            <Grid item>Dark</Grid>
          </Grid>
        </Typography>
      </MenuItem>
      <Newsletter.MenuButton medium="menu"></Newsletter.MenuButton>
      <MenuItem onClick={() => { handleClose(); logout(); }}>Logout</MenuItem>
    </Menu>
  </div>
});
