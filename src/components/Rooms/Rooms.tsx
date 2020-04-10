import React, { useState, useContext, useEffect, useReducer, useCallback } from 'react';
import { Container, CircularProgress, Button, Card, CardHeader, CardContent, Backdrop } from "@material-ui/core";
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import io from 'socket.io-client';

import { UserContext } from '../../Contexts/UserProvider';
import { Room } from './Room/Room';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';
import CreateRoom from './CreateRoom/CreateRoom';
import RoomsReducer from './RoomsReducer';
import './Rooms.scss';
import { RouterContext } from '../../Contexts/RouteProvider';

axios.defaults.withCredentials = true;

export default function Rooms() {
  const { history } = useContext(RouterContext);
  const { user, token } = useContext(UserContext);
  const [rooms, dispatch] = useReducer(RoomsReducer, []);

  useEffect(() => {
    let socket: SocketIOClient.Socket;
    if (token?.length) {
      socket = io('localhost', {
        transports: ['websocket'],
        path: '/socket',
        autoConnect: false,
        query: {
          auth: token
        }
      });

      socket.on('rooms', ({ payload, updateType }: any) => {
        switch (updateType) {
          case 'created':
            dispatch({ type: 'ADD_ROOM', data: payload })
            break;
          case 'updated':
            dispatch({ type: 'UPDATE_ROOM', data: payload })
            break;
          case 'removed':
            dispatch({ type: 'REMOVED_ROOM', data: payload })
            break;
          default:
            break;
        }
      });

      socket.connect()
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
    }
  }, [token]);

  const [isCreating, setIsCreating] = useState(false);

  // TODO: implement infinite scrolling.
  const [res, isLoading] = useFetchData<{ rows: any[] }>('http://localhost/api/rooms?pageSize=100');

  useEffect(() => {
    if (res) {
      // investigate why this is called twice. Might just be a dev thing.
      dispatch({ type: 'MULTI_ADD_ROOMS', data: res.rows })
    }
  }, [res]);

  const [, , joinRoomErrorMessage, join] = useFetchData('http://localhost/api/rooms/join/players', FetchType.PUT, undefined);
  useEffect(() => {
    // display error toast.
  }, [joinRoomErrorMessage]);

  const joinRoom = useCallback(_joinRoom, [join, history]);
  function _joinRoom(roomId: string, passcode?: string) {
    if (!user) {
      // display toast error.
      return;
    }

    const data: any = { roomId, clientId: user._id, populate: ['players', 'spectators'] };
    if (passcode?.length) {
      data.passcode = passcode;
    }

    join(data)
      .then((axiosRes) => {
        history.push(`/game?_id=${roomId}`, axiosRes.data)
      })
      .catch(() => { });
  }

  function renderRooms() {
    if (isCreating) {
      return <CreateRoom onJoin={joinRoom} />
    }

    if (isLoading) {
      return <Backdrop className="backdrop" open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>;
    }

    return <div className="rooms-list">
      {rooms.map(room => <Room key={room._id} room={room} user={user} onJoin={joinRoom} />)}
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