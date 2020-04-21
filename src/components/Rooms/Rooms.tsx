import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Container, Button, Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';

import { UserContext } from '../../Contexts/UserProvider';
import Room from './Room/Room';
import useFetchData, { FetchType } from '../../Hooks/useFetchData';
import CreateRoom from './CreateRoom/CreateRoom';
import { RouterContext } from '../../Contexts/RouteProvider';
import useRooms from '../../Hooks/useRooms';
import './Rooms.scss';

export default function Rooms() {

  const { history } = useContext(RouterContext);
  const { user, token } = useContext(UserContext);
  const [rooms, isLoading] = useRooms(token);
  const [isCreating, setIsCreating] = useState(false);
  const onCreate = useCallback(() => setIsCreating(prevIsCreating => !prevIsCreating), []);

  const [, , joinRoomErrorMessage, join] = useFetchData(`https:////api.cardsagainstformality.io/api/rooms/join/players`, FetchType.PUT, undefined);
  useEffect(() => {
    // display error toast.
  }, [joinRoomErrorMessage]);

  const joinRoom = useCallback(_joinRoom, [join, history, user]);
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
        console.log('joining room', `/game?_id=${roomId}`)
        history.push(`/game?_id=${roomId}`, axiosRes.data)
        // todo: fire success toasty.
      })
      .catch(() => { });
  }

  function renderRooms() {
    if (isCreating) {
      return <CreateRoom onJoin={joinRoom} />
    }

    if (!rooms?.length && !isLoading) {
      return <Typography variant="body1">
        There are currently no active rooms
      </Typography>;
    }

    return <div className="rooms-list">
      {rooms.map(room => <Room key={room._id} room={room} user={user} onJoin={joinRoom} />)}
    </div>;
  }

  return <Container className="rooms-container" maxWidth="lg">
    <Card className="rooms-card" raised={true}>
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
  </Container>;
};
