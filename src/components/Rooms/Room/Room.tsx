import React from 'react';
import { IconButton, Card, CardContent, CardHeader, Button } from "@material-ui/core";
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';
import useFetchData, { FetchType } from '../../../Hooks/useFetchData';

export function Room({ room, user }: any) {
  const [, , , next] = useFetchData('http://localhost/api/rooms/join/players', FetchType.PUT, undefined);

  function renderPadlock(passcode: string) {
    return <IconButton edge="start" color="secondary" aria-label="menu" >
      {passcode ? <Lock /> : <LockOpen />}
    </IconButton>
  }

  function joinRoom(roomId: string) {
    next({ roomId, clientId: '5e80f84ce91e5800224fe3a9' });
  }

  function renderAction() {
    return <Button variant="contained" color="primary" size="small" onClick={() => joinRoom(room._id)}>Join Room</Button>;
  }

  return <Card className="room" key={room._id}>
    <CardHeader
      className="room-title"
      title={room.name}
      subheader={`${room.players.length}/${room.options.maxPlayers} Players, Status: ${room.status}`}
      avatar={renderPadlock(room.passcode)}
      action={renderAction()}
    />
    <CardContent>
      {/* <div>hello</div> */}
    </CardContent>
  </Card>;
}
