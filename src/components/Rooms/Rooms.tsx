import React, { useState, useContext, useEffect } from 'react';
import { Container, CircularProgress, Button, Card, CardHeader, CardContent, Backdrop } from "@material-ui/core";
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import io from 'socket.io-client';

import { UserContext } from '../../Contexts/UserProvider';
import { Room } from './Room/Room';
import useFetchData from '../../Hooks/useFetchData';
import CreateRoom from './CreateRoom/CreateRoom';
import './Rooms.scss';

axios.defaults.withCredentials = true;

export default function Rooms() {
  const { user } = useContext(UserContext);
  const [rooms, setRooms] = useState<any[]>([]);
  const [socket] = useState(() => {
    // Construct a socket connection with the given url . Uses the existing connection if one is already present.
    return io('localhost', {
      transports: ['websocket'],
      path: '/socket',
      autoConnect: false,
      query: {
        // auth
      }
    });
  });
  useEffect(() => {
    socket.on('rooms.*', (data: any) => {
      console.log(data);
    })
    socket.connect()
  }, [socket]);

  const [isCreating, setIsCreating] = useState(false);

  // TODO: implement infinite scrolling.
  const [res, isLoading] = useFetchData<{ rows: any[] }>('http://localhost/api/rooms?pageSize=100');

  useEffect(() => {
    if (res) {
      console.log(res)
      setRooms(res.rows);
    }
  }, [res]);

  function renderRooms() {
    if (isCreating) {
      return <CreateRoom />
    }

    if (isLoading) {
      return <Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>;
    }

    return <div className="rooms-list">
      {rooms.map(room => <Room key={room._id} room={room} user={user} />)}
    </div>;
  }

  function onCreate() {
    setIsCreating(prevIsCreating => !prevIsCreating);
  }

  return <Container className="rooms-container">
    <Card variant="elevation">
      <CardHeader
        title={!isCreating ? 'Create or Join a Room!' : 'Creating a New Room'}
        subheader="Fun fun fun!"
        action={
          <Button
            onClick={onCreate}
            className="create-button"
            variant="outlined"
            color="secondary"
            size="medium"
            endIcon={!isCreating ? <AddCircleIcon /> : <RemoveIcon />}
          >
            {!isCreating ? 'Create Room' : 'Exit'}
          </Button>
        }
      />
      <CardContent>
        {renderRooms()}
      </CardContent>
    </Card>
  </Container>
}