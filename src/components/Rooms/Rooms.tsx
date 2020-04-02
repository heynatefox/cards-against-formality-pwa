import React, { useState, useContext, useEffect } from 'react';
import { Container, CircularProgress, Typography, Button } from "@material-ui/core";
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { UserContext } from '../../Contexts/UserProvider';
import io from 'socket.io-client';

import { Room } from './Room/Room';
import useFetchData from '../../Hooks/useFetchData';
import CreateRoom from './CreateRoom/CreateRoom';
import './Rooms.scss';

axios.defaults.withCredentials = true;

export default function Rooms() {
  const { user, getAuthCookie } = useContext(UserContext);
  const [socket] = useState(() => {
    const auth = encodeURIComponent(getAuthCookie());
    console.log(auth)
    // Construct a socket connection with the given url. Uses the existing connection if one is already present.
    return io.connect('localhost/', {
      transports: ['websocket'],
      path: '/socket',
      autoConnect: false,
      query: {
        auth
      }
    });
  });
  useEffect(() => {
    socket.connect()
  }, [])

  const [isCreating, setIsCreating] = useState(false);
  const [rooms, isLoading] = useFetchData('http://localhost/api/rooms');

  function renderRooms() {
    if (isCreating) {
      return <CreateRoom />
    }

    if (isLoading) {
      return <CircularProgress />;
    }

    return <div className="rooms-list">
      {rooms.map(room => <Room room={room} user={user} />)}
    </div>;
  }

  function onCreate() {
    setIsCreating(prevIsCreating => !prevIsCreating);
  }

  return <Container className="rooms-container">
    <Typography variant="h6">
      {!isCreating ? 'Create or Join a Room!' : 'Creating a New Room'}
    </Typography>
    <Button onClick={onCreate} className="create-button" variant="outlined" color="secondary" size="medium" endIcon={<AddCircleIcon />}>Create Room</Button>
    {renderRooms()}
  </Container>
}